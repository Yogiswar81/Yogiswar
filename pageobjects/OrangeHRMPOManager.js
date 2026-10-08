const { OrangeHRMLoginPage } = require('./OrangeHRMLoginPage');
const { OrangeHRMEmployeePage } = require('./OrangeHRMEmployeePage');

class OrangeHRMPOManager {
  constructor(page) {
    this.loginPage = new OrangeHRMLoginPage(page);
    this.employeePage = new OrangeHRMEmployeePage(page);
  }

  getLoginPage() {
    return this.loginPage;
  }

  getEmployeePage() {
    return this.employeePage;
  }
}

module.exports = { OrangeHRMPOManager };
