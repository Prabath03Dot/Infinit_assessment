import { test, expect } from '@playwright/test';
import data from '../../utils/testData.json';
import { LoginPage } from '../../pages/login.page';
import { BasePage } from '../../pages/base.page';

const LOG_EMAIL = process.env.LOG_EMAIL;
const LOG_PASSWORD = process.env.LOG_PASSWORD;

test('login flow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const basePage = new BasePage(page);

    await loginPage.goto();
    await loginPage.login(LOG_EMAIL as string, LOG_PASSWORD as string);
    await basePage.verifyLoggedInAsUsername();
})

