const { test, expect } = require('@playwright/test');
const { OrangeHRMPOManager } = require('../pageobjects/OrangeHRMPOManager');

test('TC_009 - Add Employee', async ({ page }) => {
  const firstName = `QA${Date.now()}`;
  const middleName = 'Automation';
  const lastName = 'Employee';
  const poManager = new OrangeHRMPOManager(page);
  const loginPage = poManager.getLoginPage();
  const employeePage = poManager.getEmployeePage();

  await loginPage.goTo();
  await loginPage.login('Admin', 'admin123');
  await expect(page).toHaveURL(/\/dashboard\/index/);

  await employeePage.openAddEmployeeForm();
  await employeePage.addEmployee(firstName, middleName, lastName);

  await expect(page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
  await employeePage.verifyEmployeeDetails(firstName, middleName, lastName);
});

test('TC_010 - Search for an existing employee by name', async ({ page }) => {
  const poManager = new OrangeHRMPOManager(page);
  const loginPage = poManager.getLoginPage();
  const employeePage = poManager.getEmployeePage();

  await loginPage.goTo();
  await loginPage.login('Admin', 'admin123');
  await employeePage.openEmployeeList();
  const existingEmployee = await employeePage.getFirstListedEmployee();
  const employeeName = `${existingEmployee.firstAndMiddleName} ${existingEmployee.lastName}`;
  await employeePage.searchEmployee(employeeName, true);
  await employeePage.verifyEmployeeInSearchResults(
    existingEmployee.firstAndMiddleName,
    existingEmployee.lastName
  );
});

test('TC_010 - Search for a non-existing employee by name', async ({ page }) => {
  const poManager = new OrangeHRMPOManager(page);
  const loginPage = poManager.getLoginPage();
  const employeePage = poManager.getEmployeePage();
  const employeeName = `Missing${Date.now()} Employee`;

  await loginPage.goTo();
  await loginPage.login('Admin', 'admin123');
  await employeePage.openEmployeeList();
  await employeePage.searchEmployee(employeeName);
  await employeePage.verifyNoEmployeesFound();
});
