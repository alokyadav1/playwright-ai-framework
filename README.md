# Playwright BDD framework starter (with AI agent kit)

A multi-env, multi-store, multi-locale Playwright + playwright-bdd framework with JSON locators and labels, encrypted test data, intercept-action-wait API waits, verification classes, and a set of agent skills for AI-assisted test development.

## Quick start

```bash
npm install
cp .env.example .env            # then: npm run secret:keygen  and paste the key into .env
npx playwright install chromium # downloads the browser
npm run check                   # typecheck + lint + secrets check
npx bddgen export               # lists the step definitions
npx cross-env TEST_ENV=dev STORE=vpro LOCALE=en-us npm run test:smoke
```

Runtime context comes from `TEST_ENV`, `STORE`, `LOCALE` (defaults `dev`, `vpro`, `en-us`). The same `LOCALE` value picks the label file and sets the browser locale.

## What is real and what is a sample

**Real framework code (keep):** `playwright.config.ts`, `src/core/*` (runtime loaders, crypto, `ApiInterceptor`, `tpl`, `data-key`, `label-key`), `src/pages/BasePage.ts`, `src/fixtures` wiring pattern, `scripts/secrets.ts`, `scripts/agent/inventory.ts`, `tsconfig.json`, `eslint.config.mjs`, `.agents/`, `AGENTS.md`.

**Illustrative sample for a fictional storefront (replace with your app):** the `vpro` URLs on `example.com`, `src/locators/*.json`, `src/network/cart.apis.json`, `src/labels/vpro/en-us.json`, `src/data/dev/vpro/common.json` (all values are `__REQUIRED__`), `LoginPage`, `ProductPage`, `CartPage`, `CartVerifications`, `tests/features/cart` (`CartContents.feature`), `tests/steps/cart.steps.ts`. The agent skills use this cart example as the pattern to follow; delete the sample once your first real feature exists.

## Not built yet

- **Auth setup project** (one saved login state per role in `auth/<role>.json`). The locator-strategy and self-healing skills expect it so the agent can explore logged-in pages without handling credentials. The sample `Given I am logged in...` step logs in through the UI instead.
- Nothing here has been run against a real browser or a real app. See "Verified" below.

## Verified when this was assembled

`npm install`, `tsc --noEmit`, `eslint .`, `bddgen`, `bddgen export`, `playwright test --list`, the secrets CLI (`check`, plaintext detection, wrong-key field-path errors), crypto and loader round trip (including a trailing newline in the key), and the `ApiInterceptor` matching rules (host, method, path, wildcard, status, unobserved rejection) against a fake page. Browser runs are not verified.

## Using the agent kit

1. Put an FSD or PRD in `docs/fsd/` and ask your agent to follow `.agents/skills/planner-workflow/SKILL.md` (`AGENTS.md` points there).
2. Install the official playwright-cli skill beside ours: `npx playwright-cli install --skills=agents` (run `--help` to confirm the project-level form for your version).
3. If your agent tool looks for skills elsewhere (for example `.claude/skills`), symlink or copy `.agents/skills`.
4. Start with one small FSD, review the test cases at checkpoint 1, and tune the skills after the first run. They are plain Markdown; edit them like code.

Agents do not run git commit or push; they write suggested commit messages into `docs/agent-runs/<slug>/STATE.md`. Commit `docs/requirements`, `docs/test-cases`, `docs/snapshots` as the audit trail. `docs/agent-runs` is optional.

## Scripts

| Script | Purpose |
|---|---|
| `test`, `test:smoke`, `test:regression`, `test:i18n` | `bddgen` then run, optionally filtered by tag |
| `report` | open the last HTML report |
| `typecheck`, `lint`, `check` | quality gate (`check` runs typecheck, lint and the secrets check) |
| `secret:keygen`, `secret:encrypt`, `secret:decrypt`, `secret:check` | encryption tooling (agents never run `secret:decrypt`) |
| `agent:inventory` | existing steps, pages, locator, network, label and data keys; `pending` lists `__REQUIRED__` values |
