---
name: coding-standards
description: Code, naming, formatting and review standards for TypeScript, JSON and Gherkin in this repository. Use whenever writing or editing any code, locator, label or data JSON, or feature file, and as a final self-review before declaring any task done.
---

# Coding standards

Each rule has a reason so you can apply it to cases not listed here.

## TypeScript

| Rule | Reason |
|---|---|
| `strict` mode; no `any` (use `unknown` and narrow); avoid `!` unless a comment says why it is safe | Types are the cheapest test |
| `async`/`await` only; every promise is awaited or returned (no floating promises) | A floating promise is a race the test cannot see |
| No `waitForTimeout`, `networkidle`, `page.pause()`, `test.only`, `test.skip` without approval | Slow, flaky or silently reduces coverage |
| No `console.log`; use `test.step` for readable reports. Only `console.warn` is allowed (loader warnings) and only in `src/core` | Logs leak data and add noise |
| Prefer web-first assertions on locators (`await expect(locator).toHaveText(...)`) | They retry; reading a value first does not |
| Relative imports, ordered node, third-party, local | Predictable diffs |
| Functions do one thing, around 30 lines or fewer; a page over about 250 lines is split into components | Keeps files reviewable |
| Comments explain why, never what; no commented-out code; no TODO without an ID | Code history lives in git |
| Error messages name the key, file or expectation involved, never a secret value | Debuggable without leaking |

## Naming

| Thing | Convention | Example |
|---|---|---|
| Page class and file | `<Name>Page` | `CartPage.ts` |
| Verification class and file | `<Name>Verifications` | `CartVerifications.ts` |
| Component | `<Name>` | `Header.ts` |
| Page method | verb for the user intent | `proceedToCheckout()` |
| Verification method | the outcome; text checks take a label key | `hasItems(count)`, `showsEmptyMessage(labelKey)` |
| Fixture | `<area>Page`, `<area>Verify` | `cartPage`, `cartVerify` |
| Locator JSON file | lowercase, matches the page | `cart.json` |
| Locator key | camelCase + type suffix `Btn Input Link Text Msg Row List Select Checkbox Tab Img` | `proceedToCheckoutBtn` |
| Label key | camelCase, area prefix | `cartEmptyMessage` |
| Data group, entity, attribute | camelCase, named for the role not the value. **No JSON key ever contains a dot**, space or hyphen. The dot appears only in code and scenarios, as a path into nested data | key `customer` inside object `credentials` is referenced as `credentials.customer`; its attribute is `credentials.customer.email` |
| Registry key | camelCase, endpoint intent | `viewCart` |
| Feature file | PascalCase, named for the feature | `CartContents.feature` |
| Tags | `@TC-<AREA>-<NNN>`, `@REQ-<id>`, plus `@smoke @regression @i18n` | `@TC-CART-001` |

## JSON

2-space indent, trailing newline, no duplicate keys, no comments, no trailing commas. No key contains a dot (group related data in nested objects instead). Keep the existing key order; add new keys in a logical group. Never put values you were not given (see data-generator).

## Tests

Independent and parallel-safe: no scenario relies on another, no shared mutable data. One behaviour per scenario. Deterministic data: dedicated accounts or generated unique values for anything a test mutates.

## Before you say "done"

1. `npx tsc --noEmit`, lint if a script exists, `npm run secret:check`.
2. `npx bddgen` succeeds; the affected tags run green or are classified.
3. Search your diff for: `any`, `waitForTimeout`, `console.log`, `.only`, hard-coded selectors in TS, literal test data in steps, plaintext credentials.
4. Re-read each new file as a reviewer: is anything here not traceable to a requirement, a stored snapshot, or an existing convention?
5. Do not run `git commit`, `git push` or any other history-changing git command. Write a suggested commit message, format `<type>(<scope>): <summary>` (for example `test(cart): add TC-CART-001..002`), into STATE.md and the final report. The user commits.
