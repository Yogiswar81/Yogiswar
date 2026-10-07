import {
  defineParameterType,
  Given,
  Then,
  When,
  type DataTable,
  type IWorld,
} from '@cucumber/cucumber';
import { expect, type Page } from '@playwright/test';

interface DashboardPage {
  navigateToOrders(): Promise<void>;
  searchProductAddCart(productName: string): Promise<void>;
  navigateToCart(): Promise<void>;
}

interface CartPage {
  Checkout(): Promise<void>;
  VerifyProductIsDisplayed(productName: string): Promise<void>;
}

interface OrdersHistoryPage {
  searchOrderAndSelect(orderId: string): Promise<void>;
  getOrderId(): Promise<string>;
}

interface OrdersReviewPage {
  searchCountryAndSelect(searchText: string, country: string): Promise<void>;
  SubmitAndGetOrderId(): Promise<string>;
}

interface LoginPage {
  goTo(): Promise<void>;
  validLogin(username: string, password: string): Promise<void>;
}

interface PageObjectManager {
  getLoginPage(): LoginPage;
  getCartPage(): CartPage;
  getDashboardPage(): DashboardPage;
  getOrdersHistoryPage(): OrdersHistoryPage;
  getOrdersReviewPage(): OrdersReviewPage;
}

interface ScenarioWorld extends IWorld {
  page: Page;
  pageObjectManager: PageObjectManager;
  stdout: string;
  orderId: string;
  cartPage: CartPage;
  dashboardPage: DashboardPage;
}

declare function require(moduleName: string): {
  POManager: new (page: Page) => PageObjectManager;
};

const { POManager } = require('../../pageobjects/POManager');

defineParameterType({
  name: 'command',
  regexp: /`(.+)`/,
  transformer: (command: string): string => command,
});

When('I run {string}', function (this: ScenarioWorld, command: string) {
  this.stdout = command;
});

Then(
  'Verify order is present in the OrderHistory',
  async function (this: ScenarioWorld) {
    await this.dashboardPage.navigateToOrders();
    const ordersHistoryPage = this.pageObjectManager.getOrdersHistoryPage();
    await ordersHistoryPage.searchOrderAndSelect(this.orderId);
    expect(this.orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();
  }
);

When(
  'Enter valid details and Place the Order',
  async function (this: ScenarioWorld) {
    await this.cartPage.Checkout();

    const ordersReviewPage = this.pageObjectManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect('ind', 'India');
    this.orderId = await ordersReviewPage.SubmitAndGetOrderId();
  }
);

Then(
  'Verify {string} is displayed in the Cart',
  async function (this: ScenarioWorld, productName: string) {
    this.cartPage = this.pageObjectManager.getCartPage();
    await this.cartPage.VerifyProductIsDisplayed(productName);
  }
);

When(
  'Add {string} to Cart',
  async function (this: ScenarioWorld, productName: string) {
    this.dashboardPage = this.pageObjectManager.getDashboardPage();
    await this.dashboardPage.searchProductAddCart(productName);
    await this.dashboardPage.navigateToCart();
  }
);

Given(
  'a login to Ecommerce application with {string} and {string}',
  { timeout: 100 * 1000 },
  async function (this: ScenarioWorld, username: string, password: string) {
    this.pageObjectManager = new POManager(this.page);
    await this.pageObjectManager.getLoginPage().goTo();
    await this.pageObjectManager.getLoginPage().validLogin(username, password);
    this.dashboardPage = this.pageObjectManager.getDashboardPage();
    this.cartPage = this.pageObjectManager.getCartPage();
  }
);

Then(
  'the stdout should contain {string}',
  function (this: ScenarioWorld, expected: string) {
    expect(this.stdout).toBe(expected);
  }
);

Given(
  /^a table step$/,
  function (table: DataTable) {
    const expected = [
      ['Apricot', '5'],
      ['Brocolli', '2'],
      ['Cucumber', '10'],
    ];
    expect(table.rows()).toEqual(expected);
  }
);

Given(
  'a login to Ecommerce2 application with {string} and {string}',
  { timeout: 100 * 1000 },
  async function (this: ScenarioWorld, _username: string, _password: string) {
    await this.page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    await this.page.locator('#username').fill('rahulshetty');
    await this.page.locator("[type='password']").fill('learning');
    await this.page.locator('#signInBtn').click();
  }
);

Then('Verify Error message is displayed', async function (this: ScenarioWorld) {
  await expect(this.page.locator("[style*='block']")).toContainText('Incorrect');
});
