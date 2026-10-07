const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { OrangeHRMPOManager } = require('../../pageobjects/OrangeHRMPOManager');

Given('I am logged in to OrangeHRM', async function () {
  this.orangeHrm = new OrangeHRMPOManager(this.page);
  this.loginPage = this.orangeHrm.getLoginPage();
  this.employeePage = this.orangeHrm.getEmployeePage();

  await this.loginPage.goTo();
  await this.loginPage.login('Admin', 'admin123');
  await expect(this.page).toHaveURL(/\/dashboard\/index/);
});

When('I add a new employee', async function () {
  this.employee = {
    firstName: `BDD${Date.now()}`,
    middleName: 'Cucumber',
    lastName: 'Employee',
  };

  await this.employeePage.openAddEmployeeForm();
  await this.employeePage.addEmployee(
    this.employee.firstName,
    this.employee.middleName,
    this.employee.lastName
  );
});

Then('the employee should be saved successfully', async function () {
  await this.employeePage.verifyEmployeeSaved();
});

Given('an employee exists in the employee list', async function () {
  await this.employeePage.openEmployeeList();
  this.employee = await this.employeePage.getFirstListedEmployee();
  this.employee.fullName = `${this.employee.firstAndMiddleName} ${this.employee.lastName}`;
});

When('I search for that employee by name', async function () {
  await this.employeePage.searchEmployee(this.employee.fullName, true);
});

Then('the matching employee should be displayed', async function () {
  await this.employeePage.verifyEmployeeInSearchResults(
    this.employee.firstAndMiddleName,
    this.employee.lastName
  );
});

When('I search for a non-existing employee', async function () {
  this.employeeSearch = `Missing${Date.now()} Employee`;
  await this.employeePage.openEmployeeList();
  await this.employeePage.searchEmployee(this.employeeSearch);
});

Then('no employee records should be found', async function () {
  await this.employeePage.verifyNoEmployeesFound();
});
