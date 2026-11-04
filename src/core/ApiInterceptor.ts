import type { Page, Response } from '@playwright/test';

export type EndpointDef = { method: string; path: string; status?: number; timeout?: number };

// '*' matches exactly one path segment
const toPathRegex = (p: string): RegExp =>
  new RegExp('^' + p.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]+') + '$');

export class ApiHandle {
  constructor(private readonly pending: Promise<Response>) {
    // If the action between intercept() and wait() throws, wait() never runs and this promise
    // would reject unobserved. Swallow it here; the real rejection still surfaces from wait().
    this.pending.catch(() => undefined);
  }

  wait(): Promise<Response> {
    return this.pending;
  }
}

export class ApiInterceptor {
  private readonly base: URL;
  private readonly prefix: string;

  constructor(
    private readonly page: Page,
    apiBaseURL: string,
  ) {
    this.base = new URL(apiBaseURL);
    this.prefix = this.base.pathname.replace(/\/$/, ''); // e.g. "/v1"
  }

  /** Step 1: start listening NOW (before the action). Await the returned handle in step 3. */
  intercept(def: EndpointDef): ApiHandle {
    const pathRe = toPathRegex(def.path);
    const expected = def.status ?? 200;

    const pending = this.page
      .waitForResponse((r) => this.matches(r, def.method, pathRe), { timeout: def.timeout })
      .then((r) => {
        if (r.status() !== expected) {
          throw new Error(`${def.method} ${def.path}: expected ${expected}, got ${r.status()}`);
        }
        return r;
      });
    return new ApiHandle(pending);
  }

  private matches(r: Response, method: string, pathRe: RegExp): boolean {
    if (r.request().method() !== method) return false;
    const u = new URL(r.url());
    if (u.origin !== this.base.origin) return false; // ignore other hosts (analytics, CDNs)
    if (!u.pathname.startsWith(this.prefix + '/')) return false;
    return pathRe.test(u.pathname.slice(this.prefix.length)); // query string is ignored
  }
}
