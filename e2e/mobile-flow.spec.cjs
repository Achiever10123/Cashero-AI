const { test, expect } = require("@playwright/test");

const viewports = [
  { name: "small portrait phone", width: 360, height: 800 },
  { name: "standard portrait phone", width: 390, height: 844 },
  { name: "phone landscape", width: 844, height: 390 },
];

for (const viewport of viewports) {
  test(`supports the expense flow on a ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.route("https://**/*", (route) => route.abort());
    await page.route("**/api/random-quote", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([{ q: "Keep going.", a: "Cashero test" }]),
      }),
    );
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#stat-grid .stat-card")).toHaveCount(5);

    if (viewport.width <= 480) {
      await page.locator("#mobile-nav-toggle").click();
    }
    await page.getByRole("button", { name: "Add Expense", exact: true }).click();
    if (viewport.width <= 480) {
      await expect(page.locator("#sidebar")).not.toHaveClass(/expanded/);
    }
    await expect(page.locator("#page-add")).toBeVisible();
    if (viewport.width <= 480) {
      const fieldHeight = await page.locator("#f-amount").evaluate((input) =>
        input.getBoundingClientRect().height,
      );
      expect(fieldHeight).toBeGreaterThanOrEqual(44);
    }
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
    await page.locator("#f-note").fill("Mobile lunch");
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

    if (viewport.width <= 480) {
      await page.locator("#mobile-nav-toggle").click();
    }
    await page.getByRole("button", { name: "History", exact: true }).click();
    await expect(page.locator("#history-list .tx-name")).toHaveText(
      "Mobile lunch",
    );

    const layout = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      pageWidth: document.querySelector(".page.active").clientWidth,
      pageScrollWidth: document.querySelector(".page.active").scrollWidth,
    }));
    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.pageScrollWidth).toBeLessThanOrEqual(layout.pageWidth);
  });
}
