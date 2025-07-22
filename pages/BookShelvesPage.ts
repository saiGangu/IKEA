import { Page, Locator } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import convertToCSV from "../utils/converttoCSV";
import getTimestamp from "../utils/getTimestamp";

export class BookshelvesPage {
  private page: Page;
  private searchLocator: Locator;
  private productList: Locator;
  private productTitle: Locator;
  private productLink: Locator;
  private showMore: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchLocator = page.locator('//input[@placeholder="What are you looking for?"]');
    this.productList = page.locator('//div[@class="plp-product-list__products "]');
    this.productTitle = page.locator('//div[@class="plp-mastercard__item plp-mastercard__price "]/a/div/div/h3/span[1]');
    this.productLink = page.locator('//div[@class="plp-fragment-wrapper"]/div/div[3]/a');
    this.showMore = page.locator('//span[@class="plp-btn__label" and contains(text(), "Show more")]');
  }

  async clickSearch() {
    await this.searchLocator.click();
  }

  async fill(inputText: string) {
    await this.searchLocator.fill(inputText);
  }

  async submitSearch() {
    await this.page.keyboard.press("Enter");
  }

  async waitForResults(): Promise<boolean> {
    try {
      await this.productList.first().waitFor({ timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  async isShowMoreAvailable(): Promise<boolean> {
    try {
      const isVisible = await this.showMore.isVisible();
      const isDisabled = isVisible ? await this.showMore.isDisabled() : true;
      return isVisible && !isDisabled;
    } catch {
      return false;
    }
  }

  async goToNextPage(): Promise<boolean> {
    try {
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: "load", timeout: 10000 }),
        this.showMore.click(),
      ]);
      return true;
    } catch {
      return false;
    }
  }

  async getDetails(): Promise<{ title: string | null; link: string | null }[]> {
    const titles = await this.productTitle.all();
    const links = await this.productLink.all();
    const details: { title: string | null; link: string | null }[] = [];

    for (let i = 0; i < titles.length; i++) {
      const title = await titles[i].textContent();
      const link = await links[i].getAttribute("href");
      details.push({ title, link });
    }

    return details;
  }

  async clickNextButton(maxPages: number = 1): Promise<number> {
    const allDetails: { title: string | null; link: string | null }[] = [];
    let pagesClicked = 0;

    while (pagesClicked < maxPages) {
      if (this.page.isClosed()) break;

      const hasResults = await this.waitForResults();
      if (!hasResults) break;

      const details = await this.getDetails();
      allDetails.push(...details);

      const canClick = await this.isShowMoreAvailable();
      if (!canClick) break;

      const wentNext = await this.goToNextPage();
      if (!wentNext) break;

      pagesClicked++;
    }

    const csvData = convertToCSV(allDetails);
    const timestamp = getTimestamp();
    const filePath = path.join(__dirname, "..", "output", `bookshelves_${timestamp}.csv`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, csvData, "utf8");

    return pagesClicked;
  }
}
