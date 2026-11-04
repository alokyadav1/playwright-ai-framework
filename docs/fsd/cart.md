# Functional Specification Document: Shopping Cart

**Platform:** LCS E-Commerce Storefronts (vfashion, vpro, bepro, getpro)
**Module:** Shopping Cart and Mini Cart
**Version:** 1.0

## 1. Document Control

| Attribute      | Detail                                            |
| -------------- | ------------------------------------------------- |
| Document Title | Functional Specification Document – Shopping Cart |
| Document ID    | FSD-CART-001                                      |
| Version        | 1.0                                               |
| Status         | Reviewed                                          |
| Prepared By    | Business Analysis / QA                            |
| Reviewed By    | Product Owner, Engineering Lead                   |
| Approved By    | Alok                                              |
| Classification | Internal                                          |

### 1.1 Revision History

| Version | Date        | Author            | Description of Change   |
| ------- | ----------- | ----------------- | ----------------------- |
| 0.1     | 26-Oct-2026 | Business Analysis | Initial draft           |
| 1.0     | 26-Oct-2026 | Business Analysis | Draft issued for review |

## 2. Introduction

### 2.1 Purpose

This document specifies the functional behaviour of the Shopping Cart module, covering the full-page Cart and the Mini Cart. It is the single reference for design, development and testing, and defines what the system shall do, independent of how it is implemented.

### 2.2 Scope

**In scope**

- Cart page for guest (anonymous) and registered (logged-in) customers
- Mini Cart (desktop)
- Line item display, quantity management and item removal
- Price summary, promotion code, automatic discounts and gift options
- Bundle and variant products
- Stock availability handling within the cart
- Delivery location display and update
- Navigation to Checkout and Express Checkout
- Empty cart experience
- Guest cart behaviour and guest-to-registered cart merge
- Cart count indicator

**Out of scope**

- Checkout, payment processing and order confirmation
- Product catalogue, search and Product Detail Page (PDP) content
- Wishlist functionality
- Customer registration and authentication (except where they affect the cart)
- Order management and returns

### 2.3 Intended Audience

Product Owners, Business Analysts, Solution Architects, UI/UX Designers, Developers, QA Engineers and Project Managers.

### 2.4 Definitions, Acronyms and Abbreviations

| Term                   | Definition                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------ |
| Cart                   | The collection of products a customer intends to purchase                            |
| Line Item              | A single product (or product variant) entry in the cart, with its quantity and price |
| Guest                  | A visitor who is not logged in                                                       |
| Registered User        | A customer who is logged in to an account                                            |
| Mini Cart              | A compact cart summary shown on hovering the cart icon in the header (desktop)       |
| Bundle                 | A product composed of multiple child products sold together                          |
| Variant                | A purchasable option of a product (for example size or colour) with its own SKU      |
| SKU                    | Stock Keeping Unit                                                                   |
| PDP                    | Product Detail Page                                                                  |
| PLP                    | Product Listing Page                                                                 |
| Express Checkout       | An accelerated checkout path available to registered users                           |
| Merge                  | Combining a guest cart with a registered user's saved cart upon login                |
| Maximum Quantity Limit | The highest quantity permitted per line item                                         |

### 2.5 References

- Business requirement inputs from Product and Commerce teams
- Storefront design guidelines
- Platform commerce engine and API specifications

## 3. Business Overview

### 3.1 Business Objective

Enable customers to review, adjust and confirm the products they intend to purchase with clarity and confidence, and move to checkout with minimum friction, while protecting the business from invalid orders (out-of-stock items, excessive quantities).

### 3.2 User Roles

| Role            | Description                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| Guest           | Can add products to the cart, view and modify the cart, and proceed to sign in. Cannot use Express Checkout. |
| Registered User | Has a persistent cart associated to the account. Can use all cart features including Express Checkout.       |

### 3.3 Store Variations

The module is shared across storefronts. Behaviour that differs by storefront is listed in Section 8. Unless stated otherwise, a requirement applies to all storefronts.

## 4. Assumptions, Dependencies and Constraints

### 4.1 Assumptions

- Product, price, stock and promotion data are maintained in the commerce platform and are available to the cart.
- The Maximum Quantity Limit, discount thresholds and currency are configurable values; defaults are stated in this document.
- The cart is accessible at a dedicated Cart page and via the header cart icon.
- All user-facing messages are configurable content.

### 4.2 Dependencies

- Commerce platform cart, pricing, inventory and promotion services
- Authentication service for login and session management
- Shipping and delivery location services
- Checkout and Express Checkout modules

### 4.3 Constraints

- Mini Cart is available on desktop devices only.
- Express Checkout is available to registered users only.

## 5. Functional Requirements

Requirement IDs follow the format **FR-CRT-nnn**. The term "shall" denotes a mandatory requirement.

### 5.1 Cart Access

| ID         | Requirement                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| FR-CRT-001 | The system shall provide a Cart page accessible to both Guest and Registered Users.                                       |
| FR-CRT-002 | The system shall allow users to open the Cart page from the header cart icon and from direct navigation.                  |
| FR-CRT-003 | The Cart page shall display the current contents of the cart in real time, reflecting any additions, updates or removals. |
| FR-CRT-004 | When the cart contains items, the Cart page shall display the item list, order summary and checkout actions.              |

### 5.2 Cart Line Item Display

| ID         | Requirement                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| FR-CRT-010 | For each line item, the system shall display the product image, product name, unit price, selected quantity and line total. |
| FR-CRT-011 | The product name shall be a link that navigates the user to the corresponding PDP.                                          |
| FR-CRT-012 | The system shall display each line item's stock status where applicable (see Section 5.11).                                 |
| FR-CRT-013 | The system shall provide a remove control for each line item.                                                               |
| FR-CRT-014 | The system shall display a quantity selector for each line item.                                                            |
| FR-CRT-015 | Line totals shall equal unit price multiplied by quantity.                                                                  |

### 5.3 Quantity Management

| ID         | Requirement                                                                                                                                                                                                          |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-CRT-020 | The quantity selector shall provide a decrease control, an increase control and an editable quantity field.                                                                                                          |
| FR-CRT-021 | The minimum quantity of a line item shall be 1. The decrease control shall be disabled when the quantity is 1.                                                                                                       |
| FR-CRT-022 | The Maximum Quantity Limit per line item shall be 99 (configurable). The increase control shall be disabled when the quantity equals the limit.                                                                      |
| FR-CRT-023 | When the user activates the increase or decrease control, the system shall change the quantity by one and recalculate the line total and order summary.                                                              |
| FR-CRT-024 | When the user enters a quantity directly, the system shall validate it and update the line total and order summary accordingly.                                                                                      |
| FR-CRT-025 | If the entered quantity exceeds the Maximum Quantity Limit, the system shall set the quantity to the limit.                                                                                                          |
| FR-CRT-026 | The system shall not allow the quantity of a line item to exceed the available stock. If the requested quantity exceeds available stock, the quantity shall be set to the maximum available.                         |
| FR-CRT-027 | If a product is already at the Maximum Quantity Limit in the cart and the user attempts to add it again from the PDP, the system shall not increase the quantity and shall display a maximum quantity error message. |
| FR-CRT-028 | Quantity changes shall be saved to the cart automatically without requiring a separate confirmation action.                                                                                                          |

### 5.4 Remove Item

| ID         | Requirement                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| FR-CRT-030 | When the user activates the remove control, the system shall remove the line item from the cart.              |
| FR-CRT-031 | After removal, the system shall recalculate the order summary and the cart count indicator.                   |
| FR-CRT-032 | If the removed item was the last item, the system shall display the empty cart experience (see Section 5.16). |

### 5.5 Order Summary

| ID         | Requirement                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| FR-CRT-040 | The Cart page shall display an order summary section.                                                                       |
| FR-CRT-041 | The order summary shall display the subtotal of all line items and any applicable discount, and the estimated total.        |
| FR-CRT-042 | The order summary shall update immediately upon any change in quantity, item removal, promotion or discount application.    |
| FR-CRT-043 | All monetary values shall be displayed in the storefront currency with the standard currency format and two decimal places. |

### 5.6 Promotion Code

| ID         | Requirement                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| FR-CRT-050 | The Cart page shall provide a promotion code entry section.                                                                           |
| FR-CRT-051 | When a valid promotion code is applied, the system shall apply the associated discount and reflect it in the order summary.           |
| FR-CRT-052 | When an invalid or expired promotion code is entered, the system shall display an error message and shall not change the order total. |

### 5.7 Gift Options

| ID         | Requirement                                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| FR-CRT-060 | The Cart page shall display a gift options checkbox.                                                                   |
| FR-CRT-061 | The user shall be able to select or clear the gift options checkbox, and the selection shall be retained for checkout. |

### 5.8 Automatic Discounts

| ID         | Requirement                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-CRT-070 | The system shall automatically apply an eligible cart-level discount, without user action, when the cart satisfies the discount conditions. |
| FR-CRT-071 | For the getpro storefront, an automatic discount shall be applied when the order value exceeds USD 2,000 (configurable).                    |
| FR-CRT-072 | The applied discount shall be displayed in the order summary and reflected in the estimated total.                                          |
| FR-CRT-073 | If a cart change causes the conditions to no longer be met, the system shall remove the automatic discount and update the totals.           |

### 5.9 Bundle Products

| ID         | Requirement                                                                                              |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| FR-CRT-080 | The system shall allow bundle products to be added to the cart.                                          |
| FR-CRT-081 | A bundle line item shall display a bundle indicator (badge).                                             |
| FR-CRT-082 | A bundle line item shall display the child products that form the bundle.                                |
| FR-CRT-083 | Bundle products are applicable to vpro, bepro and getpro storefronts only (not configured for vfashion). |

### 5.10 Product Variants

| ID         | Requirement                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| FR-CRT-090 | For variant products, the line item shall display the selected variant information (for example size or colour).                     |
| FR-CRT-091 | Different variants of the same product shall be maintained as separate line items in the cart, each with its own quantity and price. |
| FR-CRT-092 | Adding a variant already present in the cart shall increase the quantity of the existing line item for that variant.                 |
| FR-CRT-093 | Variant handling applies to the vfashion and bepro storefronts.                                                                      |

### 5.11 Stock Availability

| ID         | Requirement                                                                                                                                                                                                      |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-CRT-100 | The system shall display an out-of-stock label against any line item that is not available.                                                                                                                      |
| FR-CRT-101 | When the cart contains an out-of-stock item and the user selects Checkout, the system shall not proceed to Checkout, shall display a toast message informing the user, and shall keep the user on the Cart page. |
| FR-CRT-102 | When the cart contains an out-of-stock item and the user selects Express Checkout, the system shall apply the same behaviour as FR-CRT-101.                                                                      |
| FR-CRT-103 | The system shall continue to allow the user to remove the out-of-stock item or modify the cart.                                                                                                                  |
| FR-CRT-104 | Out-of-stock handling applies to the vfashion and vpro storefronts.                                                                                                                                              |

### 5.12 Delivery Location

| ID         | Requirement                                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-CRT-110 | For Registered Users, the Cart page shall display the current delivery address.                                                            |
| FR-CRT-111 | The user shall be able to change the delivery location by selecting from available saved addresses.                                        |
| FR-CRT-112 | Upon changing the delivery location, the system shall update the displayed delivery address and recalculate any location-dependent values. |
| FR-CRT-113 | The most recently selected delivery location shall be retained until it is changed again.                                                  |

### 5.13 Checkout

| ID         | Requirement                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-CRT-120 | The Cart page shall display a Checkout button when the cart contains items.                                                                            |
| FR-CRT-121 | When the user selects Checkout and the cart is valid, the system shall navigate the user to the Checkout page.                                         |
| FR-CRT-122 | If the user is a Guest, the system shall follow the standard sign-in or guest checkout journey configured for the storefront before reaching Checkout. |

### 5.14 Express Checkout

| ID         | Requirement                                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| FR-CRT-130 | The Cart page shall display an Express Checkout button to Registered Users when the cart contains items.                                |
| FR-CRT-131 | The Express Checkout button shall not be displayed to Guest users.                                                                      |
| FR-CRT-132 | When a Registered User selects Express Checkout and the cart is valid, the system shall navigate the user to the Express Checkout page. |

### 5.15 Other Payment Methods

| ID         | Requirement                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------------------- |
| FR-CRT-140 | The Cart page shall display an "Other payment methods" section for Registered Users when the cart contains items. |

### 5.16 Empty Cart

| ID         | Requirement                                                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-CRT-150 | When the cart has no items, the system shall display an empty cart message in place of the item list and order summary.                        |
| FR-CRT-151 | For a Registered User, the empty cart page shall display a "Continue shopping" link that navigates to the Home page.                           |
| FR-CRT-152 | For a Guest, the empty cart page shall display the empty cart message, an explanatory sub-text, a "Sign in" link and a "Browse products" link. |
| FR-CRT-153 | The "Sign in" link shall navigate the Guest to the Sign In page.                                                                               |
| FR-CRT-154 | The "Browse products" link shall navigate the user to the Home page.                                                                           |
| FR-CRT-155 | Checkout and Express Checkout actions shall not be displayed when the cart is empty.                                                           |

### 5.17 Guest Cart

| ID         | Requirement                                                                                                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-CRT-160 | A Guest shall be able to add products to, view, update and remove products from the cart without signing in.                                                                              |
| FR-CRT-161 | A guest cart shall exist only for the duration of the guest session. When the session ends (including after a registered user logs out), the guest cart shall be empty on the next visit. |
| FR-CRT-162 | Logging out shall end the registered user's session and shall not carry the user's cart contents into the subsequent guest session.                                                       |

### 5.18 Cart Merge on Login

| ID         | Requirement                                                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-CRT-170 | When a Guest with items in the cart logs in, the system shall merge the guest cart into the registered user's cart.                            |
| FR-CRT-171 | The merge shall support one or more guest line items.                                                                                          |
| FR-CRT-172 | Items already present in the registered user's cart shall be retained after the merge.                                                         |
| FR-CRT-173 | If the same product exists in both carts, the system shall combine the quantities into a single line item (for example, 1 and 1 results in 2). |
| FR-CRT-174 | If the combined quantity exceeds the Maximum Quantity Limit, the system shall set the line item quantity to the limit.                         |
| FR-CRT-175 | If the guest cart is empty at login, the registered user's cart shall remain unchanged.                                                        |
| FR-CRT-176 | After the merge, the cart count indicator and the Cart page shall reflect the merged cart.                                                     |

### 5.19 Cart Count Indicator

| ID         | Requirement                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| FR-CRT-180 | The header cart icon shall display a count indicator reflecting the number of items in the cart.      |
| FR-CRT-181 | The indicator shall update on add, update, remove and merge actions without requiring a page refresh. |
| FR-CRT-182 | The indicator shall not be displayed when the cart is empty.                                          |

### 5.20 Mini Cart (Desktop)

| ID         | Requirement                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| FR-CRT-190 | On desktop, the system shall display the Mini Cart when the user hovers over the header cart icon.                                    |
| FR-CRT-191 | The Mini Cart shall display, for each item, the product image, product name, price and quantity.                                      |
| FR-CRT-192 | The Mini Cart shall display the shipping cost, the total amount and a "View Cart" button.                                             |
| FR-CRT-193 | The Mini Cart total shall equal the sum of the item prices plus the shipping charge.                                                  |
| FR-CRT-194 | The Mini Cart shall provide a remove control for each item. Removing an item shall update the Mini Cart and the cart count indicator. |
| FR-CRT-195 | If the last item is removed, the Mini Cart shall display the empty state.                                                             |
| FR-CRT-196 | When the cart is empty, the Mini Cart shall display an empty cart message and a "Browse products" link.                               |
| FR-CRT-197 | The "Browse products" link in the Mini Cart shall navigate the user to the Home page.                                                 |
| FR-CRT-198 | The "View Cart" button shall navigate the user to the Cart page.                                                                      |
| FR-CRT-199 | The Mini Cart shall not be provided on mobile devices.                                                                                |

## 6. Business Rules

| ID     | Rule                                                                                                                                |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| BR-001 | The minimum quantity per line item is 1.                                                                                            |
| BR-002 | The maximum quantity per line item is 99, configurable per storefront.                                                              |
| BR-003 | A line item quantity shall never exceed available stock.                                                                            |
| BR-004 | Each product variant is a distinct line item.                                                                                       |
| BR-005 | Out-of-stock items shall block progression to Checkout and Express Checkout until removed or made available.                        |
| BR-006 | Express Checkout is restricted to Registered Users.                                                                                 |
| BR-007 | Guest cart items are merged into the registered user's cart on login; the registered user's items are never discarded by the merge. |
| BR-008 | A guest cart does not persist beyond the guest session.                                                                             |
| BR-009 | Automatic discounts are evaluated on every cart change and applied only while eligibility conditions are met.                       |
| BR-010 | Totals are calculated as: Subtotal − Discounts + Shipping (where applicable).                                                       |

## 7. User Interface Specifications

### 7.1 Cart Page Components

| Component                     | Guest | Registered User | Notes                               |
| ----------------------------- | ----- | --------------- | ----------------------------------- |
| Line item list                | Yes   | Yes             | Image, name, price, quantity, total |
| Quantity selector             | Yes   | Yes             | Decrease, field, increase           |
| Remove control                | Yes   | Yes             | One per line item                   |
| Promotion code                | Yes   | Yes             | Entry and apply                     |
| Order summary                 | Yes   | Yes             | Subtotal, discount, total           |
| Gift options checkbox         | Yes   | Yes             |                                     |
| Delivery address and change   | No    | Yes             |                                     |
| Checkout button               | Yes   | Yes             |                                     |
| Express Checkout button       | No    | Yes             |                                     |
| Other payment methods section | No    | Yes             |                                     |

### 7.2 Messages

Exact wording is configurable content and shall be approved by the business.

| Message Key                   | Trigger                                                         | Display Type  |
| ----------------------------- | --------------------------------------------------------------- | ------------- |
| Empty cart message            | Cart contains no items                                          | Inline        |
| Empty cart sub-text           | Guest with empty cart                                           | Inline        |
| Out-of-stock label            | Line item unavailable                                           | Inline label  |
| Out-of-stock checkout message | Checkout or Express Checkout attempted with an unavailable item | Toast         |
| Maximum quantity error        | Add to cart attempted at the Maximum Quantity Limit             | Error message |
| Invalid promotion code        | Invalid or expired code applied                                 | Inline error  |

## 8. Storefront Configuration Matrix

| Capability                         | vfashion | vpro | bepro         | getpro        |
| ---------------------------------- | -------- | ---- | ------------- | ------------- |
| Standard cart and mini cart        | Yes      | Yes  | Yes           | Yes           |
| Bundle products                    | No       | Yes  | Yes           | Yes           |
| Variant line items                 | Yes      | No   | Yes           | No            |
| Out-of-stock checkout blocking     | Yes      | Yes  | Not specified | Not specified |
| Automatic discount above threshold | No       | No   | No            | Yes           |

Cells marked "Not specified" require business confirmation (see Section 12).

## 9. Non-Functional Requirements

| ID      | Category       | Requirement                                                                                                       |
| ------- | -------------- | ----------------------------------------------------------------------------------------------------------------- |
| NFR-001 | Performance    | Cart page shall load within 3 seconds under normal load.                                                          |
| NFR-002 | Performance    | Quantity, remove and discount updates shall reflect in the UI within 2 seconds.                                   |
| NFR-003 | Availability   | The cart shall be available in line with the platform availability target.                                        |
| NFR-004 | Usability      | The Cart page shall be responsive and usable on desktop, tablet and mobile devices.                               |
| NFR-005 | Accessibility  | The Cart page shall conform to WCAG 2.1 Level AA, including keyboard operation of all controls.                   |
| NFR-006 | Security       | Cart operations shall be authorised per session; one user shall not access or alter another user's cart.          |
| NFR-007 | Data Integrity | Prices, stock and discounts shall be validated server-side; client values shall not be trusted.                   |
| NFR-008 | Compatibility  | The module shall support current versions of Chrome, Edge, Safari and Firefox, and the supported mobile browsers. |
| NFR-009 | Localisation   | Text, currency and number formats shall follow the storefront locale.                                             |

## 10. Error Handling

| Scenario                             | Expected System Behaviour                                                         |
| ------------------------------------ | --------------------------------------------------------------------------------- |
| Cart service unavailable             | Display a user-friendly error and allow retry; no partial updates shall be shown. |
| Quantity update fails                | Revert to the last valid quantity and display an error.                           |
| Stock changes while the cart is open | Reflect the latest stock status and adjust quantity to available stock.           |
| Price changes while the cart is open | Display updated price and totals on refresh or next cart action.                  |
| Session expiry                       | Treat the user as a Guest; apply guest cart rules.                                |

## 11. Data Requirements

| Data Element       | Description                                                           |
| ------------------ | --------------------------------------------------------------------- |
| Cart ID            | Unique identifier of the cart                                         |
| Customer ID        | Identifier of the registered user (absent for guests)                 |
| Line Item          | Product ID, SKU, variant attributes, quantity, unit price, line total |
| Bundle Composition | Parent product and child products                                     |
| Discounts          | Promotion code, automatic discount, amount                            |
| Delivery Location  | Selected shipping address                                             |
| Gift Option        | Selected or not selected                                              |
| Cart Totals        | Subtotal, discount, shipping, total                                   |

## 12. Open Items and Clarifications

| No. | Item                                                                                   | Owner         |
| --- | -------------------------------------------------------------------------------------- | ------------- |
| 1   | Confirm out-of-stock checkout blocking for bepro and getpro                            | Product Owner |
| 2   | Confirm variant support for vpro and getpro                                            | Product Owner |
| 3   | Confirm bundle product support for all storefronts other than vfashion                 | Product Owner |
| 4   | Confirm guest checkout journey (sign-in required or guest checkout permitted)          | Product Owner |
| 5   | Confirm promotion code rules, including stacking with automatic discounts              | Business      |
| 6   | Confirm final message wording                                                          | Content Team  |
| 7   | Confirm whether shipping is included in the Cart page summary or only in the Mini Cart | Business      |

## 13. Approvals

| Name | Role             | Signature | Date |
| ---- | ---------------- | --------- | ---- |
|      | Product Owner    |           |      |
|      | Business Analyst |           |      |
|      | Engineering Lead |           |      |
|      | QA Lead          |           |      |
