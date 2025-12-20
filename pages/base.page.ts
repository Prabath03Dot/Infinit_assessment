import { expect, type Page , Locator} from '@playwright/test';
import data from '../utils/testData.json';

export class BasePage {
  protected readonly page: Page;
  readonly loggedInAsUsername: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loggedInAsUsername = page.locator('li a b');
  }

  async waitForNetworkIdle(timeout = 90000) {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  async expectVisible(locator: Locator) {
    await expect(locator).toBeVisible({ timeout: 90000 });
  }

  async clickLoctor(locator: Locator) {
    await this.expectVisible(locator);
    await locator.click({ timeout: 90000 });
  }

  async verifyURL(expectedUrl: string) {
    await expect(this.page).toHaveURL(expectedUrl, { timeout: 90000 });
  }

  async verifyLoggedInAsUsername() {
    await this.expectVisible(this.loggedInAsUsername);
    await expect(this.loggedInAsUsername).toHaveText(data.name, { timeout: 90000 });
  }

}
