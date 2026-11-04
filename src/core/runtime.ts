import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { decrypt, isEncrypted } from './crypto';

const DEFAULT_LOCALE = 'en-us';
const ROOT = resolve(process.cwd(), 'src');

export type Labels = Record<string, string>;
export type StoreData = Record<string, unknown>;
export type EnvConfig = { baseURL: string; apiBaseURL: string };
export type RuntimeContext = { env: string; store: string; locale: string; browserLocale: string };

type Json = Record<string, unknown>;
const isObject = (v: unknown): v is Json => v !== null && typeof v === 'object' && !Array.isArray(v);

// 'en-us' -> 'en-US', 'ar' -> 'ar' (Playwright's `locale` option expects BCP-47 casing)
const toBrowserLocale = (l: string): string => {
  const [lang, region] = l.split('-');
  return region ? `${lang}-${region.toUpperCase()}` : lang;
};

export function getRuntimeContext(): RuntimeContext {
  // lowercase everything: Windows paths are case-insensitive, Linux/CI paths are not
  const env = (process.env.TEST_ENV ?? 'dev').toLowerCase();
  const store = (process.env.STORE ?? 'vpro').toLowerCase();
  const locale = (process.env.LOCALE ?? DEFAULT_LOCALE).toLowerCase();
  return { env, store, locale, browserLocale: toBrowserLocale(locale) };
}

// ---- cached JSON reader ----
const fileCache = new Map<string, unknown>();

function readJson<T extends object>(file: string, optional = false): T {
  if (fileCache.has(file)) return fileCache.get(file) as T;
  if (!existsSync(file)) {
    if (optional) return {} as T;
    const { env, store, locale } = getRuntimeContext();
    throw new Error(`Missing file: ${file} (TEST_ENV=${env}, STORE=${store}, LOCALE=${locale})`);
  }
  const parsed = JSON.parse(readFileSync(file, 'utf8')) as T;
  fileCache.set(file, parsed);
  return parsed;
}

function deepMerge(base: Json, over: Json): Json {
  const out: Json = { ...base };
  for (const [k, v] of Object.entries(over)) {
    const b = out[k];
    out[k] = isObject(v) && isObject(b) ? deepMerge(b, v) : v; // arrays and primitives are replaced
  }
  return out;
}

function decryptDeep(node: unknown, path = ''): unknown {
  if (typeof node === 'string') {
    if (!isEncrypted(node)) return node;
    try {
      return decrypt(node);
    } catch (e) {
      throw new Error(`${path}: ${(e as Error).message}`); // field path, never the value
    }
  }
  if (Array.isArray(node)) return node.map((v, i) => decryptDeep(v, `${path}[${i}]`));
  if (isObject(node)) {
    return Object.fromEntries(
      Object.entries(node).map(([k, v]) => [k, decryptDeep(v, path ? `${path}.${k}` : k)]),
    );
  }
  return node;
}

// ---- public readers ----
const dataCache = new Map<string, StoreData>();

export function readStoreData(): StoreData {
  const { env, store, locale } = getRuntimeContext();
  const cacheKey = `${env}/${store}/${locale}`;

  if (!dataCache.has(cacheKey)) {
    const dir = resolve(ROOT, 'data', env, store);
    const common = readJson<Json>(resolve(dir, 'common.json'));
    const localized = readJson<Json>(resolve(dir, `${locale}.json`), true);
    dataCache.set(cacheKey, decryptDeep(deepMerge(common, localized)) as StoreData);
  }
  return structuredClone(dataCache.get(cacheKey) as StoreData); // callers cannot mutate the shared copy
}

const labelCache = new Map<string, Labels>();

export function readStoreLabels(): Labels {
  const { store, locale } = getRuntimeContext();
  const cacheKey = `${store}/${locale}`;
  const cached = labelCache.get(cacheKey);
  if (cached) return cached;

  const dir = resolve(ROOT, 'labels', store);
  const fallback = readJson<Labels>(resolve(dir, `${DEFAULT_LOCALE}.json`));
  let labels = fallback;

  if (locale !== DEFAULT_LOCALE) {
    const localized = readJson<Labels>(resolve(dir, `${locale}.json`));
    const missing = Object.keys(fallback).filter((k) => !(k in localized));
    if (missing.length) console.warn(`[labels] ${store}/${locale} missing keys: ${missing.join(', ')}`);
    labels = { ...fallback, ...localized };
  }
  labelCache.set(cacheKey, labels);
  return labels;
}

export function readEnvConfig(): EnvConfig {
  const { env, store } = getRuntimeContext();
  const all = readJson<Record<string, EnvConfig>>(resolve(ROOT, 'config', 'environments', `${env}.json`));
  const cfg = all[store];
  if (!cfg) throw new Error(`No config for store "${store}" in environments/${env}.json`);

  const merged: EnvConfig = {
    baseURL: process.env.BASE_URL ?? cfg.baseURL, // CI can override
    apiBaseURL: process.env.API_BASE_URL ?? cfg.apiBaseURL,
  };
  if (!merged.apiBaseURL) throw new Error('apiBaseURL is required (API waits depend on it)');
  return merged;
}
