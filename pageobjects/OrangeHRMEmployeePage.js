const { expect } = require('@playwright/test');

class OrangeHRMEmployeePage {
  constructor(page) {
    this.page = page;
    this.pimLink = page.getByRole('link', { name: 'PIM' });
    this.employeeListLink = page.getByRole('link', { name: 'Employee List' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.middleName = page.getByRole('textbox', { name: 'Middle Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.saveSuccessMessage = page.getByText('Successfully Saved', { exact: true });
    this.personalDetailsHeading = page.getByRole('heading', { name: 'Personal Details' });
    this.employeeNameSearch = page.getByPlaceholder('Type for hints...').first();
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.employeeRows = page.locator('.oxd-table-body .oxd-table-card');
    this.noRecordsMessage = page.getByText('No Records Found', { exact: true }).first();
  }

  async openAddEmployeeForm() {
    await this.pimLink.click();
    await this.employeeListLink.click();
    await this.addButton.click();
  }

  async openEmployeeList() {
    await this.pimLink.click();
    await this.employeeListLink.click();
  }

  async addEmployee(firstName, middleName, lastName) {
    await this.firstName.fill(firstName);
    await this.middleName.fill(middleName);
    await this.lastName.fill(lastName);
    await this.saveButton.click();
  }

  async searchEmployee(employeeName, selectSuggestion = false) {
    await this.employeeNameSearch.fill(employeeName);
    if (selectSuggestion) {
      await this.page.locator('.oxd-autocomplete-option').filter({ hasText: employeeName }).click();
    }
    await this.searchButton.click();
  }

  async getFirstListedEmployee() {
    const firstRow = this.employeeRows.first();
    await expect(firstRow).toBeVisible();

    const cells = firstRow.locator('.oxd-table-cell');
    return {
      firstAndMiddleName: (await cells.nth(2).innerText()).trim(),
      lastName: (await cells.nth(3).innerText()).trim(),
    };
  }

  async verifyEmployeeSaved() {
    await expect(this.saveSuccessMessage).toBeVisible();
  }

  async verifyEmployeeInSearchResults(firstName, lastName) {
    const employeeRow = this.employeeRows
      .filter({ hasText: firstName })
      .filter({ hasText: lastName });
    await expect(employeeRow).toBeVisible();
  }

  async verifyNoEmployeesFound() {
    await expect(this.noRecordsMessage).toBeVisible();
  }

  async verifyEmployeeDetails(firstName, middleName, lastName) {
    await expect(this.personalDetailsHeading).toBeVisible();
    await expect(this.firstName).toHaveValue(firstName);
    await expect(this.middleName).toHaveValue(middleName);
    await expect(this.lastName).toHaveValue(lastName);
  }
}

module.exports = { OrangeHRMEmployeePage };
