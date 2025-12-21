import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import data from '../utils/testData.json';

const REG_EMAIL = process.env.REG_EMAIL;
const REG_PASSWORD = process.env.LOG_PASSWORD;

export class SignupPage extends BasePage{
  readonly signupLoginLink: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly signupButton: Locator;
  readonly titleMrRadio: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileInput: Locator;
  readonly createAccountButton: Locator;
  readonly continueLink: Locator;
    readonly accountCreatedHeader: Locator;
    readonly loggedInAsUsername: Locator;

  constructor(page: Page) {
    super(page);

    this.signupLoginLink = page.getByRole('listitem').filter({ hasText: 'Signup / Login' });
    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    this.emailInput = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address');
    this.signupButton = page.getByRole('button', { name: 'Signup' });

    this.titleMrRadio = page.getByRole('radio', { name: 'Mr.' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First name *' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name *' });
    this.addressInput = page.getByRole('textbox', { name: 'Address * (Street address, P.' });
    this.countrySelect = page.getByLabel('Country *');
    this.stateInput = page.getByRole('textbox', { name: 'State *' });
    this.cityInput = page.getByRole('textbox', { name: 'City * Zipcode *' });
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileInput = page.getByRole('textbox', { name: 'Mobile Number *' });
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    this.accountCreatedHeader = page.getByText('Account Created!');
    this.continueLink = page.getByRole('link', { name: 'Continue' });
    this.loggedInAsUsername = page.locator('li a b');

  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'load', timeout: 90000 });
  }

  async startSignup() {
    const random3Digit = Math.floor(100 + Math.random() * 900);

    await this.expectVisible(this.signupLoginLink);
    await this.clickLoctor(this.signupLoginLink);
    await this.expectVisible(this.nameInput);
    await this.nameInput.fill(data.name);
    await this.expectVisible(this.emailInput);
    await this.emailInput.fill(REG_EMAIL as string + random3Digit + '@u.com');
    await this.expectVisible(this.signupButton);
    await this.clickLoctor(this.signupButton);
    await this.waitForNetworkIdle();
  }

  async fillAccountDetails() {
    await this.titleMrRadio.check({timeout: 10000});
    await this.passwordInput.fill(REG_PASSWORD as string);
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.addressInput.fill(data.address);
    await this.countrySelect.selectOption(data.country);
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipcodeInput.fill(data.zipcode);
    await this.mobileInput.fill(data.mobile);
  }

  async submitAccount() {
    await this.clickLoctor(this.createAccountButton);
    await this.waitForNetworkIdle();
  }
 
  async verifyAccountCreated() {
    await this.verifyURL('/account_created')
    await this.expectVisible(this.accountCreatedHeader)
    await this.expectVisible(this.continueLink)
    await this.waitForNetworkIdle();
  }

  async continueAfterSignup() {
    await this.clickLoctor(this.continueLink);
    await this.verifyURL('/');
  }

}
