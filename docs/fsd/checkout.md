# Functional Specification Document: Checkout

**Platform:** LCS E-Commerce Storefronts (vfashion, vpro, bepro, getpro)
**Module:** Checkout (Shipping Address, Shipping Method, Gift Options, Gift Card, Order Summary)
**Version:** 1.0 (Draft for Review)

## 1. Document Control

| Attribute | Detail |
|---|---|
| Document Title | Functional Specification Document – Checkout |
| Document ID | FSD-CHK-001 |
| Version | 1.0 |
| Status | Draft for Review |
| Prepared By | Business Analysis / QA |
| Reviewed By | Product Owner, Engineering Lead |
| Approved By | Alok |
| Classification | Internal |

### 1.1 Revision History

| Version | Date | Author | Description of Change |
|---|---|---|---|
| 0.1 | 30-Oct-2026 | Business Analysis | Initial draft |
| 1.0 | 30-Oct-2026 | Business Analysis | Draft issued for review |

## 2. Introduction

### 2.1 Purpose
This document specifies the functional behaviour of the Checkout module up to the point where the customer reaches the Payment step. It is the single reference for design, development and testing, and defines what the system shall do, independent of how it is implemented.

### 2.2 Scope
**In scope**
- Entry to Checkout and Express Checkout from the cart
- Step-based checkout flow and section states
- Shipping Address (no saved address, saved addresses, change, add new)
- Shipping Method selection and confirmation
- Gift Options (gift message, sender name, email a copy)
- Gift card application and its effect on the Order Summary
- Order Summary (shipping charge, shipping method, gift card, total)
- Transition to the Payment step

**Out of scope**
- Payment method entry, payment authorisation and Place Order
- Order confirmation page
- Cart page behaviour
- Address book management outside Checkout
- Customer authentication
- Tax calculation rules

### 2.3 Intended Audience
Product Owners, Business Analysts, Solution Architects, UI/UX Designers, Developers, QA Engineers and Project Managers.

### 2.4 Definitions, Acronyms and Abbreviations

| Term | Definition |
|---|---|
| Checkout | The step-based journey in which the customer confirms delivery and order details before payment |
| Express Checkout | An accelerated checkout path available from the cart to registered users |
| Section | A step of the Checkout page: Shipping Address, Shipping Method, Gift Options, Payment |
| Expanded / Collapsed | A section is expanded when its content is open for interaction and collapsed when only its heading or summary is shown |
| Shipping Address | The address to which the order is delivered |
| Shipping Method | The delivery service and speed selected for the order |
| Shipping Method Priority | The configured ranking of shipping methods, used to select the default |
| Gift Options | Optional features to mark the order as a gift and attach a message |
| Gift Card | A stored-value code that reduces the amount payable |
| Order Summary | The panel showing the order's cost breakdown |
| Registered User | A customer who is logged in |
| Guest | A visitor who is not logged in |

### 2.5 References
- Business requirement inputs from Product and Commerce teams
- Cart FSD (FSD-CART-001)
- Shipping, address and gift card service specifications

## 3. Business Overview

### 3.1 Business Objective
Enable customers to confirm where and how their order is delivered, add gift details and apply gift cards through a clear, guided sequence, with accurate cost visibility at every step, minimising errors and abandonment before payment.

### 3.2 User Roles

| Role | Description |
|---|---|
| Registered User | Can access Checkout and Express Checkout, use saved addresses, add new addresses, select shipping methods, use gift options and apply gift cards. |
| Guest | Guest access to Checkout is not defined in this version (see Section 12). |

### 3.3 Store Variations
The module is shared across storefronts. Behaviour that differs by storefront is listed in Section 8. Unless stated otherwise, a requirement applies to all storefronts.

## 4. Assumptions, Dependencies and Constraints

### 4.1 Assumptions
- The customer arrives at Checkout with at least one item in the cart.
- Shipping methods, charges and priorities are determined by the shipping service for the selected address and cart.
- Character and line limits for the gift message are configurable values.
- All user-facing messages are configurable content.

### 4.2 Dependencies
- Cart service (cart contents and totals)
- Address and customer profile services
- Shipping service (available methods, charges, priority)
- Gift card service
- Payment module (receives the customer after the Shipping Method step)

### 4.3 Constraints
- Sections are completed in sequence: Shipping Address, Shipping Method, Payment.
- Express Checkout is available to registered users only.

## 5. Functional Requirements

Requirement IDs follow the format **FR-CHK-nnn**. The term "shall" denotes a mandatory requirement.

### 5.1 Checkout Access

| ID | Requirement |
|---|---|
| FR-CHK-001 | The system shall allow a Registered User with items in the cart to access the Checkout page using the Checkout action from the cart. |
| FR-CHK-002 | The system shall allow a Registered User with items in the cart to access the Express Checkout page using the Express Checkout action from the cart. |
| FR-CHK-003 | The Checkout page shall display the Shipping Address, Shipping Method and Payment sections and the Order Summary. |
| FR-CHK-004 | The Checkout page shall display the Gift Options section when gift options apply to the order (see Section 12). |

### 5.2 Section Flow and State

| ID | Requirement |
|---|---|
| FR-CHK-010 | The Checkout sections shall be presented as a sequence in which only the current section is expanded for interaction. |
| FR-CHK-011 | A section shall not become available until the preceding required section is completed. Until then it shall remain collapsed. |
| FR-CHK-012 | When a section is completed, the system shall display a success indicator against that section. |
| FR-CHK-013 | A completed section shall display a summary of the customer's selection and an Edit control. |
| FR-CHK-014 | When the user selects Edit on a completed section, the system shall re-expand that section with the previous selection retained and shall collapse the sections that follow it. |

### 5.3 Shipping Address – No Saved Address

| ID | Requirement |
|---|---|
| FR-CHK-020 | When a Registered User has no saved address, the Shipping Address section shall display an Add New Address button. |
| FR-CHK-021 | While no shipping address is set, the Shipping Method and Payment sections shall remain collapsed. |
| FR-CHK-022 | When the user selects Add New Address, the system shall display the New Address modal. |
| FR-CHK-023 | When the user closes the New Address modal without saving, the system shall not create or change a shipping address. The Shipping Address section shall continue to display the Add New Address button and the Shipping Method section shall remain collapsed. |

### 5.4 Shipping Address – Saved Addresses

| ID | Requirement |
|---|---|
| FR-CHK-030 | When a Registered User has saved addresses, the system shall pre-select the default saved address as the shipping address when Checkout loads. |
| FR-CHK-031 | The Shipping Address section shall display the details of the selected shipping address and a Change Address control. |
| FR-CHK-032 | When the user selects Change Address, the system shall display the list of saved addresses. |
| FR-CHK-033 | When the user selects a saved address from the list, the system shall set it as the shipping address and update the Shipping Address section with its details. |
| FR-CHK-034 | The Change Address view shall provide an Add New Address button. |
| FR-CHK-035 | When the user saves a new address from the Change Address view, the system shall add it to the saved addresses and select it automatically as the shipping address. |
| FR-CHK-036 | When the customer proceeds to Checkout from the cart, the shipping address displayed on Checkout shall be the same as the delivery address that was selected on the cart. |

### 5.5 New Address Entry

| ID | Requirement |
|---|---|
| FR-CHK-040 | The New Address modal shall capture first name, last name, street address, apartment or unit (optional), city, state or region, postal code and mobile number. |
| FR-CHK-041 | The system shall validate the address fields before saving and shall display an error against any invalid or missing mandatory field (validation rules to be confirmed, see Section 12). |
| FR-CHK-042 | When a valid address is saved, the system shall close the modal and set the address as the shipping address. |

### 5.6 Shipping Method

| ID | Requirement |
|---|---|
| FR-CHK-050 | When the user proceeds from the Shipping Address section, the system shall mark the Shipping Address section as completed, display its success indicator and expand the Shipping Method section. |
| FR-CHK-051 | The Shipping Method section shall display all shipping methods available for the selected shipping address and cart. |
| FR-CHK-052 | For each shipping method, the system shall display its name, delivery estimate (where available) and charge. |
| FR-CHK-053 | The system shall pre-select the shipping method with the highest priority. |
| FR-CHK-054 | The Shipping Method section shall display a Continue to Payment button. |
| FR-CHK-055 | The user shall be able to select a different shipping method. The selected method shall be visually highlighted. |
| FR-CHK-056 | Selecting a different shipping method shall not change the shipping charge in the Order Summary until the user selects Continue to Payment. |
| FR-CHK-057 | When the user selects Continue to Payment, the system shall mark the Shipping Method section as completed, display its success indicator, show the selected method name in the section summary and update the shipping charge in the Order Summary to the price of the selected method. |
| FR-CHK-058 | When the user selects Continue to Payment, the system shall expand the Payment section. |
| FR-CHK-059 | When the user selects Edit on the completed Shipping Method section, the system shall re-expand it with the previously selected method still selected and shall collapse the Payment section. |
| FR-CHK-060 | If no shipping method is available for the selected shipping address, the system shall display a message stating that no shipping methods are available and shall not display the Continue to Payment button. |
| FR-CHK-061 | The Order Summary shall display the selected shipping method (see Section 12 for timing). |

### 5.7 Gift Options

| ID | Requirement |
|---|---|
| FR-CHK-070 | When gift options apply, the Checkout page shall display a Gift Options section, collapsed by default. |
| FR-CHK-071 | The user shall be able to expand the Gift Options section. |
| FR-CHK-072 | The expanded Gift Options section shall display a gift option checkbox. |
| FR-CHK-073 | When the user selects the gift option checkbox, the system shall display the gift message section containing a gift message field, a gift from field, an email a copy checkbox and a recipient email field. |
| FR-CHK-074 | The gift message field shall be pre-filled with the configured default gift message and the gift from field shall be pre-filled with the configured default sender value. |
| FR-CHK-075 | When the user clears the gift option checkbox, the system shall hide the gift message section. |
| FR-CHK-076 | The gift message shall accept a message within the configured character limit and line limit. |
| FR-CHK-077 | If the gift message exceeds the character limit, the system shall display a character limit validation message. |
| FR-CHK-078 | If the gift message exceeds the line limit, the system shall display a line limit validation message. |
| FR-CHK-079 | If the gift message field is empty, the system shall display a validation message indicating that the message is required. |
| FR-CHK-080 | If the gift from field is empty, the system shall display a validation message indicating that the sender name is required. |
| FR-CHK-081 | While any gift option validation error is present, the system shall not allow the user to proceed to the Shipping Method section. |
| FR-CHK-082 | When the gift message and gift from values are valid, the system shall allow the user to proceed to the Shipping Method section. |
| FR-CHK-083 | The recipient email field shall be disabled until the email a copy checkbox is selected, and enabled when it is selected. |
| FR-CHK-084 | If the recipient email is not a valid email address, the system shall display an invalid email validation message. |

### 5.8 Gift Card

| ID | Requirement |
|---|---|
| FR-CHK-090 | The Payment step shall allow the user to enter and apply a gift card code (storefronts per Section 8). |
| FR-CHK-091 | When a valid gift card code is applied, the system shall display the applied gift card in the Order Summary. |
| FR-CHK-092 | When a valid gift card is applied, the Order Summary total shall be reduced by the gift card amount. |
| FR-CHK-093 | Where the gift card value is less than the order total, the remaining balance shall be payable using another payment method. |

### 5.9 Order Summary

| ID | Requirement |
|---|---|
| FR-CHK-100 | The Order Summary shall be displayed throughout Checkout. |
| FR-CHK-101 | The Order Summary shall display the subtotal, the shipping method and charge, any applied gift card, and the order total. |
| FR-CHK-102 | The Order Summary total shall equal the subtotal plus shipping charge (and any applicable taxes) minus any applied gift card amount. |
| FR-CHK-103 | The Order Summary shall update when the shipping method is confirmed, a gift card is applied or the shipping address changes in a way that affects the charge. |
| FR-CHK-104 | All monetary values shall be displayed in the storefront currency using the standard currency format. |

## 6. Business Rules

| ID | Rule |
|---|---|
| BR-001 | A shipping address must be set before the Shipping Method section becomes available. |
| BR-002 | A shipping method must be confirmed before the Payment section becomes available. |
| BR-003 | If a saved address exists, the default saved address is pre-selected. |
| BR-004 | A newly added address from Checkout is selected automatically. |
| BR-005 | The shipping method with the highest priority is selected by default. |
| BR-006 | The shipping charge in the Order Summary reflects the method confirmed with Continue to Payment, not a method that is only highlighted. |
| BR-007 | Editing an earlier section collapses all later sections. |
| BR-008 | Gift message and sender name are mandatory when the gift option is selected. |
| BR-009 | Gift message length is restricted by the configured character and line limits. |
| BR-010 | Recipient email is required to be a valid email address only when email a copy is selected. |
| BR-011 | Order total = Subtotal + Shipping + Taxes − Gift card amount. |
| BR-012 | Closing the New Address modal without saving makes no change to the shipping address. |

## 7. User Interface Specifications

### 7.1 Checkout Sections

| Section | Initial State | Becomes Available When | Completed Indicator |
|---|---|---|---|
| Shipping Address | Expanded | On load | Success indicator and address summary |
| Gift Options | Collapsed | On load (where applicable) | Not applicable |
| Shipping Method | Collapsed | Shipping address set | Success indicator and method name |
| Payment | Collapsed | Shipping method confirmed | Out of scope |

### 7.2 Messages

Exact wording is configurable content and shall be approved by the business.

| Message Key | Trigger | Display Type |
|---|---|---|
| No shipping methods available | No method available for the address | Inline |
| Character limit exceeded | Gift message longer than the character limit | Inline validation |
| Line limit exceeded | Gift message has more lines than the line limit | Inline validation |
| Gift message required | Gift message empty | Inline validation |
| Gift from required | Gift from empty | Inline validation |
| Invalid recipient email | Recipient email invalid | Inline validation |
| Default gift message | Gift option selected | Pre-filled content |

## 8. Storefront Configuration Matrix

| Capability | vfashion | vpro | bepro | getpro |
|---|---|---|---|---|
| Checkout and Express Checkout | Yes | Yes | Yes | Yes |
| Shipping Address and Shipping Method flow | Yes | Yes | Yes | Yes |
| Gift Options | Yes | Yes | Yes | Yes |
| Gift card in Order Summary | Yes | Yes | Not specified | Not specified |

Cells marked "Not specified" require business confirmation (see Section 12).

## 9. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-001 | Performance | The Checkout page shall load within 3 seconds under normal load. |
| NFR-002 | Performance | Shipping methods shall be displayed within 3 seconds of the shipping address being set. |
| NFR-003 | Usability | Checkout shall be responsive and usable on desktop, tablet and mobile devices. |
| NFR-004 | Accessibility | Checkout shall conform to WCAG 2.1 Level AA, including keyboard operation and clear association of validation messages with fields. |
| NFR-005 | Security | Checkout shall be accessible only to the authenticated owner of the cart, and customer address data shall be transmitted over secure channels. |
| NFR-006 | Data Integrity | Shipping charges, discounts and totals shall be calculated server-side; client values shall not be trusted. |
| NFR-007 | Compatibility | The module shall support current versions of Chrome, Edge, Safari and Firefox, and the supported mobile browsers. |
| NFR-008 | Localisation | Text, currency, number and address formats shall follow the storefront locale. |

## 10. Error Handling

| Scenario | Expected System Behaviour |
|---|---|
| Shipping service unavailable | Display a user-friendly error and allow retry; do not allow progress to Payment. |
| Address save fails | Keep the modal open, display an error and retain the entered values. |
| Gift card service unavailable | Display an error; the Order Summary remains unchanged. |
| Cart changes while Checkout is open | Reflect the latest cart contents and totals. |
| Session expiry | Redirect the user to sign in and return to Checkout after authentication. |

## 11. Data Requirements

| Data Element | Description |
|---|---|
| Cart | Items, quantities, subtotal |
| Customer | Customer ID, saved addresses, default address |
| Shipping Address | First name, last name, street, apartment or unit, city, state or region, postal code, mobile number |
| Shipping Method | Method ID, name, delivery estimate, charge, priority |
| Gift Options | Gift selected indicator, gift message, gift from, email a copy indicator, recipient email |
| Gift Card | Gift card code, applied amount |
| Order Summary | Subtotal, shipping charge, shipping method, gift card amount, taxes, total |

## 12. Open Items and Clarifications

| No. | Item | Owner |
|---|---|---|
| 1 | Confirm the condition under which the Gift Options section is displayed (for example, only when gift option was chosen on the cart) | Product Owner |
| 2 | Confirm the gift message character limit and line limit values | Product Owner |
| 3 | Confirm the default gift message and default gift from values | Product Owner |
| 4 | Confirm whether the shipping method name in the Order Summary updates on selection or only on Continue to Payment | Product Owner |
| 5 | Confirm address field validation rules (mandatory fields, formats, supported countries and regions) | Product Owner |
| 6 | Confirm the message and behaviour when no shipping method is available, and which addresses trigger it | Product Owner |
| 7 | Confirm gift card behaviour for invalid, expired or insufficient-balance codes, and removal of an applied gift card | Product Owner |
| 8 | Confirm gift card availability for bepro and getpro | Product Owner |
| 9 | Confirm guest user access to Checkout (sign-in required or guest checkout permitted) | Product Owner |
| 10 | Confirm how Express Checkout differs from Checkout in the sections displayed and their initial state | Product Owner |
| 11 | Confirm whether Gift Options must be valid before the user can continue from the Shipping Address section, or only before Continue to Payment | Product Owner |
| 12 | Confirm the final message wording | Content Team |

## 13. Approvals

| Name | Role | Signature | Date |
|---|---|---|---|
| | Product Owner | | |
| | Business Analyst | | |
| | Engineering Lead | | |
| | QA Lead | | |