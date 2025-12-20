import { test, expect } from '@playwright/test';
import data from '../../utils/testData.json';
import { LoginPage } from '../../pages/login.page';
import { BasePage } from '../../pages/base.page';

test('login flow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const basePage = new BasePage(page);

    await loginPage.goto();
    await loginPage.login(data.log_email, data.password);
    await basePage.verifyLoggedInAsUsername();
})