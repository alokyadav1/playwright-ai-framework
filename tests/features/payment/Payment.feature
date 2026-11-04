@payment
Feature: Payment authorization

  @TC-PAY-031 @REQ-FR-PAY-031 @REQ-FR-PAY-021
  Scenario: Successful vStripe authorisation with valid card details
    Given I am on the VPRO storefront homepage
    When I sign in as the "paymentUser" user
    And I search for the "simpleProduct" product
    And I open the first matching "simpleProduct" product
    And I add the product to my cart
    And I navigate to my cart
    And I proceed to checkout
    And I continue from the delivery address section
    And I continue to payment
    And I enter valid vStripe details from the "vStripeData"
    And I authorize payment with vStripe
    Then the payment confirmation is displayed from the "messages.paymentAuthorized" message
    And the Place Order action is enabled