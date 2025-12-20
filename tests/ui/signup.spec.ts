import { test, expect } from '@playwright/test';
import { SignupPage } from '../../pages/signup.page';
import { BasePage } from '../../pages/base.page';

test('signup flow', async ({ page }) => {
    const signupPage = new SignupPage(page);
    const basePage = new BasePage(page);

    await signupPage.goto();
    await signupPage.startSignup();
    await signupPage.fillAccountDetails();
    await signupPage.submitAccount();
    await signupPage.verifyAccountCreated();
    await signupPage.continueAfterSignup(); 
    await basePage.verifyLoggedInAsUsername();
    
})