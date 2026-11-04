@cart
Feature: Cart access and line item display

  @TC-CART-001 @REQ-FR-CRT-001 @REQ-FR-CRT-002
  Scenario: Cart page is accessible to Guest
    Given I am on the VPRO storefront homepage
    When I navigate to my cart
    Then the cart page is open

  @TC-CART-002 @REQ-FR-CRT-001 @REQ-FR-CRT-002
  Scenario: Cart page is accessible to Registered User
    Given I am on the VPRO storefront homepage
    When I sign in as the "user.registered" user
    And I navigate to my cart
    Then the registered user's cart is displayed

  @TC-CART-003 @REQ-FR-CRT-002
  Scenario: Cart page opens from header cart icon
    Given I am on the VPRO storefront homepage
    When I open the cart from the header
    Then the cart page is open

  @TC-CART-004 @REQ-FR-CRT-003 @REQ-FR-CRT-004
  Scenario: Cart page reflects real-time cart state
    Given I am on the VPRO storefront homepage
    When I sign in as the "user.registered" user
    And I navigate to my cart
    Then the cart item list includes the "cart.productInStock" product
    And the order summary is visible
    And the checkout action is visible

  @TC-CART-010 @REQ-FR-CRT-010
  Scenario: Line item displays all required attributes
    Given I have added the "cart.productInStock" product to my guest cart
    When I navigate to my cart
    Then the "cart.productInStock" product image is displayed in the cart
    And the "cart.productInStock" product name is displayed in the cart
    And the unit price is displayed for the "cart.productInStock" cart product
    And the selected quantity is displayed for the "cart.productInStock" cart product
    And the line total is displayed for the "cart.productInStock" cart product
