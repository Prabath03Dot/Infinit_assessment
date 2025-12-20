import { test, expect } from '@playwright/test';
import data from '../../utils/testData.json';
import { ProductPage } from '../../pages/product.page';
import { BasePage } from '../../pages/base.page';

test.beforeEach(async ({page}) => {
    await page.goto('/');

    await page.route('**/*', (route) => {
        const url = route.request().url();
        if (url.includes('googleads') || url.includes('pagead2')) {
            return route.abort();
        }
        route.continue();
    });

})

test('search & add to cart', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.openProducts();
    await productPage.searchProduct(data.productName);
    await productPage.verifySearchedProduct(data.productName);
    await productPage.addProductToCart();
    await productPage.verifyProductAdded();
    await productPage.continiueShopping();

})

test('single product checkout', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.openProducts();
    await productPage.selectProductByName(data.productName);
    await productPage.verifyProductAdded();
    await productPage.viewCart();
    await productPage.verifyCartItems([data.productName]);

})

test('Multiple product checkout', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.openProducts();
    // await productPage.countProducts();

    await productPage.selectProductByName(data.productName);
    await productPage.verifyProductAdded();
    await productPage.continiueShopping();    
    
    await productPage.selectProductByName(data.productName2);
    await productPage.verifyProductAdded();

    await productPage.viewCart();
    await productPage.verifyCartItems([data.productName, data.productName2]);

})

test('dynamic product checkout', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.openProducts();
    const productInfoTextContent = await productPage.selectProductByIndex(0);
    await productPage.verifyProductAdded();
    await productPage.viewCart();
    await productPage.verifyCartItems([productInfoTextContent]);

})

test('empty product checkout', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.openProducts();
    // await productPage.countProducts();

    await productPage.selectProductByName(data.productName);
    await productPage.verifyProductAdded();
    await productPage.continiueShopping();    
    
    await productPage.selectProductByName(data.productName2);
    await productPage.verifyProductAdded();

    await productPage.viewCart();
    await productPage.verifyCartItems([data.productName, data.productName2]);

    await productPage.deleteAllCartItems();
    await productPage.verifyEmptyCart();

})