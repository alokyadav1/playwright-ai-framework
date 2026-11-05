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

Start with an ordinary prompt. [AGENTS.md](AGENTS.md) directs the agent to [planner-workflow](.agents/skills/planner-workflow/SKILL.md), which selects the flow from the requested outcome and states its scope and stopping point.

| Example prompt | Selected flow |
|---|---|
| "Review the cart automation and recommend improvements" | REVIEW, findings only |
| "Create test cases from docs/fsd/cart.md" | DESIGN, stop after cases/traceability |
| "Automate approved TC-CART-001 and TC-CART-004" | AUTOMATE, reuse approved artifacts |
| "Diagnose and fix TC-CART-004" | DIAGNOSE, classify before repairing |
| "Heal the checkout button locator" | HEAL, prove identity and preserve behaviour |
| "Refine the agent workflow to prevent task drift" | MAINTAIN, improve the responsible instructions |
| "Run the cart checks without fixing anything" | VERIFY, results only |

For a new feature, put the specification in `docs/fsd/`. New cases reach human review before automation; identified existing approved cases retain their approval. Missing data blocks only dependent work. A narrow request such as "Gherkin only" stops at that deliverable.

The project includes a CLI command skill customized for these rules. Check `npx --no-install playwright-cli --help`; do not overwrite the local skill with a generic generation/healing workflow. If your agent reads another skill directory, point it to `.agents/skills` while keeping one maintained source.

Multi-step editing runs record scope, decisions, approvals, attempts, evidence and the next action in STATE.md. "Continue <task>" resumes after checking current evidence; "What next?" asks for a recommendation. These are agent instructions, not a deterministic runtime router; [routing examples](.agents/skills/planner-workflow/references/routing-examples.md) document the expected decisions.

Agents suggest commit messages; the user commits. New `docs/` artifacts are currently ignored by `.gitignore` even though some existing documents are tracked. Review which sanitized artifacts to track; agents do not force-add them or change ignore rules automatically.

## Scripts

| Script | Purpose |
|---|---|
| `test`, `test:smoke`, `test:regression`, `test:i18n` | `bddgen` then run, optionally filtered by tag |
| `report` | open the last HTML report |
| `typecheck`, `lint`, `check` | quality gate (`check` runs typecheck, lint and the secrets check) |
| `secret:keygen`, `secret:encrypt`, `secret:decrypt`, `secret:check` | encryption tooling (agents never run `secret:decrypt`) |
| `agent:inventory` | existing steps, pages, locator, network, label and data keys; `pending` lists `__REQUIRED__` values |
