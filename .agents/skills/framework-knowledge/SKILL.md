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
  agent/inventory.ts            navigation inventory
  agent/verify.ts               scoped preflight, collection and result gates
src/                            everything reusable
  config/environments/{env}.json     { "<store>": { baseURL, apiBaseURL } }
  data/{env}/{store}/common.json     env+store data (required)
  data/{env}/{store}/{locale}.json   only what differs per locale (optional)
  labels/{store}/{locale}.json       UI text; en-us.json is the fallback; no env level
  locators/*.json                    one file per page or component
  network/*.apis.json                optional wait registry, created only when needed
  pages/  components/  verifications/  api/  fixtures/  core/
tests/                          only what executes
  features/**/*.feature
  steps/*.steps.ts
  framework/scope.json          included framework smoke scope
  api/                          reserved extension point, no plain-spec project configured
```

`src/api/` is reserved for optional test-setup clients. `src/network/` is reserved for optional verified browser-request wait registries. The ZIP does not ship a populated registry or a plain API-spec runner. Add these only in an explicitly scoped task with the necessary project configuration.

`core/` contains `runtime.ts` (context, loaders, `Labels` and `StoreData` types), `crypto.ts`, `ApiInterceptor.ts`, `tpl.ts`, `data-key.ts` (resolves data groups), `label-key.ts` (`getLabel`, resolves label keys passed from steps).

## Layers (each talks only to the one below)

```
feature -> step definitions (thin) -> pages / components / verifications / api clients
        -> locators, labels, data, network registry, config
```

- Step definitions call page methods and verification methods only. No `page.` calls, no selectors, no `expect`.
- Pages hold actions and public readonly locators. No assertions.
- Verifications hold assertions. They receive a page object and labels when needed. Resolve expected copy through `getLabel`.
- Locators are JSON strings used as `page.locator(this.locators.key)`. Role-based locators are built in the page object with `getByRole(role, { name: getLabel(labels, key), exact: true })`. No selector strings in TypeScript.
- Fixtures wire everything. Names: `labels`, `data`, `api`, `<area>Page`, `<area>Verify`.

## Runtime context

| Variable | Default | Meaning |
|---|---|---|
| `TEST_ENV` | `dev` | environment (lowercased) |
| `STORE` | `vpro` | store / brand (lowercased) |
| `LOCALE` | `en-us` | file names lowercase; the browser gets `en-US` style casing |
| `BASE_URL`, `API_BASE_URL` | from config | optional overrides, mainly CI |
| `TEST_DATA_ENCRYPTION_KEY` | none | Base64 32-byte key, from `.env` locally or the CI secret store |

The readers in `src/core/runtime.ts` provide the following behavior.

- `getRuntimeContext()` resolves normalized context and browser locale.
- `readStoreData({ decrypt: false })` merges common and locale data and returns a copy for the data fixture. `getByKey` decrypts only the selected value. Calling `readStoreData()` without this option eagerly decrypts the merged file.
- `readStoreLabels()` merges locale labels over the en-us fallback and warns about missing keys. `getLabel` validates each consumed key.
- `readEnvConfig()` validates effective absolute HTTP(S) URLs. Packaged URLs are `.invalid` placeholders, so storefront preflight requires team-provided endpoints. The local framework smoke uses an in-memory page.

Data keys are dot paths that resolve to grouped objects, read with `getByKey(data, 'credentials.customer')` from `src/core/data-key.ts`. It throws with the full path if the key is missing or if anything inside the object still holds `__REQUIRED__` (for example `credentials.admin.password`). Related data is grouped in objects, never dotted JSON keys. All pending children of a resolved group block that group, including array entries. Follow data-generator before changing existing shapes.

## Secrets

Sensitive values (email, password, token) are stored as `enc:v1:...` in data files. At runtime, the binding resolves its selected entity through `getByKey`. Agents never manually decrypt or print secrets. `npm run secret:check` fails on plaintext in fields named like password, secret, token or email. Credentials never appear in `.feature` files. Steps take an entity key such as `"credentials.customer"`, or an existing short role key whose binding defines the prefix.

## API waits

Use only guaranteed browser-observable requests. Three explicit steps inside a page method: `intercept` (before the action), perform the action, `wait`. Only responses from the configured `apiBaseURL` count. Add a wait only when the call always fires for that action. Registry entries are paths relative to `apiBaseURL`; `*` matches one path segment. Query parameters are ignored unless the optional `intercept(def, correlate)` predicate checks them. Add request correlation when multiple calls can match. Use UI readiness for cached, conditional or server-side operations.

## Decisions already made (do not re-litigate)

| Decision | Reason |
|---|---|
| Locators in JSON per page, never inline | One place to edit when the UI changes |
| Labels per store and locale, no env level | Text does not vary by environment |
| `tests/` executes, `src/` is reusable | Clear boundary, shared code reusable by UI and API tests |
| Assertions only in verification classes | Pages stay reusable; checks are visible and reusable |
| Explicit intercept / action / wait | Readable; the interceptor swallows unobserved rejections |
| Credentials only as `enc:v1:` and role keys in scenarios | Keeps plaintext out of tracked data and feature files. Raw browser artifacts still require privacy controls |

## Ground truth commands

| Need | Command |
|---|---|
| Authoritative step expressions | `npx --no-install bddgen export` |
| Scoped navigation inventory | `npm run agent:inventory -- steps` or `pages`, `locators`, `network`, `labels`, `data` |
| Placeholder discovery across contexts | `npm run agent:inventory -- pending` |
| Validate scoped runtime inputs | `npm run agent:preflight -- <scope.json>` |
| Generate, collect exact title IDs and execute | `npm run agent:verify -- <scope.json>` |
| Typecheck, lint and secrets check | `npm run check` |
| Framework smoke | `npm run test:framework` |
| Report | `npm run report` |

Inventory is a navigation aid. BDD generation validates bindings. Scoped verification checks case IDs and instance counts against collected and executed cases. It does not assess assertion meaning, so the approved outcome-to-assertion map remains required.

The runner defaults to one worker, zero retries and `forbidOnly`. Demonstrate application-state isolation before increasing concurrency. Set context variables identically for preflight, generation and execution, including when using Windows. The default supported context is `dev/vpro/en-us`. Other contexts need their own config, data, labels and approved URLs.

Protected-page discovery uses owner-provisioned `auth/<env>/<store>/<locale>/<role>.json`. There is no automatic login-state setup project. Preflight checks required file presence. It does not verify session expiry. Confirm authorized identity in the browser without inspecting token values and ask the owner to refresh expired state. Discovery state is not automatically injected into test fixtures.

Approved requirements and cases are tracked deliberately. `auth/`, raw `.playwright-cli/` output, `docs/snapshots/`, `docs/agent-runs/`, generated specs and reports are ignored local state. Keep these paths sanitized and never publish raw evidence automatically. Curated artifacts can be handed over through an explicitly approved review channel.

The generated BDD output directory (default `.features-gen`) is gitignored. Never edit it.

BDD config note: `playwright.config.ts` lists `src/fixtures/index.ts` in the `steps` option next to `tests/steps/**/*.ts`. playwright-bdd needs the fixtures file there to detect the custom `test` instance; without it `bddgen` fails with "Can't guess test instance".

All module ownership and scenario-title rules in AGENTS.md apply. The standalone framework smoke is the documented exception for in-memory test HTML and its fixed expected result.
