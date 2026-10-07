const { test, expect } = require('@playwright/test');
const { OrangeHRMLoginPage } = require('../pageobjects/OrangeHRMLoginPage');
const { EmployeePage } = require('../pageobjects/EmployeePage');

test('TC_009 - Add Employee', async ({ page }) => {
  const loginPage = new OrangeHRMLoginPage(page);
  const employeePage = new EmployeePage(page);

  const timeStamp = Date.now();
  const firstName = 'QA';
  const middleName = 'Playwright';
  const lastName = `Employee${timeStamp}`;
  const employeeId = `EMP${timeStamp.toString().slice(-6)}`;

  await loginPage.goToLogin();
  await loginPage.login('Admin', 'admin123');

  await employeePage.openEmployeeList();
  await employeePage.addEmployee({
    firstName,
    middleName,
    lastName,
    employeeId,
  });

  await expect(page).toHaveURL(/\/pim\/viewPersonalDetails\/\d+/);
  await expect(page.locator('h6')).toContainText('Personal Details');
  await expect(page.locator('input[name="firstName"]')).toHaveValue(firstName);
  await expect(page.locator('input[name="lastName"]')).toHaveValue(lastName);
});
