import 'dotenv/config';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { getByKey } from '../../src/core/data-key.js';
import { getLabel } from '../../src/core/label-key.js';
import { getRuntimeContext, readEnvConfig, readStoreData, readStoreLabels, type Labels } from '../../src/core/runtime.js';

type Case = {
  id: string;
  requirements: string[];
  outcomes: string[];
  data?: string[];
  labels?: string[];
  localizedLabels?: string[];
  authRoles?: string[];
  instances?: number;
};
type Scope = { env: string; store: string; locale: string; cases: Case[]; target?: 'framework' | 'storefront' };
type Test = { status: string; results: { status: string }[] };
type Suite = { suites?: Suite[]; specs?: { title: string; tags?: string[]; file?: string; tests: Test[] }[] };
type Report = { suites: Suite[] };

const require = createRequire(import.meta.url);
const results = 'playwright-report/agent';
const caseId = /^[A-Z][A-Z0-9]*(?:[-_][A-Z0-9]+)*[-_]\d+$/;

function validateScope(scope: Scope): void {
  if (!Array.isArray(scope.cases) || !scope.cases.length) throw new Error('Scope requires at least one case');
  if (scope.target !== undefined && !['framework', 'storefront'].includes(scope.target)) {
    throw new Error('Scope target must be framework or storefront');
  }
  const ids = new Set<string>();
  for (const entry of scope.cases) {
    const { id, requirements, outcomes, instances = 1 } = entry;
    if (!caseId.test(id) || ids.has(id)) throw new Error('Scope contains an invalid or duplicate case ID');
    if (!Array.isArray(requirements) || !requirements.length || !Array.isArray(outcomes) || !outcomes.length) {
      throw new Error(`${id} requires requirement IDs and approved expected outcomes`);
    }
    for (const values of [requirements, outcomes, entry.data, entry.labels, entry.localizedLabels, entry.authRoles]) {
      if (values !== undefined && (!Array.isArray(values) || values.some(value => typeof value !== 'string' || !value.trim()))) {
        throw new Error(`${id} contains an invalid scope list`);
      }
    }
    if (!Number.isInteger(instances) || instances < 1) throw new Error(`${id} requires a positive instance count`);
    ids.add(id);
  }
}

function preflight(scope: Scope): void {
  const active = getRuntimeContext();
  for (const field of ['env', 'store', 'locale'] as const) {
    if (active[field] !== scope[field]) throw new Error(`Scope ${field} differs from the active runtime context`);
  }
  const config = readEnvConfig();
  if (scope.target !== 'framework' && Object.values(config).some(url => new URL(url).hostname.endsWith('.invalid'))) {
    throw new Error('Configure approved storefront and API URLs before execution');
  }
  const data = scope.cases.some(entry => entry.data?.length) ? readStoreData({ decrypt: false }) : {};
  const labels = scope.cases.some(entry => entry.labels?.length) ? readStoreLabels() : {};
  const localeFile = join('src', 'labels', scope.store, `${scope.locale}.json`);
  const localeLabels = existsSync(localeFile) ? JSON.parse(readFileSync(localeFile, 'utf8')) as Labels : {};
  const problems: string[] = [];
  function check(id: string, operation: () => void): void {
    try { operation(); }
    catch (error) { problems.push(`${id}: ${(error as Error).message}`); }
  }
  for (const entry of scope.cases) {
    for (const key of entry.data ?? []) {
      check(entry.id, () => {
        const value = getByKey(data, key);
        if (value === null || value === '') throw new Error(`Data key "${key}" is empty`);
      });
    }
    for (const key of entry.labels ?? []) check(entry.id, () => { getLabel(labels, key); });
    for (const key of entry.localizedLabels ?? []) check(entry.id, () => { getLabel(localeLabels, key); });
    for (const role of entry.authRoles ?? []) {
      check(entry.id, () => {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(role)) throw new Error('Invalid auth role name');
        const state = join('auth', scope.env, scope.store, scope.locale, `${role}.json`);
        if (!existsSync(state)) throw new Error(`Provision browser state at ${state}`);
      });
    }
  }
  if (problems.length) throw new Error(problems.join('\n'));
}

function run(packageName: string, entry: string, args: string[], report?: string): number {
  const manifest = require.resolve(`${packageName}/package.json`);
  const child = spawnSync(process.execPath, [resolve(dirname(manifest), entry), ...args], {
    stdio: report ? ['ignore', 'ignore', 'inherit'] : 'inherit',
    env: report ? { ...process.env, PLAYWRIGHT_JSON_OUTPUT_FILE: resolve(report) } : process.env,
  });
  if (child.error) throw child.error;
  return child.status ?? 1;
}

function getReport(file: string, scope: Scope, checkRun: boolean): Record<string, string> {
  if (!existsSync(file)) throw new Error(`Missing Playwright report: ${file}`);
  const report = JSON.parse(readFileSync(file, 'utf8')) as Report;
  const actual = new Map<string, Test[]>();
  function visit(suite: Suite): void {
    for (const spec of suite.specs ?? []) {
      const id = spec.title.split(' - ', 1)[0];
      if (!scope.cases.some(entry => entry.id === id)) throw new Error('Selected test has no approved case title');
      if (spec.tags?.some(tag => tag.replace(/^@/, '') === id || tag.replace(/^@/, '') === `TC-${id}`)) {
        throw new Error(`${id} is duplicated as a scenario tag`);
      }
      if (scope.target === 'framework' && !spec.file?.replaceAll('\\', '/').endsWith('features/framework/FrameworkSmoke.feature.spec.js')) {
        throw new Error('Framework scope selected a test outside the framework smoke feature');
      }
      actual.set(id, [...(actual.get(id) ?? []), ...spec.tests]);
    }
    for (const child of suite.suites ?? []) visit(child);
  }
  for (const suite of report.suites) visit(suite);
  return Object.fromEntries(scope.cases.map(({ id, instances = 1 }) => {
    const tests = actual.get(id) ?? [];
    if (tests.length !== instances) return [id, `expected ${instances} instance(s), found ${tests.length}`];
    if (!checkRun) return [id, 'collected'];
    if (tests.some(test => test.status === 'skipped' || test.results.some(result => result.status === 'skipped'))) {
      return [id, 'skipped'];
    }
    const successful = tests.every(test =>
      test.status === 'expected' && test.results.length === 1 && test.results[0]?.status === 'passed'
    );
    return [id, successful ? 'verified' : 'failed'];
  }));
}

function verify(scope: Scope, scopeFile: string): void {
  if (run('playwright-bdd', 'dist/cli/index.js', []) !== 0) throw new Error('BDD generation failed');
  mkdirSync(results, { recursive: true });
  const grep = `(?:^|\\s)(?:${scope.cases.map(entry => entry.id).join('|')}) - `;
  const args = ['test', '--grep', grep, '--retries=0', '--reporter=json'];
  const collection = join(results, 'agent-collection.json');
  const execution = join(results, 'agent-results.json');
  const summary = join(results, 'agent-summary.json');
  for (const file of [collection, execution, summary]) rmSync(file, { force: true });
  const collectExit = run('@playwright/test', 'cli.js', [...args, '--list'], collection);
  const collected = getReport(collection, scope, false);
  if (collectExit !== 0 || Object.values(collected).some(value => value !== 'collected')) {
    throw new Error(`Collection failed: ${JSON.stringify(collected)}`);
  }
  const exit = run('@playwright/test', 'cli.js', args, execution);
  const cases = getReport(execution, scope, true);
  writeFileSync(summary, JSON.stringify({ scope: scopeFile, env: scope.env, store: scope.store, locale: scope.locale, cases }, null, 2) + '\n');
  for (const [id, outcome] of Object.entries(cases)) console.log(`${id}: ${outcome}`);
  if (exit !== 0 || Object.values(cases).some(value => value !== 'verified')) {
    throw new Error(`Verification failed. See ${summary} and ${execution} locally.`);
  }
}

try {
  const [mode, scopeFile] = process.argv.slice(2);
  if (!scopeFile || !['preflight', 'verify'].includes(mode)) throw new Error('Usage: verify.ts preflight|verify <scope.json>');
  const scope = JSON.parse(readFileSync(scopeFile, 'utf8')) as Scope;
  validateScope(scope);
  preflight(scope);
  if (mode === 'verify') verify(scope, scopeFile);
  else console.log(`Ready: ${scope.cases.length} case(s) in ${scope.env}/${scope.store}/${scope.locale}`);
} catch (error) {
  console.error((error as Error).message);
  process.exitCode = 1;
}
