class OrangeHRMLoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async goToLogin() {
    await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username = 'Admin', password = 'admin123') {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL(/\/dashboard\/index|\/web\/index\.php\/dashboard\/index/);
  }
}

module.exports = { OrangeHRMLoginPage };
