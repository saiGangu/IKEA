import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Captures a full-page screenshot and stores it with a timestamped filename.
 */
export async function takeTimestampedScreenshot(page: Page, label: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const screenshotDir = path.join(__dirname, '..', 'screenshots');
  const screenshotPath = path.join(screenshotDir, `${label}_${timestamp}.png`);

  fs.mkdirSync(screenshotDir, { recursive: true });
  await page.screenshot({ path: screenshotPath, fullPage: true });
}
