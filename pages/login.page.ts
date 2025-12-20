import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import data from '../utils/testData.json';

export class LoginPage extends BasePage{
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        super(page);

        this.emailInput = page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address');
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' })

    }

    async goto(){
        await this.page.goto('/login', { waitUntil: 'load', timeout: 90000 });
    }

    async login(email : string, password: string){
        await this.expectVisible(this.emailInput);
        await this.emailInput.fill(email);
        await this.expectVisible(this.passwordInput);
        await this.passwordInput.fill(password);
        await this.expectVisible(this.loginButton);
        await this.clickLoctor(this.loginButton);
    }
    
}