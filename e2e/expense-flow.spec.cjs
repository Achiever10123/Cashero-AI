const { test, expect } = require("@playwright/test");

test("adds an expense and restores it from local storage after reload", async ({
  page,
}) => {
  await page.route("**/api/random-quote", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ q: "Keep going.", a: "Cashero test" }]),
    }),
  );
  await page.goto("/");
  await expect(page.locator("#stat-grid .stat-card")).toHaveCount(5);

  await page.getByRole("button", { name: "Add Expense", exact: true }).click();
  await page.locator("#f-amount").fill("12.34");
  await page.locator("#f-cat").selectOption({ label: "Food & Dining" });
  await page.locator("#f-date").fill(
    await page.evaluate(() => {
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${today.getFullYear()}-${month}-${day}`;
    }),
  );
  await page.locator("#f-note").fill("E2E lunch");
  await page.locator("#f-tags").fill("work, lunch");
  await page
    .locator("#page-add")
    .getByRole("button", { name: "Add Expense" })
    .click();

  await expect(page.getByText("Expense added")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("cashero_v2")),
    )
    .toMatch(/^enc:/);

  await page.getByRole("button", { name: "History", exact: true }).click();
  await expect(page.locator("#history-list .tx-name")).toHaveText("E2E lunch");
  await expect(page.locator("#history-list .tx-amount")).toHaveText("$12.34");
  await expect(page.locator("#history-list .tx-tag")).toHaveText([
    "work",
    "lunch",
  ]);

  await page.reload();
  await expect(page.locator("#stat-grid .stat-card")).toHaveCount(5);
  await page.getByRole("button", { name: "History", exact: true }).click();
  await expect(page.locator("#history-list .tx-name")).toHaveText("E2E lunch");
  await expect(page.locator("#history-list .tx-amount")).toHaveText("$12.34");
});
