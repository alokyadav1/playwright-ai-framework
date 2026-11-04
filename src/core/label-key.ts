import type { Labels } from './runtime';

const PLACEHOLDER = '__REQUIRED__';

/**
 * Resolve a label key passed from a scenario (for example "cartEmptyMessage") to the text for the
 * current store and locale. Throws with the key name if it is missing or still a placeholder.
 */
export function getLabel(labels: Labels, key: string): string {
  const text = labels[key];
  if (text === undefined) {
    throw new Error(`Label key not found: "${key}"`);
  }
  if (text === PLACEHOLDER) {
    throw new Error(`Label key "${key}" still has the __REQUIRED__ placeholder; the text must be provided`);
  }
  return text;
}
