Feature: Smoke test for login screen

  Scenario: The login screen renders
    Given I am on the "/sign-in" page
    Then I should see the login form 