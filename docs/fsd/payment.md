# Functional Specification Document: Payment

**Platform:** LCS E-Commerce Storefronts (vfashion, vpro, bepro, getpro)
**Module:** Payment Method Selection, Payment Authorisation and Gift Card Redemption
**Version:** 1.0 (Draft for Review)

## 1. Document Control

| Attribute      | Detail                                      |
| -------------- | ------------------------------------------- |
| Document Title | Functional Specification Document – Payment |
| Document ID    | FSD-PAY-001                                 |
| Version        | 1.0                                         |
| Status         | Approved                                    |
| Prepared By    | Business Analysis / QA                      |
| Reviewed By    | Product Owner, Engineering Lead             |
| Approved By    | Alok                                        |
| Classification | Internal                                    |

### 1.1 Revision History

| Version | Date        | Author            | Description of Change   |
| ------- | ----------- | ----------------- | ----------------------- |
| 0.1     | 30-Oct-2026 | Business Analysis | Initial draft           |
| 1.0     | 30-Oct-2026 | Business Analysis | Draft issued for review |

## 2. Introduction

### 2.1 Purpose

This document specifies the functional behaviour of the Payment step of Checkout: the available payment methods, payment authorisation, gift card redemption, split payment and the conditions under which an order can be placed. It is the single reference for design, development and testing, and defines what the system shall do, independent of how it is implemented.

### 2.2 Scope

**In scope**

- Payment section and payment method list
- Default payment method selection
- Payment authorisation for vStripe, PayPal, PayFort, Checkout.com (card, Apple Pay, Google Pay) and Cash on Delivery
- Card field validation for card-based methods
- Handling of declined payments
- Gift card application, validation and removal
- Split payment (gift card plus another payment method)
- Place Order availability rules
- Payment access for Registered Users and Guests

**Out of scope**

- Shipping Address, Shipping Method and Gift Options (see Checkout FSD, FSD-CHK-001)
- Order confirmation page and post-order communications
- Refunds, cancellations and settlement
- Payment provider back-office configuration
- Tax calculation rules

### 2.3 Intended Audience

Product Owners, Business Analysts, Solution Architects, UI/UX Designers, Developers, QA Engineers and Project Managers.

### 2.4 Definitions, Acronyms and Abbreviations

| Term                   | Definition                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Payment Method         | A means of paying for the order (for example card, PayPal, Cash on Delivery)                                       |
| vStripe                | The platform's card payment integration using Stripe                                                               |
| PayFort                | A card payment integration (Amazon Payment Services)                                                               |
| Checkout.com           | A payment provider offering card, Apple Pay and Google Pay                                                         |
| Cash on Delivery (COD) | Payment collected by the carrier at delivery                                                                       |
| Payment Authorisation  | Confirmation from the payment provider that the payment details are accepted, completed before the order is placed |
| Place Order            | The action that creates the order                                                                                  |
| Gift Card              | A stored-value code that reduces the amount payable                                                                |
| Split Payment          | Payment of one order using a gift card and another payment method                                                  |
| Remaining Balance      | The order total minus the gift card amount applied                                                                 |
| Order Summary          | The panel showing the order's cost breakdown                                                                       |
| Registered User        | A customer who is logged in                                                                                        |
| Guest                  | A visitor who is not logged in                                                                                     |
| Express Checkout       | An accelerated checkout path for registered users                                                                  |

### 2.5 References

- Business requirement inputs from Product and Commerce teams
- Checkout FSD (FSD-CHK-001) and Cart FSD (FSD-CART-001)
- Payment provider integration specifications and sandbox documentation

## 3. Business Overview

### 3.1 Business Objective

Enable customers to pay securely using their preferred method, including gift cards and combined payment, with clear feedback on every outcome, while ensuring that an order can be placed only when payment is valid.

### 3.2 User Roles

| Role            | Description                                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| Registered User | Can pay using any available method and can apply gift cards.                                                     |
| Guest           | Can reach the Payment step through the guest checkout journey, pay using available methods and apply gift cards. |

### 3.3 Store Variations

The module is shared across storefronts. The payment methods and features available differ by storefront and are listed in Section 8. Unless stated otherwise, a requirement applies to all storefronts on which the method or feature is available.

## 4. Assumptions, Dependencies and Constraints

### 4.1 Assumptions

- The customer reaches the Payment step with a valid shipping address and a confirmed shipping method.
- Payment provider sandbox or production credentials are configured per storefront.
- Card details are entered into provider-hosted fields and are not stored by the platform.
- All user-facing messages are configurable content.

### 4.2 Dependencies

- Payment provider services (vStripe, PayPal, PayFort, Checkout.com, Apple Pay, Google Pay)
- Gift card service
- Order management service (order creation)
- Checkout module (shipping address, shipping method, Order Summary)

### 4.3 Constraints

- An order cannot be placed until payment is authorised or the order total is fully covered.
- Apple Pay and Google Pay depend on device, browser and wallet availability.
- Gift cards and Checkout.com are available only on the storefronts listed in Section 8.

## 5. Functional Requirements

Requirement IDs follow the format **FR-PAY-nnn**. The term "shall" denotes a mandatory requirement.

### 5.1 Payment Section Access

| ID         | Requirement                                                                                                                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-PAY-001 | The system shall display the Payment section after the customer confirms the shipping method.                                                                                                                     |
| FR-PAY-002 | A Registered User using Express Checkout shall be presented with the Payment section on the Express Checkout page.                                                                                                |
| FR-PAY-003 | A Guest shall be able to reach the Payment section by completing contact information, continuing as guest, entering and saving a shipping address, selecting a shipping method and selecting Continue to Payment. |
| FR-PAY-004 | The Payment section shall display the available payment methods for the storefront.                                                                                                                               |
| FR-PAY-005 | The Payment section shall display the Order Summary, including the order total.                                                                                                                                   |

### 5.2 Payment Method List and Default

| ID         | Requirement                                                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| FR-PAY-010 | The system shall display the payment methods configured for the storefront, as listed in Section 8.                                      |
| FR-PAY-011 | The system shall preselect vStripe as the default payment method.                                                                        |
| FR-PAY-012 | The user shall be able to select a different payment method, and the interface for the selected method shall be displayed.               |
| FR-PAY-013 | Only one payment method interface shall be active at a time (apart from a gift card, which may be combined as described in Section 5.9). |

### 5.3 Place Order Rules

| ID         | Requirement                                                                                                                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-PAY-020 | The Place Order button in the Order Summary shall be disabled until the payment has been authorised.                                                                                                |
| FR-PAY-021 | When payment authorisation succeeds, the system shall display a payment success message instructing the user to select Place Order, and shall enable the Place Order button.                        |
| FR-PAY-022 | When card details are invalid or payment authorisation fails, the Place Order button shall remain disabled.                                                                                         |
| FR-PAY-023 | When an order total is fully covered by gift cards, the Place Order button shall be enabled without further payment authorisation.                                                                  |
| FR-PAY-024 | When the user selects Place Order and the payment provider declines the payment at order creation, the system shall not create the order and shall display an order creation failure toast message. |
| FR-PAY-025 | Cash on Delivery shall use its own Place Order button, governed by Section 5.7.                                                                                                                     |

### 5.4 vStripe Card Payment

| ID         | Requirement                                                                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-PAY-030 | The vStripe interface shall capture the card holder name, card number, expiry date (month and year) and CVV, and shall provide a Pay Now button.                                  |
| FR-PAY-031 | When the user enters a valid card number, expiry and CVV and a card holder name and selects Pay Now, the system shall authorise the payment and apply FR-PAY-021.                 |
| FR-PAY-032 | When the user enters an invalid card number, an invalid expiry or an invalid CVV, the system shall display a field-level error for each invalid field.                            |
| FR-PAY-033 | When the user selects Pay Now with an invalid or missing card holder name, the system shall display a card holder error.                                                          |
| FR-PAY-034 | When the user selects Pay Now with one or more empty fields, the system shall display a required-field error against each empty field (card number, card holder, expiry and CVV). |
| FR-PAY-035 | While any vStripe validation error is present, the Place Order button shall remain disabled.                                                                                      |
| FR-PAY-036 | When a card is accepted at authorisation but declined at order creation (for example a generic decline or insufficient balance), the system shall apply FR-PAY-024.               |

### 5.5 PayPal

| ID         | Requirement                                                                                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-PAY-040 | When the user selects PayPal, the system shall present the PayPal authorisation journey.                                                                                      |
| FR-PAY-041 | When the user approves the payment in PayPal, the system shall return the user to the Payment section, display the payment success message and enable the Place Order button. |
| FR-PAY-042 | If the user cancels or does not complete the PayPal journey, the Place Order button shall remain disabled.                                                                    |

### 5.6 PayFort Card Payment

| ID         | Requirement                                                                                                                                                                |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-PAY-050 | The PayFort interface shall capture the card number, card holder name, expiry date and CVV, and shall provide a Pay Now button.                                            |
| FR-PAY-051 | When the user selects Pay Now with invalid card details, the system shall display a field-level error for the card number, card holder name, expiry and CVV as applicable. |
| FR-PAY-052 | While any PayFort validation error is present, the Place Order button shall remain disabled.                                                                               |
| FR-PAY-053 | When valid card details are submitted, the system shall authorise the payment and apply FR-PAY-021.                                                                        |

### 5.7 Cash on Delivery

| ID         | Requirement                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| FR-PAY-060 | When the user selects Cash on Delivery, the system shall display the COD terms agreement checkbox and a COD Place Order button. |
| FR-PAY-061 | The COD Place Order button shall be disabled until the agreement checkbox is selected.                                          |
| FR-PAY-062 | When the user selects the agreement checkbox, the COD Place Order button shall be enabled.                                      |
| FR-PAY-063 | When the user clears the agreement checkbox, the COD Place Order button shall be disabled again.                                |

### 5.8 Checkout.com

| ID         | Requirement                                                                                                                                                                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-PAY-070 | When the user selects Checkout.com, the system shall display the supported payment options: Card, Apple Pay and Google Pay.                                                                                                                   |
| FR-PAY-071 | Card shall be the option selected by default.                                                                                                                                                                                                 |
| FR-PAY-072 | On selecting Checkout.com, the Place Order button shall remain disabled until payment is authorised.                                                                                                                                          |
| FR-PAY-073 | The Card option shall capture the card details and provide a Pay button, and shall accept Visa, Mastercard and American Express cards.                                                                                                        |
| FR-PAY-074 | When valid card details are submitted, the system shall authorise the payment and apply FR-PAY-021.                                                                                                                                           |
| FR-PAY-075 | When the user enters an invalid card number, expiry date or CVV and selects Pay, the system shall display an error against each invalid field and keep the Place Order button disabled.                                                       |
| FR-PAY-076 | When the user selects Pay with empty card fields, the system shall display a required-field error and keep the Place Order button disabled.                                                                                                   |
| FR-PAY-077 | When Checkout.com declines the payment (for example a generic decline or insufficient funds), the system shall display the corresponding payment error message and keep the Place Order button disabled.                                      |
| FR-PAY-078 | When the user selects Apple Pay and Apple Pay is available on the device and browser, the option shall be selected and the Apple Pay button shall be displayed. The Place Order button shall remain disabled until the payment is authorised. |
| FR-PAY-079 | When the user selects Google Pay and Google Pay is available, the option shall be selected and the Google Pay button shall be displayed. The Place Order button shall remain disabled until the payment is authorised.                        |
| FR-PAY-080 | A Guest shall be able to authorise payment using Checkout.com card payment.                                                                                                                                                                   |

### 5.9 Gift Cards

| ID         | Requirement                                                                                                                                                                                                                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-PAY-090 | The Payment section shall allow the user to enter and apply a gift card code.                                                                                                                                                                                                                              |
| FR-PAY-091 | When a valid gift card code is applied, the system shall display the gift card in the Payment section and in the Order Summary.                                                                                                                                                                            |
| FR-PAY-092 | When the gift card value covers the entire order total, the system shall set the order total to zero and enable the Place Order button.                                                                                                                                                                    |
| FR-PAY-093 | When the gift card value is less than the order total, the system shall reduce the amount payable by the gift card value, display the remaining balance in the Order Summary and keep the Place Order button disabled until the remaining balance is paid using another payment method (see Section 5.10). |
| FR-PAY-094 | If the gift card has zero value, has expired or is inactive, the system shall display the gift card no longer valid message and shall not apply the gift card.                                                                                                                                             |
| FR-PAY-095 | If the user applies a gift card that is already applied to the order, the system shall display the gift card already applied message and shall not apply it twice.                                                                                                                                         |
| FR-PAY-096 | The system shall allow more than one gift card to be applied to the same order (see Section 12 for the limit). Each applied gift card shall be displayed.                                                                                                                                                  |
| FR-PAY-097 | The user shall be able to remove an applied gift card. On removal, the gift card shall no longer be displayed in the Payment section or the Order Summary and the order total shall be recalculated.                                                                                                       |
| FR-PAY-098 | Gift cards shall be available to both Registered Users and Guests.                                                                                                                                                                                                                                         |

### 5.10 Split Payment

| ID         | Requirement                                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| FR-PAY-100 | When a gift card partly covers the order total, the user shall be able to pay the remaining balance using an available payment method. |
| FR-PAY-101 | After the remaining balance is authorised, the system shall display the payment success message and enable the Place Order button.     |
| FR-PAY-102 | Split payment shall be supported with vStripe and Checkout.com.                                                                        |

### 5.11 Order Summary Behaviour

| ID         | Requirement                                                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-PAY-110 | The Order Summary shall display each applied gift card and the remaining balance (where the gift card does not cover the total).               |
| FR-PAY-111 | The Order Summary total shall equal subtotal plus shipping charge and taxes, minus applied gift card amounts, and shall not be less than zero. |
| FR-PAY-112 | The Order Summary shall update immediately when a gift card is applied or removed.                                                             |

## 6. Business Rules

| ID     | Rule                                                                                                            |
| ------ | --------------------------------------------------------------------------------------------------------------- |
| BR-001 | An order can be placed only when payment is authorised or the order total is fully covered by gift cards.       |
| BR-002 | vStripe is the default payment method.                                                                          |
| BR-003 | Card field validation errors always keep the Place Order button disabled.                                       |
| BR-004 | A gift card with zero value, an expired gift card or an inactive gift card cannot be applied.                   |
| BR-005 | The same gift card cannot be applied more than once to an order.                                                |
| BR-006 | Where a gift card does not cover the order total, the remaining balance must be paid by another payment method. |
| BR-007 | The order total after gift cards cannot be less than zero.                                                      |
| BR-008 | Cash on Delivery requires agreement to the COD terms before the order can be placed.                            |
| BR-009 | A payment declined by the provider shall never result in an order being created.                                |
| BR-010 | Card details are captured only in provider-hosted fields and are not stored by the platform.                    |

## 7. User Interface Specifications

### 7.1 Payment Section Components

| Component                                          | Applies To       | Notes                                      |
| -------------------------------------------------- | ---------------- | ------------------------------------------ |
| Payment method list                                | All              | vStripe selected by default                |
| vStripe card fields and Pay Now                    | vStripe          | Card holder, number, expiry, CVV           |
| PayPal button                                      | PayPal           | Opens PayPal journey                       |
| PayFort card fields and Pay Now                    | PayFort          | Card number, holder, expiry, CVV           |
| COD agreement checkbox and COD Place Order         | Cash on Delivery | Own Place Order button                     |
| Checkout.com options (Card, Apple Pay, Google Pay) | Checkout.com     | Card selected by default                   |
| Gift card entry                                    | vfashion, vpro   | Multiple cards supported                   |
| Applied gift cards and Remove control              | vfashion, vpro   | Shown in Payment section and Order Summary |
| Order Summary with Place Order button              | All              | Place Order governed by Section 5.3        |

### 7.2 Messages

Exact wording is configurable content and shall be approved by the business.

| Message Key                                    | Trigger                                   | Display Type      |
| ---------------------------------------------- | ----------------------------------------- | ----------------- |
| Payment success (click Place Order to proceed) | Payment authorised                        | Inline            |
| Card number error                              | Invalid card number                       | Inline validation |
| Expiry error                                   | Invalid expiry date                       | Inline validation |
| CVV error                                      | Invalid CVV                               | Inline validation |
| Card holder error                              | Invalid card holder name                  | Inline validation |
| Required field errors                          | Empty card fields on Pay                  | Inline validation |
| Gift card no longer valid                      | Zero value, expired or inactive gift card | Inline error      |
| Gift card already applied                      | Same gift card applied twice              | Inline error      |
| Order creation failed                          | Payment declined at Place Order           | Toast             |
| Checkout.com payment declined                  | Generic decline                           | Inline error      |
| Checkout.com insufficient funds                | Insufficient funds decline                | Inline error      |

## 8. Storefront Configuration Matrix

| Capability                                     | vfashion | vpro           | bepro         | getpro        |
| ---------------------------------------------- | -------- | -------------- | ------------- | ------------- |
| vStripe                                        | Yes      | Yes            | Not specified | Not specified |
| PayPal                                         | Yes      | Yes            | Not specified | Not specified |
| PayFort                                        | Yes      | Yes            | Not specified | Not specified |
| Cash on Delivery                               | Yes      | Yes            | Not specified | Not specified |
| Checkout.com (Card, Apple Pay, Google Pay)     | Yes      | No             | Not specified | Not specified |
| Gift cards and split payment                   | Yes      | Yes            | Not specified | Not specified |
| Guest gift card and guest Checkout.com payment | Yes      | Gift card only | Not specified | Not specified |

Cells marked "Not specified" require business confirmation (see Section 12).

## 9. Non-Functional Requirements

| ID      | Category       | Requirement                                                                                                                                        |
| ------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-001 | Performance    | Payment authorisation shall return a result to the user within 10 seconds under normal provider response times.                                    |
| NFR-002 | Performance    | Applying or removing a gift card shall update the Order Summary within 2 seconds.                                                                  |
| NFR-003 | Security       | Card data shall be captured only by provider-hosted fields and transmitted over secure channels. The platform shall not store card numbers or CVV. |
| NFR-004 | Security       | Payment and gift card operations shall be authorised per session; one user shall not use another user's payment state.                             |
| NFR-005 | Data Integrity | Gift card validity, balances and order totals shall be validated server-side.                                                                      |
| NFR-006 | Reliability    | A payment shall not be captured more than once for a single order.                                                                                 |
| NFR-007 | Usability      | The Payment section shall be responsive and usable on desktop, tablet and mobile devices.                                                          |
| NFR-008 | Accessibility  | The Payment section shall conform to WCAG 2.1 Level AA, including keyboard operation and clear association of errors with fields.                  |
| NFR-009 | Compatibility  | The module shall support current versions of Chrome, Edge, Safari and Firefox, and the supported mobile browsers.                                  |
| NFR-010 | Localisation   | Text, currency and number formats shall follow the storefront locale.                                                                              |

## 10. Error Handling

| Scenario                                                   | Expected System Behaviour                                                                                               |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Payment provider unavailable                               | Display a user-friendly error, keep Place Order disabled and allow retry.                                               |
| Payment declined at authorisation                          | Display the provider-mapped error message and keep Place Order disabled.                                                |
| Payment declined at order creation                         | Do not create the order, display the order creation failure toast and allow the user to retry or change payment method. |
| Gift card service unavailable                              | Display an error; the Order Summary remains unchanged.                                                                  |
| Session expiry during payment                              | Preserve the cart, require sign-in or restart of guest checkout, and do not create an order.                            |
| Browser or device does not support Apple Pay or Google Pay | Do not offer the unavailable option as selectable.                                                                      |

## 11. Data Requirements

| Data Element          | Description                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| Payment Method        | Method identifier, availability by storefront                          |
| Card Details          | Card holder name, number, expiry, CVV (provider-hosted, not stored)    |
| Payment Authorisation | Authorisation status, provider reference                               |
| Gift Card             | Code, status (active, inactive, expired), value, applied amount        |
| Order Summary         | Subtotal, shipping, taxes, gift card amounts, remaining balance, total |
| COD Agreement         | Agreement indicator                                                    |
| Order                 | Order ID, payment method(s), payment status                            |

## 12. Open Items and Clarifications

| No. | Item                                                                                                                  | Owner         |
| --- | --------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1   | Confirm payment methods and gift card availability for bepro and getpro                                               | Product Owner |
| 2   | Confirm whether Checkout.com is intended for vpro                                                                     | Product Owner |
| 3   | Confirm Guest access to the Payment step, aligning with the Checkout FSD open item on guest checkout                  | Product Owner |
| 4   | Confirm the maximum number of gift cards per order and the order in which balances are consumed                       | Product Owner |
| 5   | Confirm whether payment methods remain selectable when a gift card covers the full order total                        | Product Owner |
| 6   | Confirm the PayPal journey details (cancellation, timeout and failure handling)                                       | Product Owner |
| 7   | Confirm card validation rules (accepted card brands per provider, expiry in the past, CVV length, card holder format) | Product Owner |
| 8   | Confirm whether additional customer authentication (for example 3-D Secure) applies and its outcomes                  | Product Owner |
| 9   | Confirm behaviour when the user changes payment method after authorisation (is authorisation retained or reset)       | Product Owner |
| 10  | Confirm retry behaviour after a payment decline, including any attempt limit                                          | Product Owner |
| 11  | Confirm Cash on Delivery eligibility rules and any fee or order value limits                                          | Product Owner |
| 12  | Confirm whether split payment is supported with PayPal, PayFort and Cash on Delivery                                  | Product Owner |
| 13  | Confirm Apple Pay and Google Pay supported devices and browsers                                                       | Product Owner |
| 14  | Confirm final message wording                                                                                         | Content Team  |

## 13. Approvals

| Name | Role             | Signature | Date |
| ---- | ---------------- | --------- | ---- |
|      | Product Owner    |           |      |
|      | Business Analyst |           |      |
|      | Engineering Lead |           |      |
|      | QA Lead          |           |      |
