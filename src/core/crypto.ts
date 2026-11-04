import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const PREFIX = 'enc:v1:';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

// dotenv is loaded once in playwright.config.ts and scripts/secrets.ts, not here.
function getKey(): Buffer {
  // trim: CI secrets often carry a trailing newline that the strict Base64 check would reject
  const encoded = process.env.TEST_DATA_ENCRYPTION_KEY?.trim();

  if (!encoded) {
    throw new Error('TEST_DATA_ENCRYPTION_KEY is missing');
  }

  const key = Buffer.from(encoded, 'base64');

  if (key.length !== 32 || key.toString('base64') !== encoded) {
    throw new Error('TEST_DATA_ENCRYPTION_KEY must be a Base64-encoded 32-byte key');
  }

  return key;
}

export const isEncrypted = (value: unknown): value is string =>
  typeof value === 'string' && value.startsWith(PREFIX);

export function encrypt(value: string): string {
  if (typeof value !== 'string') {
    throw new TypeError('encrypt expects a string');
  }

  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-gcm', key, iv, { authTagLength: TAG_LENGTH });

  cipher.setAAD(Buffer.from(PREFIX));

  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const payload = Buffer.concat([iv, cipher.getAuthTag(), ciphertext]);

  return PREFIX + payload.toString('base64');
}

export function decrypt(value: string): string {
  if (typeof value !== 'string' || !value.startsWith(PREFIX)) {
    throw new Error('Expected an enc:v1 encrypted string');
  }

  const key = getKey();

  try {
    const encoded = value.slice(PREFIX.length);
    const payload = Buffer.from(encoded, 'base64');

    if (payload.toString('base64') !== encoded || payload.length < IV_LENGTH + TAG_LENGTH) {
      throw new Error('Invalid payload');
    }

    const iv = payload.subarray(0, IV_LENGTH);
    const tag = payload.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const ciphertext = payload.subarray(IV_LENGTH + TAG_LENGTH);

    const decipher = createDecipheriv('aes-256-gcm', key, iv, { authTagLength: TAG_LENGTH });

    decipher.setAAD(Buffer.from(PREFIX));
    decipher.setAuthTag(tag);

    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  } catch {
    throw new Error('Decryption failed: invalid data or incorrect key');
  }
}
