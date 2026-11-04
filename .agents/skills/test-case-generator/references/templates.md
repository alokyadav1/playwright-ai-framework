# Templates and a worked example

The example is fictional and only shows the format and the use of markers. Do not copy its content.

## Requirements register (`docs/requirements/<slug>.requirements.md`)

```markdown
# Requirements: <feature>
Source: docs/fsd/<file> (version/date if stated)

| ID | Source | Statement | Type | Automatable |
|---|---|---|---|---|
| CART-3.1 | cart-fsd.md §3.1 | A logged-in customer can add an in-stock product to the cart from the product page | Functional | Yes |
| CART-3.2 | §3.2 | The cart shows an empty-cart message when it has no items | UI | Yes |
| CART-3.3 | §3.3 | A quantity above the stock limit is rejected with an error message | Validation | Partly: limit and message text not stated |
| CART-3.4 | §3.4 | The cart loads quickly | Non-functional | No: no measurable target |

## Ambiguities and gaps
- CART-3.3: stock limit value and error message text are not stated.
- CART-3.4: "quickly" has no target.
```

## Test case (`docs/test-cases/<slug>.test-cases.md`)

```markdown
# Test cases: <feature>

## Open questions
1. TC-CART-003: stock limit for the limited-stock product is not stated (FSD §3.3).
2. TC-CART-003: exact error message text is not stated (FSD §3.3).

---

### TC-CART-001: Added product appears in the cart
- **Requirement(s):** CART-3.1
- **Short description:** A logged-in customer adds an in-stock product and sees it in the cart.
- **Preconditions:**
  1. A registered customer account exists. INFERRED (basis: §3.1 "logged-in customer")
  2. The customer is logged in.
- **Data required:**
  - `credentials.customer` (email, password): login of a registered customer
  - `products.simpleProduct` (sku): an in-stock product
- **Steps:**
  1. Open the product page of the simple product.
  2. Add the product to the cart.
  3. Open the cart.
- **Expected result:**
  1. The cart contains one item for that product. [CART-3.1]
- **Open items:** None

### TC-CART-003: Quantity above the stock limit is rejected
- **Requirement(s):** CART-3.3
- **Short description:** Adding more units than are in stock is refused with an error.
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
  2. The message `cartStockErrorMessage` is shown. NEEDS INPUT: exact message text (not stated in §3.3)
- **Open items:** stock limit value; error message text
```

## Traceability matrix (`docs/test-cases/<slug>.traceability.md`)

```markdown
| Requirement | Testable | Test cases | Status |
|---|---|---|---|
| CART-3.1 | Yes | TC-CART-001 | Covered |
| CART-3.2 | Yes | TC-CART-002 | Covered |
| CART-3.3 | Partly | TC-CART-003 | Covered, open items |
| CART-3.4 | No (no measurable target) | none | Out of scope for UI automation |

## Test cases with open items
- TC-CART-003: stock limit; error message text
```
