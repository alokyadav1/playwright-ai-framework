---
name: framework-knowledge
description: Complete map of this repository's Playwright and playwright-bdd framework, covering folder layout, layer rules, naming, runtime context (TEST_ENV, STORE, LOCALE), data, labels and config loading, encrypted data, the API wait registry, fixtures, commands and the inspection scripts. Load this whenever you need to know where something lives or how the framework behaves, and before creating or editing any file.
---

# Framework knowledge

This skill records the framework's conventions and the decisions behind them. It deliberately does not list every page, step or key, because such lists go stale. For the live inventory run the commands in "Ground truth" below.

## Layout

```
playwright.config.ts            reads env vars, sets baseURL and browser locale, BDD config
AGENTS.md  .agents/skills/      agent entry point and skills
docs/
  fsd/                          input documents (humans add these)
  requirements/  test-cases/    agent outputs, traceable
  snapshots/{store}/{locale}/<page>/<state>.yml   playwright-cli snapshots
  agent-runs/<slug>/            STATE.md, data-requests.md, step-map.md, locator-log.md,
                                healing-log.md, defects.md, dev-requests.md, failures/
scripts/
  secrets.ts                    keygen / encrypt / decrypt / check
  agent/inventory.ts            ground-truth inventory
src/                            everything reusable
  config/environments/{env}.json     { "<store>": { baseURL, apiBaseURL } }
  data/{env}/{store}/common.json     env+store data (required)
  data/{env}/{store}/{locale}.json   only what differs per locale (optional)
  labels/{store}/{locale}.json       UI text; en-us.json is the fallback; no env level
  locators/*.json                    one file per page or component
  network/*.apis.json                API registry: { method, path, status?, timeout? }
  pages/  components/  verifications/  api/  fixtures/  core/
tests/                          only what executes
  features/**/*.feature
  steps/*.steps.ts
  api/                          plain .spec.ts, no BDD
```

`src/api/` holds API clients for test setup. `src/network/` holds the wait registry. They are different things.

`core/` contains `runtime.ts` (context, loaders, `Labels` and `StoreData` types), `crypto.ts`, `ApiInterceptor.ts`, `tpl.ts`, `data-key.ts` (resolves data groups), `label-key.ts` (`getLabel`, resolves label keys passed from steps).

## Layers (each talks only to the one below)

```
feature -> step definitions (thin) -> pages / components / verifications / api clients
        -> locators, labels, data, network registry, config
```

- Step definitions call page methods and verification methods only. No `page.` calls, no selectors, no `expect`.
- Pages hold actions and public readonly locators. No assertions.
- Verifications hold assertions (Pattern 2). They receive a page object and labels.
- Locators are JSON strings used as `page.locator(this.locators.key)`. Role-based locators are built in the page object with `getByRole(role, { name: this.labels.key })`. No selector strings in TypeScript.
- Fixtures wire everything. Names: `labels`, `data`, `api`, `<area>Page`, `<area>Verify`.

## Runtime context

| Variable | Default | Meaning |
|---|---|---|
| `TEST_ENV` | `dev` | environment (lowercased) |
| `STORE` | `vpro` | store / brand (lowercased) |
| `LOCALE` | `en-us` | file names lowercase; the browser gets `en-US` style casing |
| `BASE_URL`, `API_BASE_URL` | from config | optional overrides, mainly CI |
| `TEST_DATA_ENCRYPTION_KEY` | none | Base64 32-byte key, from `.env` locally or the CI secret store |

Loaders (in `src/core/runtime.ts`): `getRuntimeContext()`, `readStoreData()` (merges common + locale, decrypts `enc:v1:` values, returns a copy), `readStoreLabels()` (locale over en-us fallback, warns on missing keys), `readEnvConfig()` (fails fast if `apiBaseURL` is missing).

Data keys are dot paths that resolve to grouped objects, read with `getByKey(data, 'credentials.customer')` from `src/core/data-key.ts`. It throws with the full path if the key is missing or if anything inside the object still holds `__REQUIRED__` (for example `credentials.admin.password`). Related data is always grouped in objects, never flat keys.

## Secrets

Sensitive values (email, password, token) are stored as `enc:v1:...` in data files and decrypted by the loader. Agents never decrypt or print them. `npm run secret:check` fails on plaintext in fields named like password, secret, token or email. Credentials never appear in `.feature` files; steps take a role key such as `"customer"`.

## API waits

Three explicit steps inside a page method: `intercept` (before the action), perform the action, `wait`. Only responses from the configured `apiBaseURL` count. Add a wait only when the call always fires for that action. Registry entries are paths relative to `apiBaseURL`; `*` matches one path segment.

## Decisions already made (do not re-litigate)

| Decision | Reason |
|---|---|
| Locators in JSON per page, never inline | One place to edit when the UI changes |
| Labels per store and locale, no env level | Text does not vary by environment |
| `tests/` executes, `src/` is reusable | Clear boundary, shared code reusable by UI and API tests |
| Assertions only in verification classes | Pages stay reusable; checks are visible and reusable |
| Explicit intercept / action / wait | Readable; the interceptor swallows unobserved rejections |
| Credentials only as `enc:v1:`; role keys in scenarios | Keeps secrets out of repo plaintext, reports and traces |

## Ground truth commands

| Need | Command |
|---|---|
| Existing steps (authoritative) | `npx bddgen export` (also try `npx bddgen export --help` for an unused-steps option) |
| Steps, pages, locator keys, network keys, label keys, data keys | `npm run agent:inventory` or `npm run agent:inventory steps\|pages\|locators\|network\|labels\|data` |
| Data or label keys still waiting for a human | `npm run agent:inventory pending` |
| Generate and run one test case | `npx bddgen && npx playwright test --grep "@TC-CART-001"` |
| Same, with context | `cross-env TEST_ENV=staging STORE=vpro LOCALE=ar npx bddgen && cross-env TEST_ENV=staging STORE=vpro LOCALE=ar npx playwright test --grep "@TC-CART-001"` |
| Type check / secrets check | `npx tsc --noEmit` / `npm run secret:check` |
| Open the last report | `npx playwright show-report` |

The generated BDD output directory (default `.features-gen`) is gitignored. Never edit it.

BDD config note: `playwright.config.ts` lists `src/fixtures/index.ts` in the `steps` option next to `tests/steps/**/*.ts`. playwright-bdd needs the fixtures file there to detect the custom `test` instance; without it `bddgen` fails with "Can't guess test instance".
