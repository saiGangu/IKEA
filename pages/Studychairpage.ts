import { Page, Locator, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import convertToCSV from '../utils/converttoCSV';
import getTimestamp from '../utils/getTimestamp';

export class StudyPage {
  private page: Page;
  private searchBar: Locator;
  private filters: Locator;
  private customerRating: Locator;
  private fourRating: Locator;
  private viewButton: Locator;
  private priceCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBar = page.locator("//input[@id='ikea-search-input']");
    this.filters = page.getByRole("button", { name: "All filters" });
    this.customerRating = page.locator("//span[@id='SEC_RATINGS_title']");
    this.fourRating = page.locator('//div[@id="SEC_RATINGS"]/div/div/fieldset/label[1]/span[1]');
    this.viewButton = page.locator("//button[@aria-label='View 41']");
    this.priceCards = page.locator("[data-testid='plp-product-card']").locator(".plp-mastercard__price");
  }

  async allFilter() {
    await this.filters.click();
  }

  async rating() {
    await this.customerRating.click();
  }

  async checkRating() {
    await this.fourRating.click();
  }

  async viewAll() {
    await this.viewButton.click();
  }

  async chairCards(): Promise<void> {
    const chairProducts: { title: string | null; price: string | null }[] = [];

    for (let i = 0; i < 3; i++) {
      const title = await this.priceCards.nth(i).locator(".plp-price-module__product-name").textContent();
      const price = await this.priceCards.nth(i).locator(".plp-price__sr-text").textContent();
      chairProducts.push({ title, price });
    }

    const csvData = convertToCSV(chairProducts);
    const timestamp = getTimestamp();
    const filePath = path.join(__dirname, '..', 'output', `study-chairs_${timestamp}.csv`);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, csvData, 'utf8');
  }

  async checkAssertions(): Promise<void> {
    await expect(this.page).toHaveURL('https://www.ikea.com/in/en/');
  }
}
