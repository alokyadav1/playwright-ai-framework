# Cart Test Cases

**Source:** docs/fsd/cart.md (FSD-CART-001 v1.0, Status: Reviewed, Date: 26-Oct-2026)  
**Generated:** 2026-10-29  
**Module:** Shopping Cart and Mini Cart  
**ID convention:** TC-CART-nnn  

> Severity uses the explicit project default: **Major** unless a different severity is noted.  
> Storefront scope is stated per case. When not stated, the case applies to all four storefronts (vfashion, vpro, bepro, getpro).  
> Message copy is configurable; assertions use message-key names, not literal strings.  

---

## Table of Contents

1. [Cart Access](#1-cart-access)
2. [Cart Line Item Display](#2-cart-line-item-display)
3. [Quantity Management](#3-quantity-management)
4. [Remove Item](#4-remove-item)
5. [Order Summary](#5-order-summary)
6. [Promotion Code](#6-promotion-code)
7. [Gift Options](#7-gift-options)
8. [Automatic Discounts](#8-automatic-discounts)
9. [Bundle Products](#9-bundle-products)
10. [Product Variants](#10-product-variants)
11. [Stock Availability](#11-stock-availability)
12. [Delivery Location](#12-delivery-location)
13. [Checkout](#13-checkout)
14. [Express Checkout](#14-express-checkout)
15. [Other Payment Methods](#15-other-payment-methods)
16. [Empty Cart](#16-empty-cart)
17. [Guest Cart](#17-guest-cart)
18. [Cart Merge on Login](#18-cart-merge-on-login)
19. [Cart Count Indicator](#19-cart-count-indicator)
20. [Mini Cart (Desktop)](#20-mini-cart-desktop)
21. [Error Handling & Edge Scenarios](#21-error-handling--edge-scenarios)
22. [Non-Functional Requirements & Test-Layer Allocations](#22-non-functional-requirements--test-layer-allocations)
23. [Ambiguity Register](#23-ambiguity-register)
24. [Traceability Matrix](#24-traceability-matrix)

---

## 1. Cart Access

### TC-CART-001 — Cart page is accessible to Guest

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-001, FR-CRT-002 |
| **Preconditions** | User is a Guest (not logged in). Cart may be empty or contain items. |

**Actions**
1. Navigate to the Cart page URL directly.

**Expected outcomes**
- The Cart page loads without requiring authentication.

---

### TC-CART-002 — Cart page is accessible to Registered User

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-001, FR-CRT-002 |
| **Preconditions** | User is logged in as a Registered User. |
| **Required data keys** | `user.registered` |

**Actions**
1. Log in as a Registered User.
2. Navigate to the Cart page URL directly.

**Expected outcomes**
- The Cart page loads and displays the user's cart.

---

### TC-CART-003 — Cart page opens from header cart icon

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-002 |
| **Preconditions** | Any user is on any page of the storefront. |

**Actions**
1. Select (click) the header cart icon.

**Expected outcomes**
- The Cart page is opened.

---

### TC-CART-004 — Cart page reflects real-time cart state

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-003, FR-CRT-004 |
| **Preconditions** | Registered User has at least one item in the cart. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.

**Expected outcomes**
- The item list, order summary and checkout actions are visible.
- The displayed items match the products added to the cart.

---

## 2. Cart Line Item Display

### TC-CART-010 — Line item displays all required attributes

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-010 |
| **Preconditions** | Cart contains at least one in-stock line item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Inspect a line item.

**Expected outcomes**
- Product image is displayed.
- Product name is displayed.
- Unit price is displayed.
- Selected quantity is displayed.
- Line total is displayed.

---

### TC-CART-011 — Product name is a link to the PDP

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-011 |
| **Preconditions** | Cart contains at least one line item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Select the product name of a line item.

**Expected outcomes**
- The user is navigated to the corresponding Product Detail Page.

---

### TC-CART-012 — Remove control is present on each line item

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-013 |
| **Preconditions** | Cart contains at least one line item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Inspect each line item.

**Expected outcomes**
- A remove control is visible for every line item in the cart.

---

### TC-CART-013 — Quantity selector is present on each line item

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-014 |
| **Preconditions** | Cart contains at least one line item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Inspect each line item.

**Expected outcomes**
- A quantity selector (decrease control, quantity field, increase control) is visible for every line item.

---

### TC-CART-014 — Line total equals unit price multiplied by quantity

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-015 |
| **Preconditions** | Cart contains a line item with quantity >= 2. |
| **Required data keys** | `cart.product_in_stock`, `cart.quantity_gte_2` |

**Actions**
1. Navigate to the Cart page.
2. Read the unit price, quantity and line total for one line item.

**Expected outcomes**
- Line total = unit price x quantity (using storefront currency precision).

---

## 3. Quantity Management

### TC-CART-020 — Quantity selector controls are present

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-020 |
| **Preconditions** | Cart contains at least one line item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Inspect the quantity selector for a line item.

**Expected outcomes**
- Decrease control, editable quantity field and increase control are all present.

---

### TC-CART-021 — Decrease control is disabled at minimum quantity (1)

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-021, BR-001 |
| **Preconditions** | Cart contains a line item with quantity = 1. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Ensure the line item quantity is 1.
3. Inspect the decrease control.

**Expected outcomes**
- The decrease control is disabled.

---

### TC-CART-022 — Increase control is disabled at Maximum Quantity Limit (99)

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-022, BR-002 |
| **Preconditions** | Cart contains a line item with quantity = 99. |
| **Required data keys** | `cart.product_at_max_qty` |

**Actions**
1. Navigate to the Cart page.
2. Ensure the line item quantity is 99.
3. Inspect the increase control.

**Expected outcomes**
- The increase control is disabled.

---

### TC-CART-023 — Increase control adds one unit and recalculates totals

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-023, FR-CRT-028 |
| **Preconditions** | Cart contains a line item with quantity < 99 and available stock > current quantity. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Note the current quantity (Q), line total and order summary total.
3. Select the increase control for the line item.

**Expected outcomes**
- Quantity updates to Q + 1 without a separate confirmation.
- Line total recalculates to unit price x (Q + 1).
- Order summary total recalculates accordingly.

---

### TC-CART-024 — Decrease control reduces one unit and recalculates totals

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-023, FR-CRT-028 |
| **Preconditions** | Cart contains a line item with quantity >= 2. |
| **Required data keys** | `cart.product_in_stock`, `cart.quantity_gte_2` |

**Actions**
1. Navigate to the Cart page.
2. Note the current quantity (Q), line total and order summary total.
3. Select the decrease control for the line item.

**Expected outcomes**
- Quantity updates to Q - 1 without a separate confirmation.
- Line total recalculates to unit price x (Q - 1).
- Order summary total recalculates accordingly.

---

### TC-CART-025 — Entering a valid quantity directly updates totals

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-024, FR-CRT-028 |
| **Preconditions** | Cart contains a line item with available stock >= 5. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Clear the quantity field for a line item and type `5`.
3. Trigger quantity save (e.g. Tab or Enter).

**Expected outcomes**
- Quantity is set to 5.
- Line total = unit price x 5.
- Order summary updates accordingly.

---

### TC-CART-026 — Entering a quantity above the Maximum Quantity Limit sets the quantity to 99

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-025, BR-002 |
| **Preconditions** | Cart contains a line item with available stock >= 99. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Clear the quantity field and type `150`.
3. Trigger quantity save.

**Expected outcomes**
- Quantity is set to 99 (Maximum Quantity Limit).
- Line total = unit price x 99.
- Order summary updates accordingly.

---

### TC-CART-027 — Quantity is capped at available stock when stock is less than Maximum Quantity Limit

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-026, BR-003 |
| **Preconditions** | Cart contains a line item whose available stock S satisfies 1 < S < 99. |
| **Required data keys** | `cart.product_limited_stock` (stock = S) |

**Actions**
1. Navigate to the Cart page.
2. Clear the quantity field and type a value greater than S (e.g. S + 5).
3. Trigger quantity save.

**Expected outcomes**
- Quantity is set to S (available stock).
- Line total = unit price x S.
- Order summary updates accordingly.

---

### TC-CART-028 — Adding a product already at Maximum Quantity Limit from PDP shows error and does not increase quantity

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-027, BR-002 |
| **Preconditions** | Cart contains a product at quantity = 99. |
| **Required data keys** | `cart.product_at_max_qty` |

**Actions**
1. Navigate to the PDP of the same product.
2. Select "Add to cart".

**Expected outcomes**
- The quantity in the cart remains at 99.
- A maximum quantity error message is displayed (message key: `Maximum quantity error`).

---

## 4. Remove Item

### TC-CART-030 — Removing a line item removes it from the cart

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-030, FR-CRT-031 |
| **Preconditions** | Cart contains at least two line items. |
| **Required data keys** | `cart.product_in_stock`, `cart.product_in_stock_2` |

**Actions**
1. Navigate to the Cart page.
2. Select the remove control on the first line item.

**Expected outcomes**
- The removed line item is no longer listed in the cart.
- The order summary recalculates to reflect the remaining item(s).
- The cart count indicator decreases by the removed item's quantity.

---

### TC-CART-031 — Removing the last item displays the empty cart experience

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-030, FR-CRT-032, FR-CRT-150 |
| **Preconditions** | Cart contains exactly one line item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Select the remove control on the single line item.

**Expected outcomes**
- The line item list and order summary are no longer displayed.
- The empty cart experience is displayed (message key: `Empty cart message`).

---

## 5. Order Summary

### TC-CART-040 — Order summary section is displayed on a non-empty cart

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-040, FR-CRT-041 |
| **Preconditions** | Cart contains at least one item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.

**Expected outcomes**
- Order summary section is visible.
- Subtotal, estimated total and any applicable discount are displayed.

---

### TC-CART-041 — All monetary values use storefront currency format with two decimal places

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-043 |
| **Preconditions** | Cart contains at least one item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Inspect all price values (unit price, line total, subtotal, estimated total).

**Expected outcomes**
- All monetary values are formatted in the storefront currency with exactly two decimal places.

---

### TC-CART-042 — Order summary updates immediately on quantity increase

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-042 |
| **Preconditions** | Cart contains an in-stock item with quantity < 99. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Note the current order summary total.
3. Select the increase control for the line item.

**Expected outcomes**
- The order summary total updates immediately to reflect the new quantity.
- No page refresh is required.

---

## 6. Promotion Code

### TC-CART-050 — Promotion code section is displayed on the Cart page

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-050 |
| **Preconditions** | Cart contains at least one item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.

**Expected outcomes**
- A promotion code entry section is visible on the Cart page.

---

### TC-CART-051 — Valid promotion code applies discount and updates order summary

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-051 |
| **Preconditions** | Cart contains at least one item. A valid promotion code exists. |
| **Required data keys** | `cart.product_in_stock`, `promo.valid_code`, `promo.expected_discount` |

**Actions**
1. Navigate to the Cart page.
2. Note the current order summary total.
3. Enter `promo.valid_code` in the promotion code field and apply.

**Expected outcomes**
- The associated discount is applied and shown in the order summary.
- The estimated total is reduced by the discount amount.

---

### TC-CART-052 — Invalid promotion code shows error and does not change order total

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-052 |
| **Preconditions** | Cart contains at least one item. |
| **Required data keys** | `cart.product_in_stock`, `promo.invalid_code` |

**Actions**
1. Navigate to the Cart page.
2. Note the current order summary total.
3. Enter `promo.invalid_code` in the promotion code field and apply.

**Expected outcomes**
- An inline error is displayed (message key: `Invalid promotion code`).
- The order summary total remains unchanged.

---

### TC-CART-053 — Expired promotion code shows error and does not change order total

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-052 |
| **Preconditions** | Cart contains at least one item. |
| **Required data keys** | `cart.product_in_stock`, `promo.expired_code` |

**Actions**
1. Navigate to the Cart page.
2. Note the current order summary total.
3. Enter `promo.expired_code` in the promotion code field and apply.

**Expected outcomes**
- An inline error is displayed (message key: `Invalid promotion code`).
- The order summary total remains unchanged.

---

## 7. Gift Options

### TC-CART-060 — Gift options checkbox is displayed on the Cart page

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-060 |
| **Preconditions** | Cart contains at least one item (Guest or Registered User). |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.

**Expected outcomes**
- A gift options checkbox is visible.

---

### TC-CART-061 — Selecting the gift options checkbox retains the selection

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-061 |
| **Preconditions** | Cart contains at least one item. Gift options checkbox is unchecked. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Select the gift options checkbox.

**Expected outcomes**
- The checkbox becomes checked.
- The selection is retained when the user navigates to checkout.

---

### TC-CART-062 — Clearing the gift options checkbox retains the cleared state

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-061 |
| **Preconditions** | Cart contains at least one item. Gift options checkbox is checked. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Clear (uncheck) the gift options checkbox.

**Expected outcomes**
- The checkbox becomes unchecked.
- The cleared state is retained when the user navigates to checkout.

---

## 8. Automatic Discounts

> **Storefront applicability:** FR-CRT-071 specifies automatic discount only for **getpro** (threshold USD 2,000). vfashion, vpro and bepro are excluded per Section 8 matrix.

### TC-CART-070 — Automatic discount is applied when cart value exceeds threshold (getpro)

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | getpro |
| **References** | FR-CRT-070, FR-CRT-071, FR-CRT-072, BR-009 |
| **Preconditions** | Cart total is above USD 2,000 (or configured threshold). |
| **Required data keys** | `cart.product_above_discount_threshold` |

**Actions**
1. Navigate to the Cart page with a qualifying cart.

**Expected outcomes**
- The automatic discount is displayed in the order summary.
- The estimated total reflects the discount.

---

### TC-CART-071 — Automatic discount is removed when cart value drops below threshold (getpro)

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | getpro |
| **References** | FR-CRT-073, BR-009 |
| **Preconditions** | Automatic discount is currently applied; cart total is above threshold. |
| **Required data keys** | `cart.product_above_discount_threshold`, `cart.product_below_threshold` |

**Actions**
1. Navigate to the Cart page with the discount applied.
2. Remove or reduce an item so the cart total falls below USD 2,000.

**Expected outcomes**
- The automatic discount is removed from the order summary.
- The estimated total updates accordingly.

---

### TC-CART-072 — Automatic discount is NOT applied on vfashion, vpro, bepro

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro, bepro |
| **References** | FR-CRT-070, FR-CRT-071 (Section 8 matrix) |
| **Preconditions** | Cart total is above USD 2,000 equivalent on a non-getpro storefront. |
| **Required data keys** | `cart.product_above_discount_threshold` |

**Actions**
1. Navigate to the Cart page with the qualifying cart.

**Expected outcomes**
- No automatic discount is shown in the order summary.

---

## 9. Bundle Products

> **Storefront applicability:** FR-CRT-083 — Bundles apply to **vpro, bepro and getpro** only. vfashion does not support bundles.

### TC-CART-080 — Bundle line item displays a bundle indicator badge

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vpro, bepro, getpro |
| **References** | FR-CRT-080, FR-CRT-081, FR-CRT-083 |
| **Preconditions** | Cart contains a bundle product. |
| **Required data keys** | `cart.bundle_product` |

**Actions**
1. Navigate to the Cart page.
2. Inspect the bundle line item.

**Expected outcomes**
- A bundle indicator badge is displayed on the bundle line item.

---

### TC-CART-081 — Bundle line item displays the child products of the bundle

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vpro, bepro, getpro |
| **References** | FR-CRT-082, FR-CRT-083 |
| **Preconditions** | Cart contains a bundle product with at least two child products. |
| **Required data keys** | `cart.bundle_product`, `cart.bundle_children` |

**Actions**
1. Navigate to the Cart page.
2. Inspect the bundle line item.

**Expected outcomes**
- All child products forming the bundle are listed within the bundle line item.

---

## 10. Product Variants

> **Storefront applicability:** FR-CRT-093 — Variant handling applies to **vfashion and bepro** only.

### TC-CART-090 — Variant line item displays selected variant information

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, bepro |
| **References** | FR-CRT-090, FR-CRT-093 |
| **Preconditions** | Cart contains a variant product (e.g. size M, colour Blue). |
| **Required data keys** | `cart.variant_product`, `cart.variant_attributes` |

**Actions**
1. Navigate to the Cart page.
2. Inspect the variant line item.

**Expected outcomes**
- The selected variant attributes (e.g. size, colour) are displayed on the line item.

---

### TC-CART-091 — Different variants of the same product are separate line items

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, bepro |
| **References** | FR-CRT-091, BR-004 |
| **Preconditions** | Cart contains two different variants of the same base product. |
| **Required data keys** | `cart.variant_product_A`, `cart.variant_product_B` |

**Actions**
1. Navigate to the Cart page.

**Expected outcomes**
- Each variant appears as a separate line item with its own quantity and price.

---

### TC-CART-092 — Adding a variant already in the cart increases the existing line item quantity

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, bepro |
| **References** | FR-CRT-092 |
| **Preconditions** | Cart contains variant A of a product with quantity Q < 99. |
| **Required data keys** | `cart.variant_product_A` |

**Actions**
1. Navigate to the PDP of the same product.
2. Select the same variant A.
3. Add to cart.
4. Navigate to the Cart page.

**Expected outcomes**
- Only one line item exists for variant A, with quantity = Q + 1 (unless stock or limit was reached).

---

## 11. Stock Availability

> **Storefront applicability for out-of-stock blocking:** FR-CRT-104 — Applies to **vfashion and vpro**. bepro and getpro are **Not specified** (see Ambiguity Register: AMB-001).

### TC-CART-100 — Out-of-stock line item displays out-of-stock label (vfashion, vpro)

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-CRT-100, FR-CRT-104 |
| **Preconditions** | Cart contains a product that has gone out of stock. |
| **Required data keys** | `cart.product_out_of_stock` |

**Actions**
1. Navigate to the Cart page.

**Expected outcomes**
- An out-of-stock label is displayed against the unavailable line item (message key: `Out-of-stock label`).

---

### TC-CART-101 — Checkout is blocked when cart contains an out-of-stock item (vfashion, vpro)

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-CRT-101, BR-005, FR-CRT-104 |
| **Preconditions** | Cart contains at least one out-of-stock item and at least one in-stock item. |
| **Required data keys** | `cart.product_out_of_stock`, `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Select the Checkout button.

**Expected outcomes**
- The user does not proceed to the Checkout page.
- A toast message is displayed (message key: `Out-of-stock checkout message`).
- The user remains on the Cart page.

---

### TC-CART-102 — Express Checkout is blocked when cart contains an out-of-stock item (vfashion, vpro)

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-CRT-102, BR-005, FR-CRT-104 |
| **Preconditions** | Registered User. Cart contains at least one out-of-stock item. |
| **Required data keys** | `cart.product_out_of_stock`, `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Select the Express Checkout button.

**Expected outcomes**
- The user does not proceed to Express Checkout.
- A toast message is displayed (message key: `Out-of-stock checkout message`).
- The user remains on the Cart page.

---

### TC-CART-103 — User can remove an out-of-stock item from the cart (vfashion, vpro)

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-CRT-103 |
| **Preconditions** | Cart contains an out-of-stock line item. |
| **Required data keys** | `cart.product_out_of_stock` |

**Actions**
1. Navigate to the Cart page.
2. Select the remove control on the out-of-stock line item.

**Expected outcomes**
- The out-of-stock item is removed from the cart.
- Order summary and cart count update accordingly.

---

### TC-CART-104 — User can modify cart while an out-of-stock item is present (vfashion, vpro)

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-CRT-103 |
| **Preconditions** | Cart contains an out-of-stock item and another in-stock item with quantity 1. |
| **Required data keys** | `cart.product_out_of_stock`, `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Increase the quantity of the in-stock line item.

**Expected outcomes**
- Quantity of the in-stock item increases.
- Order summary updates.

---

## 12. Delivery Location

### TC-CART-110 — Registered User's current delivery address is displayed on the Cart page

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-110 |
| **Preconditions** | Registered User has a saved delivery address. Cart contains at least one item. |
| **Required data keys** | `user.registered`, `user.saved_address` |

**Actions**
1. Log in as a Registered User.
2. Navigate to the Cart page.

**Expected outcomes**
- The current delivery address is displayed.

---

### TC-CART-111 — Delivery location is not displayed for Guest

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-110 (UI matrix: Guest = No for delivery address) |
| **Preconditions** | Guest user with at least one item in the cart. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page as a Guest.

**Expected outcomes**
- No delivery address section is displayed.

---

### TC-CART-112 — User can change delivery location from available saved addresses

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-111, FR-CRT-112, FR-CRT-113 |
| **Preconditions** | Registered User with at least two saved addresses. Cart contains at least one item. |
| **Required data keys** | `user.registered`, `user.saved_address`, `user.alternate_address` |

**Actions**
1. Log in as a Registered User.
2. Navigate to the Cart page.
3. Select the delivery location change control.
4. Choose an alternate saved address.

**Expected outcomes**
- The displayed delivery address updates to the newly selected address.
- Any location-dependent values (e.g. shipping) are recalculated.
- The selected address is retained for subsequent cart actions.

---

## 13. Checkout

### TC-CART-120 — Checkout button is visible on a non-empty cart

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-120 |
| **Preconditions** | Cart contains at least one in-stock item (Guest or Registered User). |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.

**Expected outcomes**
- A Checkout button is visible.

---

### TC-CART-121 — Checkout button is not visible on an empty cart

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-155 |
| **Preconditions** | Cart is empty. |

**Actions**
1. Navigate to the Cart page.

**Expected outcomes**
- The Checkout button is not displayed.

---

### TC-CART-122 — Registered User with valid cart navigates to Checkout on selecting Checkout

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-121 |
| **Preconditions** | Registered User. Cart contains only in-stock items. |
| **Required data keys** | `user.registered`, `cart.product_in_stock` |

**Actions**
1. Log in as a Registered User.
2. Navigate to the Cart page.
3. Select the Checkout button.

**Expected outcomes**
- The user is navigated to the Checkout page.

---

### TC-CART-123 — Guest selecting Checkout follows the configured sign-in or guest checkout journey

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-122 |
| **Preconditions** | Guest user. Cart contains only in-stock items. |
| **Required data keys** | `cart.product_in_stock` |
| **Blocked** | **AMB-004** — The specific guest checkout journey (sign-in required vs. guest checkout permitted) is not yet confirmed. |

**Actions**
1. Navigate to the Cart page as a Guest.
2. Select the Checkout button.

**Expected outcomes**
- The system follows the configured sign-in or guest checkout journey (exact flow: blocked pending AMB-004 resolution).

---

## 14. Express Checkout

### TC-CART-130 — Express Checkout button is displayed to Registered User with items in cart

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-130, BR-006 |
| **Preconditions** | Registered User. Cart contains at least one in-stock item. |
| **Required data keys** | `user.registered`, `cart.product_in_stock` |

**Actions**
1. Log in as a Registered User.
2. Navigate to the Cart page.

**Expected outcomes**
- An Express Checkout button is visible.

---

### TC-CART-131 — Express Checkout button is NOT displayed to Guest

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-131, BR-006 |
| **Preconditions** | Guest user. Cart contains at least one item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page as a Guest.

**Expected outcomes**
- The Express Checkout button is not displayed.

---

### TC-CART-132 — Express Checkout button is not displayed when cart is empty

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-155 |
| **Preconditions** | Registered User. Cart is empty. |
| **Required data keys** | `user.registered` |

**Actions**
1. Log in as a Registered User.
2. Navigate to the Cart page with an empty cart.

**Expected outcomes**
- The Express Checkout button is not displayed.

---

### TC-CART-133 — Registered User with valid cart navigates to Express Checkout on selecting Express Checkout

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-132 |
| **Preconditions** | Registered User. Cart contains only in-stock items. |
| **Required data keys** | `user.registered`, `cart.product_in_stock` |

**Actions**
1. Log in as a Registered User.
2. Navigate to the Cart page.
3. Select the Express Checkout button.

**Expected outcomes**
- The user is navigated to the Express Checkout page.

---

## 15. Other Payment Methods

### TC-CART-140 — Other payment methods section is displayed to Registered User with items in cart

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-140 |
| **Preconditions** | Registered User. Cart contains at least one item. |
| **Required data keys** | `user.registered`, `cart.product_in_stock` |

**Actions**
1. Log in as a Registered User.
2. Navigate to the Cart page.

**Expected outcomes**
- An "Other payment methods" section is displayed.

---

### TC-CART-141 — Other payment methods section is NOT displayed to Guest

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-140 (UI matrix: Guest = No) |
| **Preconditions** | Guest user. Cart contains at least one item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page as a Guest.

**Expected outcomes**
- The "Other payment methods" section is not displayed.

---

## 16. Empty Cart

### TC-CART-150 — Empty cart message replaces item list and order summary for Registered User

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-150 |
| **Preconditions** | Registered User. Cart is empty. |
| **Required data keys** | `user.registered` |

**Actions**
1. Log in as a Registered User.
2. Navigate to the Cart page with an empty cart.

**Expected outcomes**
- The item list is not displayed.
- The order summary is not displayed.
- An empty cart message is displayed (message key: `Empty cart message`).

---

### TC-CART-151 — Registered User empty cart page displays "Continue shopping" link navigating to Home

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-151 |
| **Preconditions** | Registered User. Cart is empty. |
| **Required data keys** | `user.registered` |

**Actions**
1. Log in as a Registered User.
2. Navigate to the Cart page with an empty cart.
3. Select the "Continue shopping" link.

**Expected outcomes**
- The user is navigated to the Home page.

---

### TC-CART-152 — Guest empty cart displays empty message, sub-text, Sign In link and Browse products link

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-152 |
| **Preconditions** | Guest user. Cart is empty. |

**Actions**
1. Navigate to the Cart page as a Guest with an empty cart.

**Expected outcomes**
- Empty cart message is displayed (message key: `Empty cart message`).
- Explanatory sub-text is displayed (message key: `Empty cart sub-text`).
- A "Sign in" link is displayed.
- A "Browse products" link is displayed.

---

### TC-CART-153 — "Sign in" link on Guest empty cart navigates to Sign In page

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-153 |
| **Preconditions** | Guest user. Cart is empty. |

**Actions**
1. Navigate to the Cart page as a Guest with an empty cart.
2. Select the "Sign in" link.

**Expected outcomes**
- The user is navigated to the Sign In page.

---

### TC-CART-154 — "Browse products" link on Guest empty cart navigates to Home page

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-154 |
| **Preconditions** | Guest user. Cart is empty. |

**Actions**
1. Navigate to the Cart page as a Guest with an empty cart.
2. Select the "Browse products" link.

**Expected outcomes**
- The user is navigated to the Home page.

---

### TC-CART-155 — Checkout and Express Checkout actions are not displayed on empty cart

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-155 |
| **Preconditions** | Any user (Guest or Registered). Cart is empty. |

**Actions**
1. Navigate to the Cart page with an empty cart.

**Expected outcomes**
- The Checkout button is not displayed.
- The Express Checkout button is not displayed.

---

## 17. Guest Cart

### TC-CART-160 — Guest can add, view, update and remove items without signing in

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-160 |
| **Preconditions** | Guest user. At least one in-stock product is available. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. As a Guest, navigate to a PDP and add a product to the cart.
2. Navigate to the Cart page.
3. Increase the quantity of the added item.
4. Remove the item.

**Expected outcomes**
- Each action is performed without being prompted to sign in.
- Cart reflects each change.

---

### TC-CART-161 — Guest cart does not persist beyond the guest session

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-161, BR-008 |
| **Preconditions** | Guest user has items in the cart. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. As a Guest, add an item to the cart.
2. End the guest session (close the browser or clear the session cookies).
3. Return to the storefront as a new Guest.
4. Navigate to the Cart page.

**Expected outcomes**
- The Cart page shows an empty cart; the previous guest items are not present.

---

### TC-CART-162 — Registered user's cart does not carry over into the subsequent guest session after logout

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-162 |
| **Preconditions** | Registered User is logged in and has items in the cart. |
| **Required data keys** | `user.registered`, `cart.product_in_stock` |

**Actions**
1. Log in as a Registered User with items in the cart.
2. Log out.
3. Navigate to the Cart page as the resulting Guest.

**Expected outcomes**
- The guest cart is empty; the Registered User's cart items are not shown.

---

## 18. Cart Merge on Login

### TC-CART-170 — Guest cart is merged into registered cart on login (single item)

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-170, FR-CRT-171, FR-CRT-176, BR-007 |
| **Preconditions** | Registered User has an empty cart. Guest has one item in the cart. |
| **Required data keys** | `user.registered`, `cart.guest_product` |

**Actions**
1. As a Guest, add one product to the cart.
2. Log in as a Registered User.
3. Navigate to the Cart page.

**Expected outcomes**
- The guest item appears in the registered user's cart after login.
- Cart count indicator reflects the merged cart.

---

### TC-CART-171 — Registered user's existing items are retained after merge

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-172, BR-007 |
| **Preconditions** | Registered User has one item in the cart. Guest has one different item in the cart. |
| **Required data keys** | `user.registered`, `cart.registered_product`, `cart.guest_product` |

**Actions**
1. As a Guest, add a product to the cart.
2. Log in as a Registered User who already has a different product in the cart.
3. Navigate to the Cart page.

**Expected outcomes**
- Both the guest product and the registered product are present in the merged cart.

---

### TC-CART-172 — Same product in both carts is combined into a single line item with combined quantity

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-173 |
| **Preconditions** | Registered User has product P at quantity 1. Guest has product P at quantity 1. Combined = 2 <= 99. |
| **Required data keys** | `user.registered`, `cart.product_in_stock` (same product in both carts) |

**Actions**
1. As a Guest, add product P (quantity 1) to the cart.
2. Log in as a Registered User who has product P (quantity 1) in the cart.
3. Navigate to the Cart page.

**Expected outcomes**
- Product P appears as a single line item with quantity = 2.

---

### TC-CART-173 — Combined quantity is capped at Maximum Quantity Limit on merge

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-174, BR-002 |
| **Preconditions** | Registered User has product P at quantity 95. Guest has product P at quantity 10. Combined (105) > 99. |
| **Required data keys** | `user.registered`, `cart.product_at_high_qty`, `cart.product_guest_qty` |

**Actions**
1. As a Guest, add product P at quantity 10.
2. Log in as a Registered User who has product P at quantity 95.
3. Navigate to the Cart page.

**Expected outcomes**
- Product P quantity is set to 99 (Maximum Quantity Limit).

---

### TC-CART-174 — Login with empty guest cart leaves registered cart unchanged

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-175 |
| **Preconditions** | Registered User has items in the cart. Guest cart is empty. |
| **Required data keys** | `user.registered`, `cart.product_in_stock` |

**Actions**
1. Ensure the guest cart is empty.
2. Log in as a Registered User.
3. Navigate to the Cart page.

**Expected outcomes**
- The registered user's cart is unchanged.
- No items are added or removed.

---

## 19. Cart Count Indicator

### TC-CART-180 — Cart count indicator reflects the number of items in the cart

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-180, FR-CRT-181 |
| **Preconditions** | Cart contains at least one item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to any storefront page with items in the cart.

**Expected outcomes**
- The header cart icon displays a count indicator matching the number of items in the cart.

---

### TC-CART-181 — Cart count indicator updates on add without page refresh

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-181 |
| **Preconditions** | Cart is empty or has items. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Note the current cart count indicator value.
2. Add an in-stock product to the cart from a PDP (without navigating away).

**Expected outcomes**
- The cart count indicator updates to reflect the new count without a page refresh.

---

### TC-CART-182 — Cart count indicator updates on removal without page refresh

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-181 |
| **Preconditions** | Cart contains at least one item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Note the current cart count indicator.
3. Remove one line item.

**Expected outcomes**
- The cart count indicator decreases by the removed item's quantity without a page refresh.

---

### TC-CART-183 — Cart count indicator is not displayed when cart is empty

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-182 |
| **Preconditions** | Cart is empty. |

**Actions**
1. Navigate to any storefront page with an empty cart.

**Expected outcomes**
- No count indicator is displayed on the header cart icon.

---

## 20. Mini Cart (Desktop)

> **Device applicability:** Mini Cart applies to **desktop only** (FR-CRT-199, Section 4.3).

### TC-CART-190 — Mini Cart is displayed on hovering the header cart icon on desktop

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-190 |
| **Preconditions** | Desktop device. Cart contains at least one item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. On a desktop browser, hover over the header cart icon.

**Expected outcomes**
- The Mini Cart is displayed.

---

### TC-CART-191 — Mini Cart displays product image, name, price and quantity for each item

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-191 |
| **Preconditions** | Desktop device. Cart contains at least one item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Hover over the header cart icon.
2. Inspect the Mini Cart items.

**Expected outcomes**
- Each item shows: product image, product name, price and quantity.

---

### TC-CART-192 — Mini Cart displays shipping cost, total amount and View Cart button

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-192 |
| **Preconditions** | Desktop device. Cart contains at least one item. Shipping charge is displayed. |
| **Required data keys** | `cart.product_in_stock` |
| **Blocked (partial)** | **AMB-007** — Whether shipping is included in Cart page summary or only in Mini Cart is not yet confirmed. |

**Actions**
1. Hover over the header cart icon.

**Expected outcomes**
- The shipping cost is displayed.
- The total amount is displayed.
- A "View Cart" button is visible.

---

### TC-CART-193 — Mini Cart total equals sum of item prices plus shipping charge

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-193 |
| **Preconditions** | Desktop device. Cart contains at least one item. Shipping charge is displayed. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Hover over the header cart icon.
2. Read the item prices, shipping charge and total displayed in the Mini Cart.

**Expected outcomes**
- Mini Cart total = sum of item prices + shipping charge.

---

### TC-CART-194 — Removing an item via Mini Cart updates the Mini Cart and count indicator

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-194 |
| **Preconditions** | Desktop device. Cart contains at least two items. |
| **Required data keys** | `cart.product_in_stock`, `cart.product_in_stock_2` |

**Actions**
1. Hover over the header cart icon.
2. Select the remove control on one Mini Cart item.

**Expected outcomes**
- The removed item no longer appears in the Mini Cart.
- The Mini Cart total updates.
- The cart count indicator updates.

---

### TC-CART-195 — Removing the last item via Mini Cart shows the empty Mini Cart state

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-195 |
| **Preconditions** | Desktop device. Cart contains exactly one item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Hover over the header cart icon.
2. Select the remove control on the single item.

**Expected outcomes**
- The Mini Cart displays the empty state.
- Cart count indicator is no longer displayed (FR-CRT-182).

---

### TC-CART-196 — Empty Mini Cart displays empty cart message and Browse products link

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-196 |
| **Preconditions** | Desktop device. Cart is empty. |

**Actions**
1. Hover over the header cart icon.

**Expected outcomes**
- An empty cart message is displayed in the Mini Cart (message key: `Empty cart message`).
- A "Browse products" link is displayed.

---

### TC-CART-197 — Browse products link in Mini Cart navigates to Home page

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-197 |
| **Preconditions** | Desktop device. Mini Cart is in empty state. |

**Actions**
1. Hover over the header cart icon.
2. Select the "Browse products" link.

**Expected outcomes**
- The user is navigated to the Home page.

---

### TC-CART-198 — View Cart button in Mini Cart navigates to the Cart page

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-198 |
| **Preconditions** | Desktop device. Cart contains at least one item. Mini Cart is open. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Hover over the header cart icon.
2. Select the "View Cart" button.

**Expected outcomes**
- The user is navigated to the Cart page.

---

### TC-CART-199 — Mini Cart is not displayed on mobile devices

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FR-CRT-199, Section 4.3 |
| **Preconditions** | Mobile device (or mobile viewport). Cart contains at least one item. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Using a mobile viewport, hover over (or tap) the header cart icon.

**Expected outcomes**
- The Mini Cart panel is not displayed.

---

## 21. Error Handling & Edge Scenarios

> **Source:** FSD Section 10 (Error Handling). These scenarios require specific network/service fault injection or asynchronous state changes.

### TC-CART-200 — Cart service unavailable displays friendly error and retry option

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FSD Section 10 (Cart service unavailable) |
| **Test layer** | Integration / UI with network interception |
| **Preconditions** | Cart service returns HTTP 5xx or fails to respond. |

**Actions**
1. Navigate to the Cart page while the cart service is unavailable.

**Expected outcomes**
- A user-friendly error message is displayed.
- A retry action/button is presented.
- No partial or corrupted cart updates are displayed.

---

### TC-CART-201 — Failed quantity update reverts to last valid quantity and displays error

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FSD Section 10 (Quantity update fails) |
| **Test layer** | Integration / UI with network interception |
| **Preconditions** | Cart contains an item with quantity Q. Backend rejects quantity update. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Navigate to the Cart page.
2. Attempt to update quantity to Q + 1 when the backend service fails the update.

**Expected outcomes**
- An error notification is displayed to the user.
- The quantity input reverts to the last known valid quantity (Q).
- Line total and order summary match the reverted quantity.

---

### TC-CART-202 — Stock change while cart is open adjusts quantity and reflects status

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FSD Section 10 (Stock changes while cart is open), FR-CRT-026 |
| **Test layer** | Integration / End-to-End |
| **Preconditions** | Cart contains item with quantity 5. Available inventory drops to 3 while cart is open. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. Open the Cart page with 5 units.
2. Trigger inventory update or refresh/re-evaluate cart.

**Expected outcomes**
- Quantity is automatically adjusted to maximum available stock (3).
- Line item reflects updated stock constraints and totals recalculate.

---

### TC-CART-203 — Price change while cart is open updates prices on next action or refresh

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FSD Section 10 (Price changes while cart is open), NFR-007 |
| **Test layer** | Integration / End-to-End |
| **Preconditions** | Cart contains an item whose catalog price changes while cart is open. |
| **Required data keys** | `cart.product_in_stock` |

**Actions**
1. With the cart open, change the product price in the catalog backend.
2. Refresh or trigger a cart interaction (e.g. quantity adjustment).

**Expected outcomes**
- Displayed unit price and line total reflect the updated backend price.
- Order summary recalculates according to the new price.

---

### TC-CART-204 — Session expiry during cart operations treats user as Guest

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | All |
| **References** | FSD Section 10 (Session expiry), FR-CRT-161 |
| **Test layer** | Integration / End-to-End |
| **Preconditions** | Registered User session expires while interacting with the Cart. |
| **Required data keys** | `user.registered`, `cart.product_in_stock` |

**Actions**
1. Invalidate or expire the registered user authentication session.
2. Perform a cart action or refresh the Cart page.

**Expected outcomes**
- User is treated as a Guest.
- Registered-only controls (Express Checkout, saved delivery address) are no longer displayed.
- Guest cart rules apply.

---

## 22. Non-Functional Requirements & Test-Layer Allocations

The following requirements from FSD Section 9 are allocated to specialized test layers and execution pipelines rather than standard functional UI tests:

| NFR ID | Category | Target / Requirement | Allocated Test Layer | Verification Method |
|--------|----------|----------------------|----------------------|---------------------|
| **NFR-001** | Performance | Cart page load within 3 seconds under normal load | Performance / Lighthouse | Synthetic load & client performance metrics |
| **NFR-002** | Performance | Quantity, remove and discount updates reflect within 2 seconds | Performance / Tracing | Playwright tracing & network timing assertions |
| **NFR-003** | Availability | In line with platform availability targets | Infrastructure / SRE | Synthetic heartbeat & uptime monitoring |
| **NFR-004** | Usability | Responsive across desktop, tablet, and mobile viewports | Automated UI & Visual Regression | Playwright multi-viewport matrix (handled functionally in TC-CART-199) |
| **NFR-005** | Accessibility | Conform to WCAG 2.1 Level AA, including full keyboard control | Accessibility Testing | `@axe-core/playwright` automated scans & manual keyboard audit |
| **NFR-006** | Security | Cart operations authorized per session; no cross-session leakage | Security / API Penetration | Session token boundary testing & IDOR validation |
| **NFR-007** | Data Integrity | Server-side validation of prices, stock, discounts; client untrusted | API Integration | Request payload tampering testing (tested in TC-CART-203) |
| **NFR-008** | Compatibility | Supported on Chrome, Edge, Safari, Firefox and mobile browsers | Cross-Browser Matrix | Playwright multi-browser project matrix |
| **NFR-009** | Localisation | Text, currency and numbers follow storefront locale | Functional UI | Storefront data resolution via `tests/data/<env>/<store>/<locale>.json` |

---

## 23. Ambiguity Register

Cases marked **Blocked** or **Partial** are pending resolution of these open items from FSD Section 12:

| ID | FSD Open Item | Source | Unclear Rule | Why It Matters | Affected Cases | Question |
|----|---------------|--------|--------------|----------------|----------------|---------|
| **AMB-001** | Open Item 1 | Sec 8, FR-CRT-104 | Out-of-stock checkout blocking for bepro and getpro is "Not specified" | Cannot assert blocking or non-blocking behaviour on those storefronts | TC-CART-101, TC-CART-102 (bepro/getpro scope) | Does out-of-stock item block Checkout/Express Checkout on bepro and getpro? |
| **AMB-002** | Open Item 2 | Sec 8, FR-CRT-093 | Variant support for vpro and getpro is not specified | Cannot assert variant line item behaviour on those storefronts | TC-CART-090 to TC-CART-092 (vpro/getpro scope) | Are variants supported (separate line items) on vpro and getpro? |
| **AMB-003** | Open Item 3 | Sec 8, FR-CRT-083 | Bundle support for storefronts other than vfashion — confirmation requested | Not a blocker for vpro/bepro/getpro as currently stated; vfashion exclusion already applied | TC-CART-080, TC-CART-081 | Confirm bundle support for vpro, bepro and getpro is correct as stated in Section 8. |
| **AMB-004** | Open Item 4 | FR-CRT-122 | Guest checkout journey: sign-in required, or guest checkout permitted? | Cannot assert the destination page after a Guest selects Checkout | TC-CART-123 | Is a guest required to sign in, or can they continue as a guest through to Checkout? |
| **AMB-005** | Open Item 5 | FR-CRT-050-052 | Promotion code stacking with automatic discounts is not specified | Cannot write cases for combined promo + auto-discount scenarios | None currently defined | Can a promotion code and an automatic discount both be applied simultaneously? What is the stacking rule? |
| **AMB-006** | Open Item 6 | Sec 7.2 | Final message wording pending Content Team approval | Message keys used in cases; if keys or triggers change, assertions must be updated | All cases referencing message keys | Confirm final message key names and triggers. |
| **AMB-007** | Open Item 7 | FR-CRT-192 | Whether shipping is included in Cart page summary or only in Mini Cart | Affects TC-CART-040/041 assertions on the Cart page order summary | TC-CART-192 (partial), TC-CART-040 | Is the shipping cost shown in the Cart page order summary, in the Mini Cart only, or both? |

---

## 24. Traceability Matrix

| TC ID | FR / BR / Error IDs | FSD Section | Coverage Status |
|-------|---------------------|-------------|-----------------|
| TC-CART-001 | FR-CRT-001, FR-CRT-002 | 5.1 | Ready |
| TC-CART-002 | FR-CRT-001, FR-CRT-002 | 5.1 | Ready |
| TC-CART-003 | FR-CRT-002 | 5.1 | Ready |
| TC-CART-004 | FR-CRT-003, FR-CRT-004 | 5.1 | Ready |
| TC-CART-010 | FR-CRT-010 | 5.2 | Ready |
| TC-CART-011 | FR-CRT-011 | 5.2 | Ready |
| TC-CART-012 | FR-CRT-013 | 5.2 | Ready |
| TC-CART-013 | FR-CRT-014 | 5.2 | Ready |
| TC-CART-014 | FR-CRT-015 | 5.2 | Ready |
| TC-CART-020 | FR-CRT-020 | 5.3 | Ready |
| TC-CART-021 | FR-CRT-021, BR-001 | 5.3 | Ready |
| TC-CART-022 | FR-CRT-022, BR-002 | 5.3 | Ready |
| TC-CART-023 | FR-CRT-023, FR-CRT-028 | 5.3 | Ready |
| TC-CART-024 | FR-CRT-023, FR-CRT-028 | 5.3 | Ready |
| TC-CART-025 | FR-CRT-024, FR-CRT-028 | 5.3 | Ready |
| TC-CART-026 | FR-CRT-025, BR-002 | 5.3 | Ready |
| TC-CART-027 | FR-CRT-026, BR-003 | 5.3 | Ready |
| TC-CART-028 | FR-CRT-027, BR-002 | 5.3 | Ready |
| TC-CART-030 | FR-CRT-030, FR-CRT-031 | 5.4 | Ready |
| TC-CART-031 | FR-CRT-030, FR-CRT-032, FR-CRT-150 | 5.4 | Ready |
| TC-CART-040 | FR-CRT-040, FR-CRT-041 | 5.5 | Ready |
| TC-CART-041 | FR-CRT-043 | 5.5 | Ready |
| TC-CART-042 | FR-CRT-042 | 5.5 | Ready |
| TC-CART-050 | FR-CRT-050 | 5.6 | Ready |
| TC-CART-051 | FR-CRT-051 | 5.6 | Ready |
| TC-CART-052 | FR-CRT-052 | 5.6 | Ready |
| TC-CART-053 | FR-CRT-052 | 5.6 | Ready |
| TC-CART-060 | FR-CRT-060 | 5.7 | Ready |
| TC-CART-061 | FR-CRT-061 | 5.7 | Ready |
| TC-CART-062 | FR-CRT-061 | 5.7 | Ready |
| TC-CART-070 | FR-CRT-070, FR-CRT-071, FR-CRT-072, BR-009 | 5.8 | Ready (getpro) |
| TC-CART-071 | FR-CRT-073, BR-009 | 5.8 | Ready (getpro) |
| TC-CART-072 | FR-CRT-070, FR-CRT-071 | 5.8 | Ready (vfashion, vpro, bepro) |
| TC-CART-080 | FR-CRT-080, FR-CRT-081, FR-CRT-083 | 5.9 | Ready (vpro, bepro, getpro) |
| TC-CART-081 | FR-CRT-082, FR-CRT-083 | 5.9 | Ready (vpro, bepro, getpro) |
| TC-CART-090 | FR-CRT-090, FR-CRT-093 | 5.10 | Ready (vfashion, bepro) |
| TC-CART-091 | FR-CRT-091, BR-004 | 5.10 | Ready (vfashion, bepro) |
| TC-CART-092 | FR-CRT-092 | 5.10 | Ready (vfashion, bepro) |
| TC-CART-100 | FR-CRT-100, FR-CRT-104 | 5.11 | Ready (vfashion, vpro) |
| TC-CART-101 | FR-CRT-101, BR-005, FR-CRT-104 | 5.11 | Ready (vfashion, vpro) |
| TC-CART-102 | FR-CRT-102, BR-005, FR-CRT-104 | 5.11 | Ready (vfashion, vpro) |
| TC-CART-103 | FR-CRT-103 | 5.11 | Ready (vfashion, vpro) |
| TC-CART-104 | FR-CRT-103 | 5.11 | Ready (vfashion, vpro) |
| TC-CART-110 | FR-CRT-110 | 5.12 | Ready |
| TC-CART-111 | FR-CRT-110 (UI matrix) | 5.12 | Ready |
| TC-CART-112 | FR-CRT-111, FR-CRT-112, FR-CRT-113 | 5.12 | Ready |
| TC-CART-120 | FR-CRT-120 | 5.13 | Ready |
| TC-CART-121 | FR-CRT-155 | 5.16 | Ready |
| TC-CART-122 | FR-CRT-121 | 5.13 | Ready |
| TC-CART-123 | FR-CRT-122 | 5.13 | Blocked (AMB-004) |
| TC-CART-130 | FR-CRT-130, BR-006 | 5.14 | Ready |
| TC-CART-131 | FR-CRT-131, BR-006 | 5.14 | Ready |
| TC-CART-132 | FR-CRT-155 | 5.16 | Ready |
| TC-CART-133 | FR-CRT-132 | 5.14 | Ready |
| TC-CART-140 | FR-CRT-140 | 5.15 | Ready |
| TC-CART-141 | FR-CRT-140 (UI matrix) | 5.15 | Ready |
| TC-CART-150 | FR-CRT-150 | 5.16 | Ready |
| TC-CART-151 | FR-CRT-151 | 5.16 | Ready |
| TC-CART-152 | FR-CRT-152 | 5.16 | Ready |
| TC-CART-153 | FR-CRT-153 | 5.16 | Ready |
| TC-CART-154 | FR-CRT-154 | 5.16 | Ready |
| TC-CART-155 | FR-CRT-155 | 5.16 | Ready |
| TC-CART-160 | FR-CRT-160 | 5.17 | Ready |
| TC-CART-161 | FR-CRT-161, BR-008 | 5.17 | Ready |
| TC-CART-162 | FR-CRT-162 | 5.17 | Ready |
| TC-CART-170 | FR-CRT-170, FR-CRT-171, FR-CRT-176, BR-007 | 5.18 | Ready |
| TC-CART-171 | FR-CRT-172, BR-007 | 5.18 | Ready |
| TC-CART-172 | FR-CRT-173 | 5.18 | Ready |
| TC-CART-173 | FR-CRT-174, BR-002 | 5.18 | Ready |
| TC-CART-174 | FR-CRT-175 | 5.18 | Ready |
| TC-CART-180 | FR-CRT-180, FR-CRT-181 | 5.19 | Ready |
| TC-CART-181 | FR-CRT-181 | 5.19 | Ready |
| TC-CART-182 | FR-CRT-181 | 5.19 | Ready |
| TC-CART-183 | FR-CRT-182 | 5.19 | Ready |
| TC-CART-190 | FR-CRT-190 | 5.20 | Ready |
| TC-CART-191 | FR-CRT-191 | 5.20 | Ready |
| TC-CART-192 | FR-CRT-192 | 5.20 | Partial (AMB-007) |
| TC-CART-193 | FR-CRT-193 | 5.20 | Ready |
| TC-CART-194 | FR-CRT-194 | 5.20 | Ready |
| TC-CART-195 | FR-CRT-195 | 5.20 | Ready |
| TC-CART-196 | FR-CRT-196 | 5.20 | Ready |
| TC-CART-197 | FR-CRT-197 | 5.20 | Ready |
| TC-CART-198 | FR-CRT-198 | 5.20 | Ready |
| TC-CART-199 | FR-CRT-199, Section 4.3 | 5.20 | Ready |
| TC-CART-200 | FSD Section 10 (Service unavailable) | 10 | Ready (Integration/Fault injection) |
| TC-CART-201 | FSD Section 10 (Quantity update fails) | 10 | Ready (Integration/Fault injection) |
| TC-CART-202 | FSD Section 10 (Stock changes), FR-CRT-026 | 10 | Ready (Integration/E2E) |
| TC-CART-203 | FSD Section 10 (Price changes), NFR-007 | 10 | Ready (Integration/E2E) |
| TC-CART-204 | FSD Section 10 (Session expiry), FR-CRT-161 | 10 | Ready (Integration/E2E) |
