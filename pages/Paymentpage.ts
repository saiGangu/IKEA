import { Page, Locator, expect } from "@playwright/test";
import { takeTimestampedScreenshot } from "../utils/screenshotUtil";

export class PaymentPage {
  private page: Page;
  private debitCard: Locator;
  private selectCardType: Locator;
  private cardNumber: Locator;
  private cardHolderName: Locator;
  private expiryMonth: Locator;
  private expiryYear: Locator;
  private cvv: Locator;
  private payNowButton: Locator;
  private validateCardNumberMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.debitCard = page.locator("#L02");
    this.selectCardType = page.locator("#selectDebitCard");
    this.cardNumber = page.locator("#cardNumber");
    this.cardHolderName = page.locator("#cardHolderName");
    this.expiryMonth = page.locator("#month");
    this.expiryYear = page.locator("#year");
    this.cvv = page.locator("#CVVNumber");
    this.payNowButton = page.locator("#credit_submit");
    this.validateCardNumberMessage = page.locator("//span[text()='Invalid Card Number']");
  }

  async fillCardDetails(cardNum: string, cardName: string, cvv: string) {
    await this.debitCard.click();
    await this.selectCardType.click();
    await this.selectCardType.selectOption("RUPAY");
    await this.cardNumber.fill(cardNum);
    await this.cardHolderName.fill(cardName);
    await this.expiryMonth.selectOption("06");
    await this.expiryYear.selectOption("2027");
    await this.cvv.fill(cvv);
  }

  async submitPayment() {
    await this.payNowButton.click();
  }

  async validateCardNumberError() {
    try {
      await expect(this.validateCardNumberMessage).toHaveText("Invalid Card Number");
      await takeTimestampedScreenshot(this.page, "InvalidCard");
    } catch (error) {
      throw new Error(`Validation failed and screenshot was not captured: ${error}`);
    }
  }
}
