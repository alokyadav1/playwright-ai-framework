# Templates and a worked example

The example is fictional and only shows the format and the use of markers. Do not copy its content.

## Requirements register (`docs/requirements/<slug>.requirements.md`)

```markdown
# Requirements: <feature>
Source: docs/fsd/<file> (version/date if stated)

| ID | Parent ID | Source | Statement | Type | Disposition / testability |
|---|---|---|---|---|---|
| CART-3.1 | none | cart-fsd.md §3.1 | A logged-in customer can add an in-stock product to the cart from the product page | Functional | UI / testable |
| CART-3.2 | none | §3.2 | The cart shows an empty-cart message when it has no items | UI | UI / testable |
| CART-3.3 | none | §3.3 | A quantity above the stock limit is rejected with an error message | Validation | Blocked / partly testable, missing limit and message text |
| CART-3.4 | none | §3.4 | The cart loads quickly | Non-functional | Blocked / no measurable target |

## Ambiguities and gaps
- CART-3.3: stock limit value and error message text are not stated.
- CART-3.4: "quickly" has no target.
```

## Test case (`docs/test-cases/<slug>.test-cases.md`)

```markdown
# Test cases: <feature>

## Open questions
1. CRT_001 and CRT_003 require the target context to be recorded from intake, with missing context supplied by its owner.
2. CRT_001 requires a verified in-stock product and a provisioned account in that context.
3. CRT_003 requires the limited-stock product and stock limit (FSD §3.3).
4. CRT_003 requires the exact error message text (FSD §3.3).

---

### CRT_001 - Added product appears in the cart
- **Test Case ID** — CRT_001
- **Title** — Added product appears in the cart
- **Requirement(s):** CART-3.1
- **Short description:** A logged-in customer adds an in-stock product and sees it in the cart.
- **Context** — Use the confirmed intake environment, storefront and locale. Mark missing context NEEDS INPUT and record any specified behavior differences.
- **Preconditions:**
  1. A registered customer account exists. INFERRED (basis: §3.1 "logged-in customer")
  2. The customer is logged in.
- **Data required:**
  - `credentials.customer` (email, password): login of a registered customer
  - `products.simpleProduct` (sku, name): an in-stock product
- **Steps:**
  1. Open the product page of the simple product.
  2. Add the product to the cart.
  3. Open the cart.
- **Expected result:**
  1. The cart contains the exact added product identified by its approved SKU and name. [CART-3.1]
- **Open items:** Confirm intake context, verified product identity and provisioned account before CP2. These are implementation inputs, so they do not supply new business expectations.

### CRT_003 - Quantity above the stock limit is rejected
- **Test Case ID** — CRT_003
- **Title** — Quantity above the stock limit is rejected
- **Requirement(s):** CART-3.3
- **Short description:** Adding more units than are in stock is refused with an error.
- **Context** — Use the confirmed intake environment, storefront and locale. Mark missing context NEEDS INPUT and record any specified behavior differences.
- **Preconditions:** Customer logged in. INFERRED (basis: §3.3)
- **Data required:**
  - `credentials.customer` (email, password)
  - `products.limitedStock` (sku, stockLimit): a product with a known stock limit. NEEDS INPUT: which product and what limit
  - label key `cartStockErrorMessage`: text of the stock error. NEEDS INPUT: exact message text (not stated in §3.3)
- **Steps:**
  1. Open the product page of the limited-stock product.
  2. Enter a quantity above the stock limit.
  3. Add to cart.
- **Expected result:**
  1. The quantity is rejected and nothing is added. [CART-3.3]
  2. The message `cartStockErrorMessage` is shown. NEEDS INPUT for exact approved message text (not stated in §3.3). [CART-3.3]
- **Open items:** stock limit value; error message text
```

## Traceability matrix (`docs/test-cases/<slug>.traceability.md`)

```markdown
| Requirement | Testable | Test cases | Status |
|---|---|---|---|
| CART-3.1 | Yes | CRT_001 | Designed, awaiting approval and execution |
| CART-3.2 | Yes | CRT_002 | Designed, awaiting approval and execution |
| CART-3.3 | Partly | CRT_003 | Partially designed, blocked outcomes remain uncovered |
| CART-3.4 | No (no measurable target) | none | Out of scope for UI automation |

## Test cases with open items
- CRT_003: stock limit; error message text
```

## Stable IDs and per-outcome implementation mapping

If a source rule contains several atomic statements, preserve the parent ID and allocate stable child IDs. Keep existing case IDs, including their separators. These examples use CRT IDs only as an illustration. Never rename existing cases to match an example.

| Case | Requirement / outcome | Scenario title prefix | Then / binding / verification | Context | Result / evidence |
|---|---|---|---|---|---|
| CRT_001 | CART-3.1 / exact added product appears | CRT_001 - | Populate from approved implementation map | Supplied scope context | Awaiting implementation |

Record every outcome separately. Designed coverage, approved coverage and verified execution are different statuses. A missing expected outcome remains blocked and never becomes covered merely because another assertion passed.
