import 'dotenv/config';
import { randomBytes } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { decrypt, encrypt, isEncrypted } from '../src/core/crypto';

const SENSITIVE_KEY = /pass(word)?|secret|token|email/i;
const PLACEHOLDER = '__REQUIRED__'; // reported by `npm run agent:inventory pending`, not a plaintext secret

// Hidden prompt: the value never lands in shell history or the terminal.
// (_writeToOutput is an undocumented readline internal, but widely used for this.)
function promptHidden(question: string): Promise<string> {
  return new Promise((res) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    (rl as unknown as { _writeToOutput: () => void })._writeToOutput = () => undefined;
    process.stdout.write(question);
    rl.question('', (answer) => {
      rl.close();
      process.stdout.write('\n');
      res(answer);
    });
  });
}

function* jsonFiles(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* jsonFiles(p);
    else if (p.endsWith('.json')) yield p;
  }
}

function check(node: unknown, path: string, file: string, errors: string[]): void {
  if (typeof node === 'string') {
    if (isEncrypted(node)) {
      try {
        decrypt(node);
      } catch (e) {
        errors.push(`${file}: ${path}: ${(e as Error).message}`);
      }
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => check(v, `${path}[${i}]`, file, errors));
    return;
  }
  if (node !== null && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      const p = path ? `${path}.${k}` : k;
      if (typeof v === 'string' && SENSITIVE_KEY.test(k) && !isEncrypted(v) && v !== PLACEHOLDER) {
        errors.push(`${file}: ${p}: sensitive field is not encrypted`);
      }
      check(v, p, file, errors);
    }
  }
}

async function main(): Promise<void> {
  switch (process.argv[2]) {
    case 'keygen':
      console.log(randomBytes(32).toString('base64'));
      break;
    case 'encrypt':
      console.log(encrypt(await promptHidden('Value to encrypt: ')));
      break;
    case 'decrypt': {
      // local debugging only; prints plaintext. Agents must never run this.
      const value = process.argv[3];
      if (!value) throw new Error('Usage: decrypt <enc:v1:...>');
      console.log(decrypt(value));
      break;
    }
    case 'check': {
      const errors: string[] = [];
      for (const f of jsonFiles(resolve(process.cwd(), 'src', 'data'))) {
        check(JSON.parse(readFileSync(f, 'utf8')), '', f, errors);
      }
      if (errors.length) {
        console.error(errors.join('\n'));
        process.exit(1);
      }
      console.log('All data files OK');
      break;
    }
    default:
      console.error('Usage: keygen | encrypt | decrypt <enc:v1:...> | check');
      process.exit(1);
  }
}

main().catch((e: unknown) => {
  console.error((e as Error).message);
  process.exit(1);
});
