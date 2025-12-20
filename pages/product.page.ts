import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import data from '../utils/testData.json';

export class ProductPage extends BasePage{
  readonly productsLink: Locator;
  readonly allProductsHeader: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productName: Locator;
  readonly addToCartButton: Locator;
  readonly addedToCartMessage: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartLink: Locator;
    readonly cartInfoGrid: Locator;
    readonly singleProducts: Locator;
    readonly cartLink: Locator;
    readonly emptyCartMessage: Locator;
    readonly deleteCartItemButton: Locator;
    readonly addToCartButtonSelector: string;

  constructor(page: Page) {
    super(page);

    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.allProductsHeader = page.getByRole('heading', { name: 'All Products' });
    this.searchInput = page.getByRole('textbox', { name: 'Search Product' });
    this.searchButton = page.locator('#submit_search');

    this.productName = page.locator('.productinfo p');
    // this.addToCartButton = page.getByText('Add to cart').first();
    this.addToCartButton = page.getByText('Add to cart').nth(1);

    this.addedToCartMessage = page.getByText('Your product has been added');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping',});
    this.viewCartLink = page.getByRole('link', { name: 'View Cart' });
    this.cartInfoGrid = page.locator('#cart_info');
    this.singleProducts = page.locator('.single-products');
    this.cartLink = page.getByRole('link', { name: ' Cart' });
    this.emptyCartMessage = page.getByText('Cart is empty! Click here to');
    this.deleteCartItemButton = page.locator('.cart_quantity_delete');
    this.addToCartButtonSelector = 'a.add-to-cart';

  }

  async openProducts() {
    await this.clickLoctor(this.productsLink);
    await this.expectVisible(this.allProductsHeader);
  }

  async searchProduct(productName: string) {
    await this.page.waitForLoadState('load');
    await this.waitForNetworkIdle();
    await this.expectVisible(this.searchInput);
    await this.searchInput.fill(data.productName);
    await this.expectVisible(this.searchButton);
    await this.clickLoctor(this.searchButton);
    await this.page.waitForLoadState('load');
    await this.waitForNetworkIdle();
  }

  async verifySearchedProduct(expectedProductName: string) {
    await this.page.waitForLoadState('load');
    await this.waitForNetworkIdle();
    await this.expectVisible(this.productName);
    await expect(this.productName).toContainText(expectedProductName);

}

  async addProductToCart() {
    await this.waitForNetworkIdle();
    await this.productName.hover({timeout: 90000});
    await this.expectVisible(this.productName);
    console.log('Product: ' + await this.productName.textContent());

    await this.expectVisible(this.addToCartButton);
    await this.clickLoctor(this.addToCartButton);
    await this.waitForNetworkIdle();
  }

  async verifyProductAdded() {
    await this.waitForNetworkIdle();
    await this.expectVisible(this.addedToCartMessage);
  }

  async continiueShopping() {
    await this.expectVisible(this.continueShoppingButton);
    await this.clickLoctor(this.continueShoppingButton);
    await this.waitForNetworkIdle();
  }

  async viewCart() {
    await this.waitForNetworkIdle();
    await this.expectVisible(this.viewCartLink);
    await this.clickLoctor(this.viewCartLink);
    await this.verifyURL('/view_cart')
  }

  async verifyCartItems(productNames: string[]){
    await this.waitForNetworkIdle();
    await this.expectVisible(this.cartInfoGrid);

    const cartProductText = await this.cartInfoGrid.innerText();
    console.log('Cart Info: ' + cartProductText);

    for(const product of productNames){
        await expect(this.cartInfoGrid).toContainText(product, { timeout: 10000 });
    }

  }

async countProducts(){
        const products = await this.singleProducts;

        const productCount = await products.count();
        console.log('Total products:', productCount);

        const productNames = await this.page.locator('.single-products .productinfo p').allTextContents();

        console.log('Product Names List:');
        console.log(productNames);

    }

    async selectProductByIndex(index: number) {
        const product = await this.singleProducts.nth(index);

        const productInfo = await product.locator('.productinfo p');
        console.log('Selected Product: ' + await productInfo.textContent());
        const productInfoTextContent = await productInfo.innerText();

        await product.waitFor({ state: 'visible'});
        await this.waitForNetworkIdle();
        await product.scrollIntoViewIfNeeded();
        await this.page.waitForLoadState('load');
        await this.waitForNetworkIdle();
        await product.hover();
        await this.page.waitForLoadState('load');
        await this.waitForNetworkIdle();
        await product.locator(this.addToCartButton).click({timeout: 90000});

        return productInfoTextContent;
    }

    async selectProductByName(productName: string) {
      await this.page.waitForLoadState('load');
        await this.waitForNetworkIdle();
        const product = await this.singleProducts.filter({ hasText: productName });
        await product.waitFor({ state: 'visible' });
        await product.scrollIntoViewIfNeeded();
        await this.page.waitForLoadState('load');
        await product.hover();
        await this.page.waitForLoadState('load');
        await this.waitForNetworkIdle();
        await product.locator(this.addToCartButton).click({timeout: 90000});
    }

    async goToCartPage() {
        await this.clickLoctor(this.cartLink);
        await this.verifyURL('/view_cart');
    }

    async deleteAllCartItems() {
    await this.waitForNetworkIdle();

    const deleteButtons = this.deleteCartItemButton;

    while (await deleteButtons.count() > 0) {
      await this.page.waitForLoadState('load');
      await this.waitForNetworkIdle();
        await deleteButtons.first().click({ force: true });
        await this.page.waitForLoadState('load');
        await this.waitForNetworkIdle();
    }
    }


    async verifyEmptyCart() {
        await this.expectVisible(this.emptyCartMessage);
    }



}