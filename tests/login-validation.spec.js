const { test, expect } = require('@playwright/test');
const [validUser] = require('../utils/placeorderTestData.json');

const loginUrl = 'https://rahulshettyacademy.com/client';
const requiredEmailMessage = '*Email is required';
const requiredPasswordMessage = '*Password is required';

test.describe('Login test cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(loginUrl);
  });

  test('TC_001 - Login with valid credentials', async ({ page }) => {
    await page.locator('#userEmail').fill(validUser.username);
    await page.locator('#userPassword').fill(validUser.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/#\/dashboard\/dash/);
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
  });

  test('TC_002 - Login with invalid username', async ({ page }) => {
    await page.locator('#userEmail').fill('invalid.user@example.com');
    await page.locator('#userPassword').fill(validUser.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Incorrect email or password.')).toBeVisible();
    await expect(page).toHaveURL(/#\/auth\/login/);
  });

  test('TC_003 - Login with invalid password', async ({ page }) => {
    await page.locator('#userEmail').fill(validUser.username);
    await page.locator('#userPassword').fill('InvalidPassword123!');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Incorrect email or password.')).toBeVisible();
    await expect(page).toHaveURL(/#\/auth\/login/);
  });

  test('TC_004 - Login with both fields empty', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText(requiredEmailMessage)).toBeVisible();
    await expect(page.getByText(requiredPasswordMessage)).toBeVisible();
  });

  test('TC_005 - Username field validation', async ({ page }) => {
    await page.locator('#userPassword').fill(validUser.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText(requiredEmailMessage)).toBeVisible();
  });

  test('TC_006 - Password field validation', async ({ page }) => {
    await page.locator('#userEmail').fill(validUser.username);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText(requiredPasswordMessage)).toBeVisible();
  });

  test('TC_007 - Password masking', async ({ page }) => {
    await page.locator('#userPassword').fill('Password123!');

    await expect(page.locator('#userPassword')).toHaveAttribute('type', 'password');
  });

  test('TC_008 - Logout', async ({ page }) => {
    await page.locator('#userEmail').fill(validUser.username);
    await page.locator('#userPassword').fill(validUser.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/#\/dashboard\/dash/);

    await page.getByRole('button', { name: 'Sign Out' }).click();

    await expect(page).toHaveURL(/#\/auth\/login/);
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });
});
