const PLACEHOLDER = '__REQUIRED__';

function findPlaceholder(node: unknown, path: string): string | undefined {
  if (node === PLACEHOLDER) return path;
  if (node !== null && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      const hit = findPlaceholder(v, `${path}.${k}`);
      if (hit) return hit;
    }
  }
  return undefined;
}

/**
 * Resolve a dot-path data key (for example "credentials.customer" or "products.simpleProduct")
 * from the loaded store data. Usually returns a grouped object.
 * Throws with the full path if the key is missing, or if the key or anything inside it
 * still holds the __REQUIRED__ placeholder. A group is all-or-nothing: one pending
 * attribute makes resolving the whole group fail, with the attribute named in the message.
 */
export function getByKey<T = unknown>(data: object, key: string): T {
  const value = key
    .split('.')
    .reduce<unknown>(
      (node, part) =>
        node !== null && typeof node === 'object'
          ? (node as Record<string, unknown>)[part]
          : undefined,
      data,
    );

  if (value === undefined) {
    throw new Error(`Data key not found: "${key}"`);
  }
  const pending = findPlaceholder(value, key);
  if (pending) {
    throw new Error(`Data key "${pending}" still has the __REQUIRED__ placeholder; a value must be provided`);
  }
  return value as T;
}
