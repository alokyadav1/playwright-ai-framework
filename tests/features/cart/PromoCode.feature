@cart
Feature: Promo code handling on cart page

  @TC-PROMO-002 @REQ-FR-PRM-020
  Scenario: User applies invalid promo code on cart page and sees validation error
    Given I am on the VPRO storefront homepage
    When I sign in as the "user.registered" user
    And my cart contains at least one item
    And I navigate to my cart
    And I enter the "promo.invalidPromoCode" promo code
    And I click apply promo code
    Then the cart order summary total remains unchanged
    And the invalid promo error message "invalidPromoCodeMsg" is displayed in red text
