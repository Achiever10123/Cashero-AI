const { test, expect } = require("@playwright/test");

test("decrypts saved data in a new app session", async ({ page, context }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#stat-grid .stat-card")).toHaveCount(5);

  await page.evaluate(() => {
    window.CasheroStorage.writeJSON("cashero_storage_test", {
      entries: ["saved across sessions"],
    });
  });
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("cashero_storage_test")),
    )
    .toMatch(/^enc:/);

  const freshPage = await context.newPage();
  await freshPage.goto("/", { waitUntil: "domcontentloaded" });
  await expect(freshPage.locator("#stat-grid .stat-card")).toHaveCount(5);
  await expect
    .poll(() =>
      freshPage.evaluate(() =>
        window.CasheroStorage.readJSON("cashero_storage_test"),
      ),
    )
    .toEqual({ entries: ["saved across sessions"] });
  expect(
    await freshPage.evaluate(() =>
      sessionStorage.getItem("cashero_vault_key"),
    ),
  ).toBeNull();
});

test("does not overwrite encrypted data if its key cannot be recovered", async ({
  page,
}) => {
  const encrypted = `enc:${JSON.stringify({
    v: 1,
    iv: "AAAAAAAAAAAAAAAA",
    ct: "AAAA",
  })}`;
  await page.addInitScript((value) => {
    localStorage.setItem("cashero_v2", value);
  }, encrypted);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#cashero-error-notice")).toContainText(
    "Your saved data has been left untouched",
  );
  expect(
    await page.evaluate(() => localStorage.getItem("cashero_v2")),
  ).toBe(encrypted);
  expect(
    await page.evaluate(
      () =>
        new Promise((resolve, reject) => {
          const request = indexedDB.open("cashero_storage", 1);
          request.onsuccess = () => {
            const transaction = request.result.transaction("keys", "readonly");
            const keyRequest = transaction
              .objectStore("keys")
              .get("vault");
            keyRequest.onsuccess = () => resolve(keyRequest.result || null);
            keyRequest.onerror = () => reject(keyRequest.error);
          };
          request.onerror = () => reject(request.error);
        }),
    ),
  ).toBeNull();
  await expect(page.locator("#stat-grid .stat-card")).toHaveCount(0);
});
