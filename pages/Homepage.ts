import { Page, Locator, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import convertToCSV from "../utils/converttoCSV";
import getTimestamp from "../utils/getTimestamp";

export class Homepage {
  private page: Page;
  private url: string;
  private searchBar: Locator;
  private gift: Locator;
  private collections: Locator;

  constructor(page: Page) {
    this.page = page;
    this.url = "https://www.ikea.com/in/en/";
    this.searchBar = page.locator("#ikea-search-input");
    this.gift = page.locator(
      'a[href="https://www.ikea.com/in/en/customer-service/ikea-gift-cards-pub004138e1/"]'
    );
    this.collections = page.locator(
      '//div[contains(@id,"hnf-carousel__tabs-navigation-products")]/div/a/span'
    );
  }

  async navigate() {
    await this.page.goto(this.url);
    await expect(this.page).toHaveTitle(
      "IKEA India-Affordable home furniture, designs & ideas - IKEA"
    );
  }

  async getCollections() {
    const count = await this.collections.count();
    const data: { name: string }[] = [];

    for (let i = 0; i < count; i++) {
      const text = await this.collections.nth(i).textContent();
      if (text) {
        data.push({ name: text.trim() });
      }
    }

    const csvContent = convertToCSV(data);
    const filename = `collections_${getTimestamp()}.csv`;

    //  Create 'output' folder if it doesn't exist
    const outputDir = path.join(__dirname, "..", "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    //  Save CSV into the 'output' folder
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, csvContent, "utf8");
  }

  async searchBookShelves() {
    await this.searchBar.click();
    await this.searchBar.fill("BookShelves");
    await this.page.keyboard.press("Enter");
  }

  async searchStudyChair() {
    await this.searchBar.click();
    await this.searchBar.fill("Study Chair");
    await this.page.keyboard.press("Enter");
  }

  async clickOnGift() {
    await this.gift.click();
  }
}
