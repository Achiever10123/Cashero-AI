const { test, expect } = require("@playwright/test");

const AI_ENDPOINT = "https://vercel-deploy-xptk.vercel.app/api/chat";

async function prepareAiPage(page) {
  const requests = [];
  await page.addInitScript(() => {
    let testNow = Date.now();
    Date.now = () => testNow;
    window.setTestNow = (timestamp) => {
      testNow = timestamp;
    };
    window.advanceTestClock = (milliseconds) => {
      testNow += milliseconds;
    };
  });
  await page.route("https://**/*", (route) => route.abort());
  await page.route(AI_ENDPOINT, async (route) => {
    const isCheckin = route
      .request()
      .postData()
      .includes("weekly spending check-in");
    requests.push(isCheckin ? "checkin" : "analysis");
    const content = isCheckin
      ? "Your week looks steady. Watch dining costs. Cook tonight."
      : JSON.stringify({
          verdict: "Your budget is stable.",
          cutbacks: [],
          goal: "Save $100.",
          danger: null,
          quickWins: [],
          projectionNote: "You are on track.",
        });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ choices: [{ message: { content } }] }),
    });
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#stat-grid .stat-card")).toHaveCount(5);

  await page.evaluate(() => {
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    window.CasheroStorage.writeJSON("cashero_v2", {
      expenses: [
        {
          id: 1,
          date,
          amount: 100,
          category: "Food & Dining",
          note: "AI cooldown test",
          tags: [],
        },
      ],
      payouts: [
        {
          id: 2,
          amount: 1000,
          month: now.getMonth(),
          year: now.getFullYear(),
          note: "",
        },
      ],
      goals: [],
      recurring: [],
      currency: "USD",
    });
  });
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("cashero_v2")))
    .toMatch(/^enc:/);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#stat-grid .stat-card")).toHaveCount(5);
  await page.locator('.nav-item[data-page="analysis"]').click();

  return requests;
}

test("analysis starts a shared five-minute cooldown that survives reload", async ({
  page,
}) => {
  const requests = await prepareAiPage(page);
  const analysisButton = page.locator("#analysis-btn");
  const checkinButton = page.locator("#checkin-btn");

  await analysisButton.click();
  await expect.poll(() => requests.length).toBe(1);
  await expect(analysisButton).toBeDisabled();
  await expect(analysisButton).toHaveText(/Analyze \(\d+s\)/);
  await expect(checkinButton).toBeDisabled();
  await expect(checkinButton).toHaveText(/Check-In \(\d+s\)/);
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("cashero_last_analysis")),
    )
    .toMatch(/^enc:/);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#stat-grid .stat-card")).toHaveCount(5);
  await page.locator('.nav-item[data-page="analysis"]').click();
  await expect(analysisButton).toBeDisabled();
  await expect(checkinButton).toBeDisabled();

  await page.evaluate(() => {
    const lastRun = Number(
      window.CasheroStorage.getItem("cashero_last_analysis"),
    );
    window.setTestNow(lastRun + 5 * 60 * 1000 - 1);
    window.startAnalysisCooldown();
  });
  await expect(analysisButton).toBeDisabled();
  await expect(analysisButton).toHaveText("Analyze (1s)");
  await page.evaluate(() => {
    window.advanceTestClock(1);
    window.startAnalysisCooldown();
  });
  await expect(analysisButton).toBeEnabled();
  await expect(checkinButton).toBeEnabled();

  await checkinButton.click();
  await expect.poll(() => requests.length).toBe(2);
  await expect(requests).toEqual(["analysis", "checkin"]);
  await expect(analysisButton).toBeDisabled();
  await expect(checkinButton).toBeDisabled();
});

test("running the check-in also blocks the analysis button", async ({ page }) => {
  const requests = await prepareAiPage(page);
  const analysisButton = page.locator("#analysis-btn");
  const checkinButton = page.locator("#checkin-btn");

  await checkinButton.click();
  await expect.poll(() => requests.length).toBe(1);
  await expect(requests).toEqual(["checkin"]);
  await expect(analysisButton).toBeDisabled();
  await expect(checkinButton).toBeDisabled();
  await expect(analysisButton).toHaveText(/Analyze \(\d+s\)/);
  await expect(checkinButton).toHaveText(/Check-In \(\d+s\)/);
});
