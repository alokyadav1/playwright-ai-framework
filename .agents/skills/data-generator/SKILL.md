---
name: data-generator
description: Extract the data keys needed by approved test cases and add them to the framework's data and label files without inventing values, grouping related data in objects. Use after test cases are approved, whenever a test case lists data required, when labels or messages from the FSD must be stored, or when a scenario fails because a data key or label is missing.
---

# Data generator

Test data has two failure modes: missing (the test crashes) and invented (the test passes against the wrong thing). This skill removes the first and never causes the second: it adds every key the test cases need, and leaves a visible placeholder for any value it was not given.

## Where things go

| What | File |
|---|---|
| Environment and store data (SKUs, accounts, coupons) | `src/data/{env}/{store}/common.json` |
| Data that differs per locale (address and phone formats, currency) | `src/data/{env}/{store}/{locale}.json` |
| UI text and messages | `src/labels/{store}/{locale}.json` (en-us is the fallback) |
| Base URL and API base URL per environment and store | `src/config/environments/{env}.json`. **Not written by this skill**, see below |

Use the current `TEST_ENV`, `STORE`, `LOCALE` unless the task names others.

**Environment configuration has a separate owner.** This skill checks `src/config/environments/{env}.json`; it never guesses or changes `baseURL` or `apiBaseURL`. Record a missing entry/URL as a CP2 blocker for dependent cases and continue independent work under planner-workflow. A user-requested configuration change belongs to MAINTAIN and uses supplied values. Page paths such as `/cart` belong in page objects.

## Group related data in objects

Data that describes one thing lives together in one object. The object is the unit that test cases, scenarios and steps refer to; the attributes are read from it inside the step definition.

```json
{
  "credentials": {
    "customer": { "email": "enc:v1:...", "password": "enc:v1:..." },
    "admin":    { "email": "enc:v1:...", "password": "enc:v1:..." }
  },
  "products": {
    "simpleProduct": { "sku": "SKU-123", "name": "Basic tee", "quantity": 1 }
  },
  "addresses": {
    "billing": { "line1": "...", "city": "...", "postcode": "..." }
  }
}
```

Rules, with the reason for each:

1. **One object per entity, named for its role.** `credentials.customer`, `products.simpleProduct`, `addresses.billing`. A reader (and a step like `Given I am logged in as the "customer" user`) refers to the whole thing, so there is one name to remember instead of five.
2. **Never flatten.** No JSON key that contains a dot (`"user.email": "..."`), and no sibling keys that spell out the grouping (`customerEmail`, `customerPassword`). Flat keys multiply, drift apart, and cannot be passed around as a unit.
3. **Test cases, scenarios and steps reference the group** (`customer`, `simpleProduct`), never a single attribute. Step definitions read the attributes (`creds.email`, `product.sku`). Data required in a test case names the group and lists the attributes it needs.
4. **A new attribute goes inside the existing object**, not into a new top-level key.
5. **Group by entity, not by data type.** Not `emails: {...}` and `passwords: {...}`; one `credentials.customer` holding both.
6. **Variants of the same entity are sibling objects with identical attribute names** (`customer` and `admin` both have `email` and `password`), so one step can serve every variant.
7. **Keep it shallow**, about three levels: group, entity, attribute.
8. **Placeholders are per attribute.** Write `{ "email": "__REQUIRED__", "password": "__REQUIRED__" }`, never `"__REQUIRED__"` in place of the whole object. Then `npm run agent:inventory pending` lists exactly which attribute is missing.
9. **Sensitive attributes inside an object stay encrypted** (`enc:v1:`), exactly as before.
10. **Existing flat keys are not rewritten silently.** Changing a structure breaks steps that read it. Report them in `data-requests.md` as a refactor suggestion and ask first.

Labels are the exception. They stay flat camelCase with an area prefix (`cartEmptyMessage`), because the labels loader returns a flat key-to-text map that is merged over the en-us fallback.

## Procedure

1. **See what exists.** Run `npm run agent:inventory data` and `npm run agent:inventory labels`. Never open a data file to read values of fields that look encrypted or sensitive.
2. **Collect what is needed.** Read "Data required" of every in-scope test case: each group and the attributes it needs. Add the messages and texts stated in expected results (these become labels).
3. **Name the groups.** Role not value (`products.simpleProduct`, not `products.teeShirtRed`). Reuse an existing group before creating a new one; if `products.simpleProduct` exists, do not add `products.simple2`. Missing attributes of an existing group are added inside it.
4. **Add what is missing** following the value rules below. Update an existing placeholder or value only when supplied/authorized for the target task; preserve unrelated entries and key order.
5. **Record provenance and requests** in `docs/agent-runs/<slug>/data-requests.md`: group, attributes, file, needed-by case/locator, status, source. For a small standalone edit use the reply if planner-workflow allows it.
6. **Gate.** Run `npm run agent:inventory pending`; evaluate only keys consumed by the target cases/context. Planner-workflow owns CP2. Block dependent execution and request missing inputs once; continue independent cases or implementation. A data-only request stops after its requested changes and checks.

## Value rules

| Kind of value | What to write |
|---|---|
| Stated in the FSD or test case (a rule, a limit, a message) | The value, and cite the source in data-requests.md |
| Environment-specific identifier (SKU, account name, store id) | Reuse a valid existing or explicitly supplied value with provenance; otherwise `"__REQUIRED__"` and a request line |
| Credentials, tokens, emails of real accounts | Reuse existing or supplied `enc:v1:` strings. If missing, use `"__REQUIRED__"` and ask the user to run `npm run secret:encrypt` locally and supply only ciphertext. Never request or write plaintext |
| UI text stated in the FSD (en-us) | Add the label key with the stated text |
| Accessible name used only for addressing an element | Use text observed by locator-strategy in the target locale, with snapshot evidence; this is not authority for an asserted expected message |
| UI text for other locales | Do not guess translations. List the missing keys in data-requests.md; the loader falls back to en-us and warns |
| Locale-specific data | Locale file only, same placeholder rules |

Attributes named like password, secret, token or email must end up as `enc:v1:` strings; `npm run secret:check` fails on plaintext.

## Quality rules

- Idempotent: running the skill twice produces no diff.
- Maintain the store's label key contract across locales; never invent translations. The runtime type is `Record<string, string>`, so TypeScript does not prove that a key or translation exists.
- When a test case mutates shared data (a cart, an order, an account), flag it in data-requests.md and suggest a dedicated account or generated unique values, so parallel runs cannot collide.
- Keep JSON formatting as described in coding-standards.

## Example `data-requests.md`

```markdown
| Group | Attributes | File | Needed by | Status | Provided by |
|---|---|---|---|---|---|
| credentials.customer | email, password | src/data/staging/vpro/common.json | TC-CART-001, 002 | needs values | User: run secret:encrypt, paste enc:v1 strings |
| products.simpleProduct | sku | src/data/staging/vpro/common.json | TC-CART-001 | needs value | QA lead: an in-stock SKU on staging |
| products.simpleProduct | name, quantity | src/data/staging/vpro/common.json | TC-CART-001 | added (FSD §3.1) | n/a |
| config (staging, vpro) | baseURL, apiBaseURL | src/config/environments/staging.json | all | needs values | Team: environment URLs |
| label cartEmptyMessage | en-us | src/labels/vpro/en-us.json | TC-CART-002 | added (FSD §3.2) | n/a |
| label cartEmptyMessage | ar | src/labels/vpro/ar.json | TC-CART-002 | needs value | Localisation owner |
```
