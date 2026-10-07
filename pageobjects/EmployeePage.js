class EmployeePage {
  constructor(page) {
    this.page = page;
  }

  async openEmployeeList() {
    await this.page.locator('a.oxd-main-menu-item').filter({ hasText: 'PIM' }).click();
    await this.page.locator('a.oxd-topbar-body-nav-tab-link').filter({ hasText: 'Employee List' }).click();
    await this.page.waitForURL(/\/pim\/viewEmployeeList/);
  }

  async addEmployee(employeeData) {
    const { firstName, middleName, lastName, employeeId } = employeeData;

    await this.page.locator('button').filter({ hasText: 'Add' }).click();
    await this.page.waitForURL(/\/pim\/addEmployee/);

    await this.page.locator('input[name="firstName"]').fill(firstName);
    await this.page.locator('input[name="middleName"]').fill(middleName);
    await this.page.locator('input[name="lastName"]').fill(lastName);

    if (employeeId) {
      await this.page.locator('input[name="employeeId"]').fill(employeeId);
    }

    await this.page.locator('button[type="submit"]').last().click();
    await this.page.waitForURL(/\/pim\/viewPersonalDetails\/\d+/);
  }
}

module.exports = { EmployeePage };
