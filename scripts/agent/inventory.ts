/**
 * Ground-truth inventory for agents: what already exists in the framework.
 * Prints keys and names only, never values (data files may contain encrypted secrets).
 *
 * Usage: tsx scripts/agent/inventory.ts [all|steps|pages|locators|network|labels|data|pending]
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const section = process.argv[2] ?? 'all';
const PLACEHOLDER = '__REQUIRED__';

function* walk(dir: string, ext: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p, ext);
    else if (p.endsWith(ext)) yield p;
  }
}

function entries(node: unknown, prefix = ''): [string, unknown][] {
  if (node !== null && typeof node === 'object' && !Array.isArray(node)) {
    return Object.entries(node).flatMap(([k, v]) => entries(v, prefix ? `${prefix}.${k}` : k));
  }
  if (Array.isArray(node)) {
    return node.flatMap((value, index) => entries(value, prefix ? `${prefix}.${index}` : String(index)));
  }
  return [[prefix, node]];
}

function print(title: string, rows: string[]): void {
  console.log(`\n## ${title} (${rows.length})`);
  for (const r of rows) console.log(`- ${r}`);
}

function steps(): void {
  const re = /\b(Given|When|Then)\(\s*(['"`])((?:\\.|(?!\2).)*)\2/g;
  const rows: string[] = [];
  for (const f of walk(join(root, 'tests', 'steps'), '.ts')) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(re)) rows.push(`${m[1]} ${m[3]}   [${relative(root, f)}]`);
  }
  print('Step definitions (use `npx bddgen export` as the authoritative list)', rows.sort());
}

function pages(): void {
  const rows: string[] = [];
  for (const dir of ['pages', 'components', 'verifications']) {
    for (const f of walk(join(root, 'src', dir), '.ts')) {
      const src = readFileSync(f, 'utf8');
      const methods = [...src.matchAll(/^ {2}(?:async\s+)?([a-zA-Z]\w*)\s*\([^)]*\)\s*(?::[^{]+)?\{/gm)]
        .map((m) => m[1])
        .filter((n) => n !== 'constructor');
      rows.push(`${relative(root, f)}: ${methods.join(', ') || '(no public methods found)'}`);
    }
  }
  print('Pages, components, verifications (best-effort method list)', rows);
}

function keys(title: string, dir: string, topLevelOnly = false): void {
  const rows: string[] = [];
  for (const f of walk(dir, '.json')) {
    const parsed: unknown = JSON.parse(readFileSync(f, 'utf8'));
    const ks = topLevelOnly ? Object.keys(parsed as object) : entries(parsed).map(([k]) => k);
    rows.push(`${relative(root, f)}: ${ks.join(', ')}`);
  }
  print(title, rows);
}

function pending(): void {
  const rows: string[] = [];
  for (const dir of ['data', 'labels']) {
    for (const f of walk(join(root, 'src', dir), '.json')) {
      for (const [k, v] of entries(JSON.parse(readFileSync(f, 'utf8')))) {
        if (v === PLACEHOLDER) rows.push(`${relative(root, f)}: ${k}`);
      }
    }
  }
  print(`Keys waiting for a value (${PLACEHOLDER})`, rows);
}

const all = section === 'all';
if (all || section === 'steps') steps();
if (all || section === 'pages') pages();
if (all || section === 'locators') keys('Locator keys', join(root, 'src', 'locators'));
if (all || section === 'network') keys('Network registry keys', join(root, 'src', 'network'), true);
if (all || section === 'labels') keys('Label keys', join(root, 'src', 'labels'));
if (all || section === 'data') keys('Data keys', join(root, 'src', 'data'));
if (all || section === 'pending') pending();
