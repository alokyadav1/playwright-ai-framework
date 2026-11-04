# Payment Test Cases

**Source:** docs/fsd/payment.md (FSD-PAY-001 v1.0, Status: Approved, Date: 30-Oct-2026)  
**Generated:** 2026-10-30  
**Module:** Payment Method Selection, Payment Authorisation and Gift Card Redemption  
**ID convention:** TC-PAY-nnn  

> Severity uses the explicit project default: **Major** unless a different severity is noted.  
> Storefront scope is stated per case. When not stated, the case applies to **vfashion and vpro** (the storefronts with a fully specified payment configuration per Section 8).  
> bepro and getpro payment method availability is **Not specified** and is excluded from ready cases (see Ambiguity Register).  
> Message copy is configurable; assertions use message-key names, not literal strings.  
> Checkout.com is **not available on vpro** (Section 8). Checkout.com cases are scoped to **vfashion only**.  

---

## Table of Contents

1. [Payment Section Access](#1-payment-section-access)
2. [Payment Method List and Default](#2-payment-method-list-and-default)
3. [Place Order Rules](#3-place-order-rules)
4. [vStripe Card Payment](#4-vstripe-card-payment)
5. [PayPal](#5-paypal)
6. [PayFort Card Payment](#6-payfort-card-payment)
7. [Cash on Delivery](#7-cash-on-delivery)
8. [Checkout.com](#8-checkoutcom)
9. [Gift Cards](#9-gift-cards)
10. [Split Payment](#10-split-payment)
11. [Order Summary Behaviour](#11-order-summary-behaviour)
12. [Error Handling](#12-error-handling)
13. [Non-Functional Requirements and Test-Layer Allocations](#13-non-functional-requirements-and-test-layer-allocations)
14. [Ambiguity Register](#14-ambiguity-register)
15. [Traceability Matrix](#15-traceability-matrix)

---

## 1. Payment Section Access

### TC-PAY-001 — Payment section is displayed after shipping method confirmation (Registered User)

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-001 |
| **Preconditions** | Registered User is logged in, has items in cart, has confirmed a shipping address and selected a shipping method. |
| **Required data keys** | `user.registered` |

**Actions**
1. Complete checkout up to and including shipping method selection.
2. Confirm the shipping method.

**Expected outcomes**
- The Payment section is displayed on the checkout page.
- Available payment methods for the storefront are listed.

---

### TC-PAY-002 — Payment section is displayed on Express Checkout page (Registered User)

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-002 |
| **Preconditions** | Registered User is logged in and proceeds via the Express Checkout path. |
| **Required data keys** | `user.registered` |

**Actions**
1. Log in as a Registered User.
2. Initiate Express Checkout.

**Expected outcomes**
- The Payment section is presented on the Express Checkout page.

---

### TC-PAY-003 — Guest reaches Payment section through full guest checkout journey

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-003 |
| **Preconditions** | User is not logged in. Cart contains at least one in-stock product. |
| **Required data keys** | `user.saved_address` (or a synthetic shipping address) |
| **Blocked by** | AQ-003 — Guest checkout availability on each storefront must be confirmed. |

**Actions**
1. Proceed to checkout as a Guest.
2. Enter contact information and continue as Guest.
3. Enter a shipping address and save it.
4. Select a shipping method.
5. Select **Continue to Payment**.

**Expected outcomes**
- The Payment section is displayed.
- Available payment methods for the storefront are listed.

---

### TC-PAY-004 — Payment section displays available payment methods for storefront

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-004, Section 8 |
| **Preconditions** | User (Registered or Guest) has reached the Payment section. |

**Actions**
1. Observe the payment method list on the Payment section.

**Expected outcomes**
- **vpro:** vStripe, PayPal, PayFort, Cash on Delivery, Gift Card entry are displayed.
- **vfashion:** vStripe, PayPal, PayFort, Cash on Delivery, Checkout.com, Gift Card entry are displayed.
- No unlisted payment methods are shown.

---

### TC-PAY-005 — Order Summary is displayed on the Payment section

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-005 |
| **Preconditions** | User has reached the Payment section with at least one item in the cart. |

**Actions**
1. Observe the Payment section layout.

**Expected outcomes**
- The Order Summary panel is visible, including the order total.

---

## 2. Payment Method List and Default

### TC-PAY-010 — vStripe is preselected as default payment method

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-011, BR-002 |
| **Preconditions** | User has reached the Payment section. |

**Actions**
1. Observe the payment method list on arrival at the Payment section.

**Expected outcomes**
- vStripe is selected by default and its card input fields are displayed.
- No other payment method interface is active.

---

### TC-PAY-011 — User can switch payment method and its interface is shown

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-012, FR-PAY-013 |
| **Preconditions** | User is on the Payment section. vStripe is the default selected method. |

**Actions**
1. Select PayPal from the payment method list.

**Expected outcomes**
- The PayPal interface is displayed.
- The vStripe interface is no longer active.

---

### TC-PAY-012 — Only one payment method interface is active at a time

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-013 |
| **Preconditions** | User is on the Payment section. |

**Actions**
1. Select PayPal from the payment method list.
2. Select PayFort from the payment method list.

**Expected outcomes**
- The PayFort interface is displayed.
- The PayPal interface is no longer active.
- Only one non-gift-card payment method interface is visible at a time.

---

## 3. Place Order Rules

### TC-PAY-020 — Place Order button is disabled before payment authorisation

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-020, BR-001 |
| **Preconditions** | User has reached the Payment section. No payment has been authorised. |

**Actions**
1. Observe the Place Order button in the Order Summary without entering or authorising any payment.

**Expected outcomes**
- The Place Order button is disabled.

---

### TC-PAY-021 — Place Order button is enabled after successful payment authorisation

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-021, BR-001 |
| **Preconditions** | User has reached the Payment section. vStripe is selected. |
| **Required data keys** | `vStripeData.cardHolderName`, `vStripeData.cardNumber`, `vStripeData.expiry`, `vStripeData.cvv` |

**Actions**
1. Enter valid card holder name, card number, expiry and CVV into the vStripe fields.
2. Select **Pay Now**.

**Expected outcomes**
- A payment success message (`messages.payment_success`) is displayed instructing the user to select Place Order.
- The Place Order button is enabled.

---

### TC-PAY-022 — Place Order button remains disabled after card validation failure

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-022, FR-PAY-035, BR-003 |
| **Preconditions** | User is on the Payment section. vStripe is selected. |
| **Required data keys** | `vStripeData.invalidCardNumber` |

**Actions**
1. Enter an invalid card number, a valid expiry, valid CVV and a valid card holder name.
2. Select **Pay Now**.

**Expected outcomes**
- A card number error (`messages.payment_card_number_error`) is displayed.
- The Place Order button remains disabled.

---

### TC-PAY-023 — Place Order button is enabled when gift card fully covers the order total

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-023, FR-PAY-092 |
| **Preconditions** | User is on the Payment section. Cart total is known. |
| **Required data keys** | `giftCardData.validCodeFullCover` |
| **Blocked by** | AQ-004 — maximum gift card count per order requires confirmation. `giftCardData.validCodeFullCover` requires gift card service sandbox provisioning. |

**Actions**
1. Enter a valid gift card code whose value equals or exceeds the order total.
2. Apply the gift card.

**Expected outcomes**
- The order total is set to zero.
- The Place Order button is enabled without requiring additional payment authorisation.

---

### TC-PAY-024 — Order is not created and toast is shown when payment is declined at Place Order

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-024, BR-009 |
| **Preconditions** | User has authorised payment. The payment provider is configured to decline at order creation. |
| **Required data keys** | `vStripeData.declinedCardNumber` |
| **Blocked by** | AQ-010 — retry behaviour and attempt limits after a decline are unconfirmed. Requires sandbox configuration to trigger decline at order creation stage. |

**Actions**
1. Enter card details for a card that will be declined at order creation.
2. Authorise the payment (Pay Now succeeds).
3. Select **Place Order**.

**Expected outcomes**
- No order is created.
- The order creation failure toast (`messages.order_creation_failed`) is displayed.
- The Place Order button is disabled (or the user is returned to a state allowing retry).

---

### TC-PAY-025 — COD uses its own Place Order button governed by COD rules

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-025 |
| **Preconditions** | User is on the Payment section. |

**Actions**
1. Select Cash on Delivery from the payment method list.
2. Observe the Order Summary.

**Expected outcomes**
- The Order Summary contains a COD-specific Place Order button (not the standard Place Order button governed by FR-PAY-020).

---

## 4. vStripe Card Payment

### TC-PAY-030 — vStripe interface displays card holder, card number, expiry, CVV and Pay Now

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-030 |
| **Preconditions** | User is on the Payment section. vStripe is selected (default). |

**Actions**
1. Observe the vStripe interface.

**Expected outcomes**
- Card holder name, card number, expiry (month and year) and CVV fields are displayed.
- A **Pay Now** button is displayed.

---

### TC-PAY-031 — Successful vStripe authorisation with valid card details

| **Field** | **Detail** |
| :--- | :--- |
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-031, FR-PAY-021 |
| **Preconditions** | User is able to access the storefront and has valid login credentials. vStripe is available as a payment method. |
| **Required data keys** | `paymentUser.email`, `paymentUser.password`, `vStripeData.cardHolderName`, `vStripeData.cardNumber`, `vStripeData.expiry`, `vStripeData.cvv`, `messages.paymentAuthorized` |

**Actions**

1. User is on homepage.
2. User signIn using email "paymentUser.email" and password "paymentUser.password".
3. User search for product "Cotton Swabs".
4. User clicks on first product with name "Cotton Swabs".
5. User click on add to cart button on PDP.
6. User navigate to cart page.
7. User click on proceed to checkout button.
8. User click on continue button under address section
9. User click on continue to payment button under under shipping method section
10. When User enters payment details "vStripeData" for vStripe.
11. And User click on button "payNow".
12. Then Payment Success message "paymentAuthorized" should be displayed. 
13. And Button "placeOrderBtn" should be enabled.

**Expected outcomes**

- User successfully signs in and navigates to the storefront.
- The selected product is successfully added to the cart.
- User successfully navigates to the payment section through express checkout.
- vStripe accepts the valid card details and authorises the payment.
- The payment success message "paymentAuthorized" is displayed.
- The Place Order button "placeOrderBtn" is enabled.

---

### TC-PAY-032 — Field-level error is shown for invalid card number

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-032 |
| **Preconditions** | User is on the Payment section. vStripe is selected. |
| **Required data keys** | `vStripeData.invalidCardNumber`, `vStripeData.expiry`, `vStripeData.cvv`, `vStripeData.cardHolderName` |

**Actions**
1. Enter an invalid card number, a valid expiry, valid CVV and a valid card holder name.
2. Select **Pay Now**.

**Expected outcomes**
- A field-level error (`messages.payment_card_number_error`) is displayed against the card number field.
- No errors are shown for valid fields.

---

### TC-PAY-033 — Field-level error is shown for invalid expiry date

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-032 |
| **Preconditions** | User is on the Payment section. vStripe is selected. |
| **Required data keys** | `vStripeData.cardNumber`, `vStripeData.invalidExpiry`, `vStripeData.cvv`, `vStripeData.cardHolderName` |
| **Blocked by** | AQ-007 — expiry validation rules (e.g. current month, past month) are not confirmed. |

**Actions**
1. Enter a valid card number, an invalid/past expiry date, valid CVV and a valid card holder name.
2. Select **Pay Now**.

**Expected outcomes**
- A field-level error (`messages.payment_expiry_error`) is displayed against the expiry field.

---

### TC-PAY-034 — Field-level error is shown for invalid CVV

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-032 |
| **Preconditions** | User is on the Payment section. vStripe is selected. |
| **Required data keys** | `vStripeData.cardNumber`, `vStripeData.expiry`, `vStripeData.invalidCvv`, `vStripeData.cardHolderName` |
| **Blocked by** | AQ-007 — CVV length rules per card brand are not confirmed. |

**Actions**
1. Enter a valid card number, valid expiry, an invalid CVV and a valid card holder name.
2. Select **Pay Now**.

**Expected outcomes**
- A field-level error (`messages.payment_cvv_error`) is displayed against the CVV field.

---

### TC-PAY-035 — Card holder error is shown when Pay Now is selected with missing card holder name

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-033 |
| **Preconditions** | User is on the Payment section. vStripe is selected. |
| **Required data keys** | `vStripeData.cardNumber`, `vStripeData.expiry`, `vStripeData.cvv` |

**Actions**
1. Leave the card holder name field empty.
2. Enter valid card number, expiry and CVV.
3. Select **Pay Now**.

**Expected outcomes**
- A card holder error (`messages.payment_card_holder_error`) is displayed.

---

### TC-PAY-036 — Required-field errors shown for all empty vStripe fields on Pay Now

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-034 |
| **Preconditions** | User is on the Payment section. vStripe is selected. All fields are empty. |

**Actions**
1. Leave all card fields empty.
2. Select **Pay Now**.

**Expected outcomes**
- Required-field errors (`messages.payment_required_field_error`) are displayed against each of: card number, card holder name, expiry and CVV.

---

### TC-PAY-037 — Place Order button remains disabled while any vStripe validation error is present

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-035, BR-003 |
| **Preconditions** | User is on the Payment section. vStripe is selected. A validation error is present. |
| **Required data keys** | `vStripeData.invalidCardNumber` |

**Actions**
1. Enter an invalid card number and select **Pay Now** to trigger a validation error.
2. Observe the Place Order button.

**Expected outcomes**
- The Place Order button remains disabled while the card number error is present.

---

### TC-PAY-038 — Declined card at order creation triggers order failure toast (vStripe)

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-036, FR-PAY-024 |
| **Preconditions** | User has authorised payment with a Stripe card that is configured to decline at order creation. |
| **Required data keys** | `vStripeData.declinedCardNumber` |
| **Blocked by** | AQ-010 — retry limits after order creation decline are unconfirmed. Sandbox configuration to simulate a post-authorisation decline is required. |

**Actions**
1. Enter card details for a card accepted at authorisation but declined at order creation.
2. Select **Pay Now** (authorisation succeeds).
3. Select **Place Order**.

**Expected outcomes**
- No order is created.
- The order creation failure toast (`messages.order_creation_failed`) is displayed.

---

## 5. PayPal

### TC-PAY-050 — Selecting PayPal presents the PayPal authorisation journey

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-040 |
| **Preconditions** | User is on the Payment section. |
| **Blocked by** | AQ-006 — PayPal journey details (cancellation, timeout, failure) are unconfirmed. `paypalData` values require PayPal sandbox buyer account. |

**Actions**
1. Select **PayPal** from the payment method list.

**Expected outcomes**
- The PayPal authorisation journey is presented (popup or redirect).

---

### TC-PAY-051 — Approving PayPal payment enables Place Order button

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-041 |
| **Preconditions** | User is on the Payment section. PayPal authorisation journey is in progress. |
| **Required data keys** | `paypalData.email`, `paypalData.password` |
| **Blocked by** | `paypalData` values require PayPal sandbox buyer account. AQ-006 — journey details unconfirmed. |

**Actions**
1. Select **PayPal**.
2. Complete and approve the PayPal authorisation journey.

**Expected outcomes**
- The user is returned to the Payment section.
- The payment success message (`messages.payment_success`) is displayed.
- The Place Order button is enabled.

---

### TC-PAY-052 — Cancelling PayPal journey keeps Place Order button disabled

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-042 |
| **Preconditions** | User is on the Payment section. PayPal authorisation journey is in progress. |
| **Blocked by** | AQ-006 — PayPal cancellation behaviour unconfirmed. |

**Actions**
1. Select **PayPal**.
2. Cancel or abandon the PayPal authorisation journey without approving.

**Expected outcomes**
- The Place Order button remains disabled.

---

## 6. PayFort Card Payment

### TC-PAY-060 — PayFort interface displays card fields and Pay Now

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-050 |
| **Preconditions** | User is on the Payment section. |

**Actions**
1. Select **PayFort** from the payment method list.
2. Observe the PayFort interface.

**Expected outcomes**
- Card number, card holder name, expiry date and CVV fields are displayed.
- A **Pay Now** button is displayed.

---

### TC-PAY-061 — Field-level errors shown for invalid PayFort card details

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-051 |
| **Preconditions** | User is on the Payment section. PayFort is selected. |
| **Required data keys** | `payFortData.invalidCardNumber`, `payFortData.invalidExpiry`, `payFortData.invalidCvv` |
| **Blocked by** | `payFortData` values require PayFort sandbox card list. AQ-007 — card validation rules unconfirmed. |

**Actions**
1. Enter an invalid card number, invalid card holder name, invalid expiry and invalid CVV.
2. Select **Pay Now**.

**Expected outcomes**
- A field-level error is displayed for each invalid field: card number, card holder name, expiry and CVV.
- The Place Order button remains disabled.

---

### TC-PAY-062 — Place Order button remains disabled while PayFort validation error is present

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-052 |
| **Preconditions** | User is on the Payment section. PayFort is selected. A validation error exists. |
| **Blocked by** | `payFortData` values require PayFort sandbox. |

**Actions**
1. Enter invalid card details and select **Pay Now** to trigger a validation error.
2. Observe the Place Order button.

**Expected outcomes**
- The Place Order button remains disabled while the PayFort validation error is present.

---

### TC-PAY-063 — Successful PayFort authorisation with valid card details enables Place Order

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-053, FR-PAY-021 |
| **Preconditions** | User is on the Payment section. PayFort is selected. |
| **Required data keys** | `payFortData.cardHolderName`, `payFortData.cardNumber`, `payFortData.expiry`, `payFortData.cvv` |
| **Blocked by** | `payFortData` values require PayFort sandbox card list. |

**Actions**
1. Enter valid card holder name, card number, expiry and CVV.
2. Select **Pay Now**.

**Expected outcomes**
- Payment is authorised.
- The payment success message (`messages.payment_success`) is displayed.
- The Place Order button is enabled.

---

## 7. Cash on Delivery

### TC-PAY-070 — Selecting COD displays agreement checkbox and COD Place Order button

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-060 |
| **Preconditions** | User is on the Payment section. |
| **Blocked by** | AQ-011 — COD eligibility rules and any fee or order value limits are unconfirmed. |

**Actions**
1. Select **Cash on Delivery** from the payment method list.

**Expected outcomes**
- The COD terms agreement checkbox is displayed.
- A COD-specific Place Order button is displayed.

---

### TC-PAY-071 — COD Place Order button is disabled until agreement checkbox is selected

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-061, BR-008 |
| **Preconditions** | COD is selected. The agreement checkbox is not yet checked. |

**Actions**
1. Select **Cash on Delivery**.
2. Observe the COD Place Order button without selecting the agreement checkbox.

**Expected outcomes**
- The COD Place Order button is disabled.

---

### TC-PAY-072 — Selecting COD agreement checkbox enables COD Place Order button

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-062, BR-008 |
| **Preconditions** | COD is selected. Agreement checkbox is unchecked. |

**Actions**
1. Select the COD terms agreement checkbox.

**Expected outcomes**
- The COD Place Order button becomes enabled.

---

### TC-PAY-073 — Clearing COD agreement checkbox disables COD Place Order button again

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-063, BR-008 |
| **Preconditions** | COD is selected. Agreement checkbox is checked and COD Place Order button is enabled. |

**Actions**
1. Clear (uncheck) the COD terms agreement checkbox.

**Expected outcomes**
- The COD Place Order button is disabled again.

---

## 8. Checkout.com

> **Scope: vfashion only.** Checkout.com is not available on vpro per Section 8.  
> Apple Pay and Google Pay cases are additionally blocked by AQ-013.

### TC-PAY-080 — Selecting Checkout.com shows Card, Apple Pay and Google Pay options with Card as default

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion |
| **References** | FR-PAY-070, FR-PAY-071, FR-PAY-072 |
| **Preconditions** | User (Registered or Guest) is on the Payment section on vfashion. |

**Actions**
1. Select **Checkout.com** from the payment method list.

**Expected outcomes**
- Card, Apple Pay and Google Pay options are displayed.
- Card is selected by default.
- The Place Order button remains disabled.

---

### TC-PAY-081 — Successful Checkout.com card authorisation enables Place Order button

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion |
| **References** | FR-PAY-073, FR-PAY-074, FR-PAY-021 |
| **Preconditions** | Checkout.com is selected. Card option is active. |
| **Blocked by** | Checkout.com sandbox card values not yet in data file. |

**Actions**
1. Enter valid Visa, Mastercard or American Express card details.
2. Select **Pay**.

**Expected outcomes**
- Payment is authorised.
- The payment success message (`messages.payment_success`) is displayed.
- The Place Order button is enabled.

---

### TC-PAY-082 — Field-level errors shown for invalid Checkout.com card fields

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion |
| **References** | FR-PAY-075 |
| **Preconditions** | Checkout.com is selected. Card option is active. |
| **Blocked by** | Checkout.com sandbox invalid card values not yet in data file. |

**Actions**
1. Enter an invalid card number, invalid expiry and invalid CVV.
2. Select **Pay**.

**Expected outcomes**
- An error is displayed against each invalid field.
- The Place Order button remains disabled.

---

### TC-PAY-083 — Required-field errors shown for empty Checkout.com card fields

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion |
| **References** | FR-PAY-076 |
| **Preconditions** | Checkout.com is selected. Card option is active. All card fields are empty. |

**Actions**
1. Leave all card fields empty.
2. Select **Pay**.

**Expected outcomes**
- Required-field errors are displayed.
- The Place Order button remains disabled.

---

### TC-PAY-084 — Checkout.com declined payment shows error message and keeps Place Order disabled

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion |
| **References** | FR-PAY-077 |
| **Preconditions** | Checkout.com is selected. Card option is active. Sandbox card is configured to decline. |
| **Blocked by** | Checkout.com sandbox decline card values not yet in data file. |

**Actions**
1. Enter card details for a card that will be declined by Checkout.com.
2. Select **Pay**.

**Expected outcomes**
- The corresponding payment error message is displayed.
- The Place Order button remains disabled.

---

### TC-PAY-085 — Apple Pay option is selectable and Apple Pay button is displayed (where available)

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion |
| **References** | FR-PAY-078 |
| **Test layer** | Manual — requires Apple Pay-capable device/browser with a configured wallet. |
| **Blocked by** | AQ-013 — supported devices and browsers for Apple Pay not confirmed. |

**Actions**
1. Select **Apple Pay** within the Checkout.com options.

**Expected outcomes**
- Apple Pay is selected.
- The Apple Pay button is displayed.
- The Place Order button remains disabled until Apple Pay authorisation completes.

---

### TC-PAY-086 — Google Pay option is selectable and Google Pay button is displayed (where available)

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion |
| **References** | FR-PAY-079 |
| **Test layer** | Manual — requires Google Pay-capable browser with a configured wallet. |
| **Blocked by** | AQ-013 — supported devices and browsers for Google Pay not confirmed. |

**Actions**
1. Select **Google Pay** within the Checkout.com options.

**Expected outcomes**
- Google Pay is selected.
- The Google Pay button is displayed.
- The Place Order button remains disabled until Google Pay authorisation completes.

---

### TC-PAY-087 — Guest can authorise payment using Checkout.com card

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion |
| **References** | FR-PAY-080, Section 8 |
| **Preconditions** | Guest has reached the Payment section on vfashion. Checkout.com is selected. |
| **Blocked by** | AQ-003 — guest checkout availability. Checkout.com sandbox card values required. |

**Actions**
1. Enter valid Checkout.com card details as a Guest.
2. Select **Pay**.

**Expected outcomes**
- Payment is authorised.
- The payment success message (`messages.payment_success`) is displayed.
- The Place Order button is enabled.

---

## 9. Gift Cards

### TC-PAY-090 — Valid gift card code is applied and displayed in Payment section and Order Summary

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-090, FR-PAY-091 |
| **Preconditions** | User is on the Payment section. |
| **Required data keys** | `giftCardData.validCodePartialCover` |
| **Blocked by** | `giftCardData` values require gift card service sandbox provisioning. |

**Actions**
1. Enter a valid gift card code in the gift card entry field.
2. Apply the gift card.

**Expected outcomes**
- The gift card is displayed in the Payment section.
- The gift card and its applied amount appear in the Order Summary.

---

### TC-PAY-091 — Gift card fully covering order total sets total to zero and enables Place Order

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-092, BR-007 |
| **Preconditions** | User is on the Payment section. |
| **Required data keys** | `giftCardData.validCodeFullCover` |
| **Blocked by** | `giftCardData.validCodeFullCover` requires sandbox provisioning. |

**Actions**
1. Apply a gift card whose value equals or exceeds the order total.

**Expected outcomes**
- The order total in the Order Summary is set to zero (not less than zero — BR-007).
- The Place Order button is enabled without additional payment authorisation.

---

### TC-PAY-092 — Gift card partially covering order total shows remaining balance and keeps Place Order disabled

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-093, BR-006 |
| **Preconditions** | User is on the Payment section. Cart total exceeds the gift card value. |
| **Required data keys** | `giftCardData.validCodePartialCover` |
| **Blocked by** | `giftCardData.validCodePartialCover` requires sandbox provisioning. |

**Actions**
1. Apply a gift card whose value is less than the order total.

**Expected outcomes**
- The amount payable is reduced by the gift card value.
- The remaining balance is displayed in the Order Summary.
- The Place Order button remains disabled until the remaining balance is paid.

---

### TC-PAY-093 — Zero-value gift card is rejected with gift card no longer valid error

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-094, BR-004 |
| **Preconditions** | User is on the Payment section. |
| **Required data keys** | `giftCardData.zeroValueCode` |
| **Blocked by** | `giftCardData.zeroValueCode` requires gift card service sandbox. |

**Actions**
1. Enter a gift card code with zero value.
2. Apply the gift card.

**Expected outcomes**
- The gift card no longer valid message (`messages.gift_card_no_longer_valid`) is displayed.
- The gift card is not applied to the order.

---

### TC-PAY-094 — Expired gift card is rejected with gift card no longer valid error

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-094, BR-004 |
| **Preconditions** | User is on the Payment section. |
| **Required data keys** | `giftCardData.expiredCode` |
| **Blocked by** | `giftCardData.expiredCode` requires gift card service sandbox. |

**Actions**
1. Enter an expired gift card code.
2. Apply the gift card.

**Expected outcomes**
- The gift card no longer valid message (`messages.gift_card_no_longer_valid`) is displayed.
- The gift card is not applied.

---

### TC-PAY-095 — Inactive gift card is rejected with gift card no longer valid error

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-094, BR-004 |
| **Preconditions** | User is on the Payment section. |
| **Required data keys** | `giftCardData.inactiveCode` |
| **Blocked by** | `giftCardData.inactiveCode` requires gift card service sandbox. |

**Actions**
1. Enter an inactive gift card code.
2. Apply the gift card.

**Expected outcomes**
- The gift card no longer valid message (`messages.gift_card_no_longer_valid`) is displayed.
- The gift card is not applied.

---

### TC-PAY-096 — Duplicate gift card application is rejected with gift card already applied error

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-095, BR-005 |
| **Preconditions** | User is on the Payment section. A valid gift card has already been applied. |
| **Required data keys** | `giftCardData.validCodePartialCover` (applied twice) |
| **Blocked by** | `giftCardData` values require sandbox provisioning. |

**Actions**
1. Apply a valid gift card code.
2. Enter the same gift card code again.
3. Attempt to apply it a second time.

**Expected outcomes**
- The gift card already applied message (`messages.gift_card_already_applied`) is displayed.
- The gift card is not applied a second time.

---

### TC-PAY-097 — More than one gift card can be applied to the same order

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-096 |
| **Preconditions** | User is on the Payment section. |
| **Required data keys** | `giftCardData.validCodePartialCover`, a second distinct gift card code |
| **Blocked by** | AQ-004 — maximum gift card count per order unconfirmed. Gift card sandbox provisioning required. |

**Actions**
1. Apply the first valid gift card code.
2. Apply a second valid and distinct gift card code.

**Expected outcomes**
- Both gift cards are displayed in the Payment section.
- Each applied gift card is shown in the Order Summary.

---

### TC-PAY-098 — Applied gift card can be removed and order total is recalculated

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-097 |
| **Preconditions** | User is on the Payment section. A valid gift card has been applied. |
| **Required data keys** | `giftCardData.validCodePartialCover` |
| **Blocked by** | `giftCardData` values require sandbox provisioning. |

**Actions**
1. Apply a valid gift card code.
2. Remove the applied gift card using the Remove control.

**Expected outcomes**
- The gift card is no longer displayed in the Payment section.
- The gift card is no longer shown in the Order Summary.
- The order total is recalculated to its value before the gift card was applied.

---

### TC-PAY-099 — Guest can apply and use a gift card

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-098, Section 8 |
| **Preconditions** | Guest has reached the Payment section. |
| **Required data keys** | `giftCardData.validCodePartialCover` |
| **Blocked by** | AQ-003 — guest checkout availability. Gift card sandbox provisioning required. |

**Actions**
1. Enter a valid gift card code as a Guest.
2. Apply the gift card.

**Expected outcomes**
- The gift card is applied and displayed in the Payment section and Order Summary.

---

## 10. Split Payment

### TC-PAY-110 — Partial gift card allows remaining balance payment via vStripe

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-100, FR-PAY-102 |
| **Preconditions** | User is on the Payment section. A partial-cover gift card is applied. Remaining balance is shown. |
| **Required data keys** | `giftCardData.validCodePartialCover`, `vStripeData.cardHolderName`, `vStripeData.cardNumber`, `vStripeData.expiry`, `vStripeData.cvv` |
| **Blocked by** | `giftCardData.validCodePartialCover` requires sandbox provisioning. |

**Actions**
1. Apply a partial-cover gift card. Remaining balance is displayed.
2. Select vStripe (or confirm it is selected).
3. Enter valid card details.
4. Select **Pay Now**.

**Expected outcomes**
- The remaining balance is authorised via vStripe.
- The payment success message (`messages.payment_success`) is displayed.
- The Place Order button is enabled.

---

### TC-PAY-111 — Partial gift card allows remaining balance payment via Checkout.com card

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion |
| **References** | FR-PAY-100, FR-PAY-102 |
| **Preconditions** | User is on the Payment section on vfashion. A partial-cover gift card is applied. Remaining balance is shown. |
| **Blocked by** | `giftCardData.validCodePartialCover` and Checkout.com sandbox card values required. AQ-012 — split payment with other methods unconfirmed. |

**Actions**
1. Apply a partial-cover gift card. Remaining balance is displayed.
2. Select Checkout.com and enter valid card details.
3. Select **Pay**.

**Expected outcomes**
- The remaining balance is authorised via Checkout.com.
- The payment success message (`messages.payment_success`) is displayed.
- The Place Order button is enabled.

---

### TC-PAY-112 — Place Order button is enabled after split payment remaining balance is authorised

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-101 |
| **Preconditions** | Gift card applied; remaining balance authorised (TC-PAY-110 or TC-PAY-111 completed). |
| **Blocked by** | Dependent on TC-PAY-110 or TC-PAY-111. |

**Actions**
1. Confirm remaining balance authorisation has completed.
2. Observe the Place Order button.

**Expected outcomes**
- The Place Order button is enabled.

---

## 11. Order Summary Behaviour

### TC-PAY-120 — Order Summary shows each applied gift card and remaining balance

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-110 |
| **Preconditions** | User is on the Payment section. A partial-cover gift card is applied. |
| **Required data keys** | `giftCardData.validCodePartialCover` |
| **Blocked by** | `giftCardData` values require sandbox provisioning. |

**Actions**
1. Apply a partial-cover gift card.
2. Observe the Order Summary.

**Expected outcomes**
- The applied gift card is listed in the Order Summary.
- The remaining balance is displayed in the Order Summary.

---

### TC-PAY-121 — Order Summary total equals subtotal plus shipping and taxes minus gift card amounts and is not less than zero

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-111, BR-007 |
| **Preconditions** | User is on the Payment section. At least one gift card is applied. Subtotal, shipping and tax values are known. |
| **Test layer** | Calculation verification — values must be read from the Order Summary and verified independently of the total field. |
| **Blocked by** | `giftCardData` values and known subtotal/shipping/tax values required. |

**Actions**
1. Apply a gift card.
2. Read the subtotal, shipping charge, taxes and gift card amount from the Order Summary.
3. Verify the displayed total equals subtotal + shipping + taxes − gift card amount.

**Expected outcomes**
- The Order Summary total matches the independent calculation.
- The total is not less than zero.

---

### TC-PAY-122 — Order Summary updates immediately when a gift card is applied

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-112, NFR-002 |
| **Preconditions** | User is on the Payment section. |
| **Required data keys** | `giftCardData.validCodePartialCover` |
| **Blocked by** | `giftCardData` values required. NFR-002 (2-second update) requires timing measurement — performance assertion layer. |

**Actions**
1. Note the Order Summary total before applying a gift card.
2. Apply the gift card.
3. Observe the Order Summary.

**Expected outcomes**
- The Order Summary updates immediately (within 2 seconds per NFR-002) to reflect the applied gift card amount and revised total.

---

### TC-PAY-123 — Order Summary updates immediately when a gift card is removed

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | FR-PAY-112, NFR-002 |
| **Preconditions** | A gift card is applied. Order Summary reflects the gift card. |
| **Required data keys** | `giftCardData.validCodePartialCover` |
| **Blocked by** | `giftCardData` values required. |

**Actions**
1. Remove the applied gift card.
2. Observe the Order Summary.

**Expected outcomes**
- The Order Summary updates immediately to remove the gift card entry and restore the original order total.

---

## 12. Error Handling

### TC-PAY-130 — Payment provider unavailable: user-friendly error displayed, Place Order disabled, retry available

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | Section 10 |
| **Test layer** | Manual / integration — requires sandbox simulation of provider unavailability. |
| **Blocked by** | Sandbox capability to simulate provider unavailability required. |

**Actions**
1. Configure or simulate payment provider unavailability.
2. Attempt to authorise payment.

**Expected outcomes**
- A user-friendly error is displayed.
- The Place Order button remains disabled.
- The user can retry the payment.

---

### TC-PAY-131 — Payment declined at authorisation: provider-mapped error displayed, Place Order disabled

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | Section 10, BR-009 |
| **Required data keys** | `vStripeData.declinedCardNumber` |

**Actions**
1. Enter card details for a card that is configured to be declined at authorisation.
2. Select **Pay Now**.

**Expected outcomes**
- The provider-mapped error message is displayed.
- The Place Order button remains disabled.

---

### TC-PAY-132 — Session expiry during payment: cart preserved, order not created

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion, vpro |
| **References** | Section 10 |
| **Test layer** | Manual — requires session expiry simulation during active payment authorisation. |
| **Blocked by** | Session expiry simulation capability. |

**Actions**
1. Begin the payment authorisation flow.
2. Allow the session to expire before completing authorisation.

**Expected outcomes**
- The cart is preserved.
- The user is required to sign in again or restart the guest checkout journey.
- No order is created.

---

### TC-PAY-133 — Browser not supporting Apple Pay does not display Apple Pay as selectable

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Storefronts** | vfashion |
| **References** | Section 10, FR-PAY-078 |
| **Test layer** | Manual — requires a browser/device that does not support Apple Pay. |
| **Blocked by** | AQ-013 — supported devices unconfirmed. |

**Actions**
1. Access the Payment section using a browser that does not support Apple Pay.
2. Select Checkout.com.
3. Observe the options.

**Expected outcomes**
- Apple Pay is not presented as a selectable option.

---

## 13. Non-Functional Requirements and Test-Layer Allocations

| ID | NFR | Test approach | Layer |
|----|-----|---------------|-------|
| NFR-001 | Authorisation returns within 10 seconds under normal conditions | Measure wall-clock time from Pay Now to success/failure response | Performance / Manual |
| NFR-002 | Gift card apply/remove updates Order Summary within 2 seconds | Measure elapsed time from apply action to update | Performance — noted in TC-PAY-122, TC-PAY-123 |
| NFR-003 | Card data captured only by provider-hosted fields; not stored by platform | Audit network traffic; review server-side storage | Security / Manual |
| NFR-004 | Payment operations authorised per session; no cross-user state | Session isolation testing | Security / Manual |
| NFR-005 | Gift card validity, balances and totals validated server-side | API-level validation checks | Integration |
| NFR-006 | Payment not captured more than once per order | Duplicate-request simulation | Integration / Security |
| NFR-007 | Payment section responsive on desktop, tablet and mobile | Responsive layout verification across breakpoints | Manual / Visual |
| NFR-008 | Payment section conforms to WCAG 2.1 Level AA | Automated accessibility scan plus manual keyboard verification | Accessibility |
| NFR-009 | Supports current Chrome, Edge, Safari and Firefox and mobile browsers | Cross-browser execution | Manual / CI matrix |
| NFR-010 | Text, currency and number formats follow storefront locale | Locale-specific review of displayed values | Manual |

---

## 14. Ambiguity Register

| ID | Type | Source reference | Issue | Affected cases | Question | Status |
|----|------|-----------------|-------|----------------|----------|--------|
| AQ-001 | Missing rule | Section 8 | bepro and getpro payment methods are marked "Not specified". | All bepro/getpro cases | Confirm which payment methods and features are available for bepro and getpro. | Open |
| AQ-002 | Missing rule | Section 8, Open Item 2 | Checkout.com availability on vpro is "No" in the matrix but Open Item 2 questions this. | TC-PAY-080–087 (vpro scope) | Confirm whether Checkout.com is available on vpro. | Open |
| AQ-003 | Missing rule | FR-PAY-003, Open Item 3 | Guest checkout availability per storefront depends on Checkout FSD open item. | TC-PAY-003, TC-PAY-099, TC-PAY-087 | Confirm guest checkout is available on vfashion and vpro. | Open |
| AQ-004 | Missing rule | FR-PAY-096, Open Item 4 | Maximum number of gift cards per order and consumption order of balances not defined. | TC-PAY-097 | Confirm maximum gift cards per order and the balance consumption order. | Open |
| AQ-005 | Missing rule | Open Item 5 | Behaviour when a gift card fully covers the total and whether payment methods remain selectable is unspecified. | TC-PAY-091 | Confirm whether other payment methods remain selectable when the order total is zero. | Open |
| AQ-006 | Missing rule | FR-PAY-040–042, Open Item 6 | PayPal journey cancellation, timeout and failure handling are unspecified. | TC-PAY-050–052 | Confirm PayPal cancellation, timeout and failure outcomes. | Open |
| AQ-007 | Missing rule | FR-PAY-032, Open Item 7 | Card validation rules — accepted brands per provider, expiry (past month vs. past year), CVV length, card holder format — are not confirmed. | TC-PAY-033, TC-PAY-034, TC-PAY-061 | Confirm card validation rules per provider. | Open |
| AQ-008 | Missing rule | Open Item 8 | 3-D Secure or additional customer authentication applicability is unconfirmed. | TC-PAY-031, TC-PAY-063, TC-PAY-081 | Confirm whether 3DS applies and document its outcomes (success, failure, challenge). | Open |
| AQ-009 | Missing rule | Open Item 9 | Behaviour when user changes payment method after authorisation is unspecified. | TC-PAY-011, TC-PAY-012 | Confirm whether changing payment method resets authorisation. | Open |
| AQ-010 | Missing rule | FR-PAY-024, FR-PAY-036, Open Item 10 | Retry behaviour and attempt limits after a payment decline are unconfirmed. | TC-PAY-024, TC-PAY-038, TC-PAY-131 | Confirm retry behaviour and any attempt limit following a payment decline. | Open |
| AQ-011 | Missing rule | FR-PAY-060, Open Item 11 | COD eligibility rules, any fee and any order value limits are unconfirmed. | TC-PAY-070–073 | Confirm COD eligibility rules and any associated fee or order value constraint. | Open |
| AQ-012 | Missing rule | FR-PAY-102, Open Item 12 | Split payment with PayPal, PayFort and COD is unconfirmed. Only vStripe and Checkout.com are named in FR-PAY-102. | TC-PAY-110–112 | Confirm which payment methods support split payment with a gift card. | Open |
| AQ-013 | Missing rule | FR-PAY-078, FR-PAY-079, Open Item 13 | Supported Apple Pay and Google Pay devices and browsers are unconfirmed. | TC-PAY-085, TC-PAY-086, TC-PAY-133 | Confirm supported devices and browsers for Apple Pay and Google Pay. | Open |
| AQ-014 | Missing rule | Section 7.2, Open Item 14 | Final message wording for all payment messages is pending content-team approval. | All message-assertion cases | Confirm and supply approved message content for all `messages.payment_*`, `messages.gift_card_*` and `messages.order_creation_failed` keys. | Open |

---

## 15. Traceability Matrix

| Requirement | Title (abbreviated) | Cases | Coverage status |
|-------------|---------------------|-------|-----------------|
| FR-PAY-001 | Payment section displayed after shipping method | TC-PAY-001 | Ready |
| FR-PAY-002 | Express Checkout shows Payment section | TC-PAY-002 | Ready |
| FR-PAY-003 | Guest reaches Payment section | TC-PAY-003 | Blocked (AQ-003) |
| FR-PAY-004 | Storefront payment methods displayed | TC-PAY-004 | Ready |
| FR-PAY-005 | Order Summary displayed | TC-PAY-005 | Ready |
| FR-PAY-010 | Configured payment methods shown | TC-PAY-004 | Ready |
| FR-PAY-011 | vStripe preselected by default | TC-PAY-010 | Ready |
| FR-PAY-012 | User can select different payment method | TC-PAY-011 | Ready |
| FR-PAY-013 | Only one payment method interface active | TC-PAY-012 | Ready |
| FR-PAY-020 | Place Order disabled before authorisation | TC-PAY-020 | Ready |
| FR-PAY-021 | Success message and Place Order enabled after authorisation | TC-PAY-021, TC-PAY-031, TC-PAY-051, TC-PAY-063, TC-PAY-081 | Ready; TC-PAY-051, -063, -081 blocked by data |
| FR-PAY-022 | Place Order disabled after auth failure | TC-PAY-022 | Ready |
| FR-PAY-023 | Place Order enabled when total fully covered by gift card | TC-PAY-023, TC-PAY-091 | Blocked (gift card data) |
| FR-PAY-024 | No order created + toast on Place Order decline | TC-PAY-024, TC-PAY-038 | Blocked (AQ-010, sandbox) |
| FR-PAY-025 | COD uses own Place Order button | TC-PAY-025, TC-PAY-070 | Ready (AQ-011 noted) |
| FR-PAY-030 | vStripe fields and Pay Now displayed | TC-PAY-030 | Ready |
| FR-PAY-031 | Valid vStripe details authorise payment | TC-PAY-031 | Ready |
| FR-PAY-032 | Invalid vStripe fields show field-level errors | TC-PAY-032, TC-PAY-033, TC-PAY-034 | TC-PAY-033, -034 blocked (AQ-007) |
| FR-PAY-033 | Missing card holder shows error | TC-PAY-035 | Ready |
| FR-PAY-034 | Empty vStripe fields show required-field errors | TC-PAY-036 | Ready |
| FR-PAY-035 | Place Order disabled while vStripe error present | TC-PAY-037 | Ready |
| FR-PAY-036 | Declined at order creation applies FR-PAY-024 | TC-PAY-038 | Blocked (AQ-010, sandbox) |
| FR-PAY-040 | PayPal presents authorisation journey | TC-PAY-050 | Blocked (AQ-006, data) |
| FR-PAY-041 | PayPal approval returns user and enables Place Order | TC-PAY-051 | Blocked (AQ-006, data) |
| FR-PAY-042 | Cancelled PayPal keeps Place Order disabled | TC-PAY-052 | Blocked (AQ-006) |
| FR-PAY-050 | PayFort fields and Pay Now displayed | TC-PAY-060 | Ready |
| FR-PAY-051 | Invalid PayFort details show field-level errors | TC-PAY-061 | Blocked (data, AQ-007) |
| FR-PAY-052 | Place Order disabled while PayFort error present | TC-PAY-062 | Blocked (data) |
| FR-PAY-053 | Valid PayFort details authorise payment | TC-PAY-063 | Blocked (data) |
| FR-PAY-060 | COD shows agreement checkbox and COD Place Order | TC-PAY-070 | Ready (AQ-011 noted) |
| FR-PAY-061 | COD Place Order disabled before checkbox | TC-PAY-071 | Ready |
| FR-PAY-062 | Checking agreement enables COD Place Order | TC-PAY-072 | Ready |
| FR-PAY-063 | Clearing agreement disables COD Place Order | TC-PAY-073 | Ready |
| FR-PAY-070 | Checkout.com shows Card/Apple Pay/Google Pay | TC-PAY-080 | Ready (vfashion only) |
| FR-PAY-071 | Card selected by default in Checkout.com | TC-PAY-080 | Ready (vfashion only) |
| FR-PAY-072 | Place Order disabled until Checkout.com authorised | TC-PAY-080 | Ready (vfashion only) |
| FR-PAY-073 | Checkout.com Card captures details, accepts Visa/MC/Amex | TC-PAY-081 | Blocked (data) |
| FR-PAY-074 | Valid Checkout.com card authorises payment | TC-PAY-081 | Blocked (data) |
| FR-PAY-075 | Invalid Checkout.com fields show field errors | TC-PAY-082 | Blocked (data) |
| FR-PAY-076 | Empty Checkout.com fields show required errors | TC-PAY-083 | Ready (vfashion only) |
| FR-PAY-077 | Checkout.com declined shows error, Place Order disabled | TC-PAY-084 | Blocked (data) |
| FR-PAY-078 | Apple Pay selectable and button shown (where available) | TC-PAY-085 | Blocked (AQ-013, manual) |
| FR-PAY-079 | Google Pay selectable and button shown (where available) | TC-PAY-086 | Blocked (AQ-013, manual) |
| FR-PAY-080 | Guest can authorise via Checkout.com card | TC-PAY-087 | Blocked (AQ-003, data) |
| FR-PAY-090 | Gift card code can be entered and applied | TC-PAY-090 | Blocked (data) |
| FR-PAY-091 | Valid gift card displayed in Payment section and Order Summary | TC-PAY-090 | Blocked (data) |
| FR-PAY-092 | Full-cover gift card sets total to zero, enables Place Order | TC-PAY-091 | Blocked (data) |
| FR-PAY-093 | Partial gift card shows remaining balance, Place Order disabled | TC-PAY-092 | Blocked (data) |
| FR-PAY-094 | Zero/expired/inactive gift card rejected with error | TC-PAY-093, TC-PAY-094, TC-PAY-095 | Blocked (data) |
| FR-PAY-095 | Duplicate gift card rejected with error | TC-PAY-096 | Blocked (data) |
| FR-PAY-096 | Multiple gift cards supported | TC-PAY-097 | Blocked (AQ-004, data) |
| FR-PAY-097 | Gift card can be removed; total recalculated | TC-PAY-098 | Blocked (data) |
| FR-PAY-098 | Gift cards available to Registered and Guests | TC-PAY-099 | Blocked (AQ-003, data) |
| FR-PAY-100 | Remaining balance payable after partial gift card | TC-PAY-110, TC-PAY-111 | Blocked (data) |
| FR-PAY-101 | Success message and Place Order enabled after split auth | TC-PAY-112 | Blocked (data) |
| FR-PAY-102 | Split payment supported with vStripe and Checkout.com | TC-PAY-110, TC-PAY-111 | Blocked (data, AQ-012) |
| FR-PAY-110 | Order Summary shows gift cards and remaining balance | TC-PAY-120 | Blocked (data) |
| FR-PAY-111 | Order Summary total = subtotal + shipping + tax - gift cards >= 0 | TC-PAY-121 | Blocked (data) |
| FR-PAY-112 | Order Summary updates immediately on gift card apply/remove | TC-PAY-122, TC-PAY-123 | Blocked (data) |
| Section 10 — Error handling | Provider unavailable, session expiry, browser incompatibility | TC-PAY-130, TC-PAY-132, TC-PAY-133 | Blocked (manual / sandbox) |
| BR-001–010 | Business rules | Covered by corresponding FR cases | — |
| NFR-001–010 | Non-functional requirements | TC-PAY-122 (NFR-002 timing); all others separate test layers | See Section 13 |
