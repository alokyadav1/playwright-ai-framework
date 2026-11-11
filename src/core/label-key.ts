import type { Labels } from './runtime.js';

const PLACEHOLDER = '__REQUIRED__';

/**
 * Resolve a label key passed from a scenario (for example "cartEmptyMessage") to the text for the
 * current store and locale. Throws with the key name if it is missing or still a placeholder.
 */
export function getLabel(labels: Labels, key: string): string {
  const text = Object.hasOwn(labels, key) ? labels[key] : undefined;
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error(`Label key not found: "${key}"`);
  }
  if (text === PLACEHOLDER) {
    throw new Error(`Label key "${key}" still has the __REQUIRED__ placeholder; the text must be provided`);
  }
  return text;
}
