const { test, expect } = require("@playwright/test");

test("shows iPhone install guidance only on smartphones", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "userAgent", {
      configurable: true,
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1",
    });
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const banner = page.locator("#pwa-install-banner");
  await expect(banner).toBeVisible();
  await page.locator("#pwa-install-action").click();
  await expect(page.locator("#pwa-install-help")).toBeVisible();
  await expect(page.locator("#pwa-install-help")).toContainText(
    "In Safari, tap the Share button",
  );
});

test("uses the native install prompt on Android phones", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "userAgent", {
      configurable: true,
      value:
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36",
    });
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#pwa-install-banner")).toBeVisible();
  await page.evaluate(() => {
    const event = new Event("beforeinstallprompt", { cancelable: true });
    event.prompt = async () => {};
    event.userChoice = Promise.resolve({ outcome: "accepted" });
    window.dispatchEvent(event);
  });

  await page.locator("#pwa-install-action").click();
  await expect(page.locator("#pwa-install-banner")).toBeHidden();
});

test("does not show the install banner on desktop", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#pwa-install-banner")).toHaveCount(0);
});
