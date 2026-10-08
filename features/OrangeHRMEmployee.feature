@orangehrm
Feature: OrangeHRM employee management
  As an HR administrator
  I want to manage and search for employees
  So that employee records can be verified

  Background:
    Given I am logged in to OrangeHRM

  Scenario: TC_009 - Add an employee
    When I add a new employee
    Then the employee should be saved successfully

  Scenario: TC_010 - Search for an existing employee by name
    Given an employee exists in the employee list
    When I search for that employee by name
    Then the matching employee should be displayed

  Scenario: TC_010 - Search for a non-existing employee by name
    When I search for a non-existing employee
    Then no employee records should be found
