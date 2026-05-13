import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function clickSequence(page: Page, labels: string[]) {
  for (const label of labels) {
    await page.getByRole('button', { name: label }).click();
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.calculator')).toBeVisible();
});

test('renders the default calculator state', async ({ page }) => {
  await expect(page.locator('.calculator')).toHaveScreenshot('calculator-default.png', {
    animations: 'disabled'
  });
});

test('supports addition', async ({ page }) => {
  await clickSequence(page, ['2', '+', '3', '=']);
  await expect(page.locator('.calculator')).toHaveScreenshot('calculator-addition.png', {
    animations: 'disabled'
  });
});

test('supports subtraction', async ({ page }) => {
  await clickSequence(page, ['8', '-', '2', '=']);
  await expect(page.locator('.calculator')).toHaveScreenshot('calculator-subtraction.png', {
    animations: 'disabled'
  });
});

test('supports multiplication', async ({ page }) => {
  await clickSequence(page, ['6', '×', '7', '=']);
  await expect(page.locator('.calculator')).toHaveScreenshot('calculator-multiplication.png', {
    animations: 'disabled'
  });
});

test('supports division', async ({ page }) => {
  await clickSequence(page, ['8', '÷', '2', '=']);
  await expect(page.locator('.calculator')).toHaveScreenshot('calculator-division.png', {
    animations: 'disabled'
  });
});

test('shows divide by zero errors', async ({ page }) => {
  await clickSequence(page, ['5', '÷', '0', '=']);
  await expect(page.locator('.calculator')).toHaveScreenshot('calculator-divide-by-zero.png', {
    animations: 'disabled'
  });
});

test('shows reciprocal errors', async ({ page }) => {
  await clickSequence(page, ['0', '1/x']);
  await expect(page.locator('.calculator')).toHaveScreenshot('calculator-reciprocal-error.png', {
    animations: 'disabled'
  });
});

test('shows localized errors in Spanish', async ({ page }) => {
  await page.getByRole('button', { name: 'ES' }).click();
  await clickSequence(page, ['5', '÷', '0', '=']);
  await expect(page.locator('.calculator')).toHaveScreenshot('calculator-error-es.png', {
    animations: 'disabled'
  });
});

test('shows localized errors in Portuguese', async ({ page }) => {
  await page.getByRole('button', { name: 'PT' }).click();
  await clickSequence(page, ['5', '÷', '0', '=']);
  await expect(page.locator('.calculator')).toHaveScreenshot('calculator-error-pt.png', {
    animations: 'disabled'
  });
});
