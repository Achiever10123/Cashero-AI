const { test, expect } = require("@playwright/test");

test.use({ serviceWorkers: "allow" });

test("mobile notification permission and system alerts use the service worker", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("https://**/*", (route) => route.abort());
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "userAgent", {
      configurable: true,
      value:
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36",
    });

    window.__systemNotifications = [];
    Object.defineProperty(window, "Notification", {
      configurable: true,
      value: class MockNotification {
        static get permission() {
          return (
            sessionStorage.getItem("test-notification-permission") || "default"
          );
        }

        static async requestPermission() {
          sessionStorage.setItem("test-notification-permission", "granted");
          return "granted";
        }
      },
    });
    ServiceWorkerRegistration.prototype.showNotification = async function (
      title,
      options,
    ) {
      window.__systemNotifications.push({ title, options });
    };
  });

  page.on("pageerror", (error) =>
    console.error("Mobile notification page error:", error),
  );
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#stat-grid .stat-card")).toHaveCount(5);
  await page.locator("#pwa-install-dismiss").click();
  await page.getByRole("button", { name: "Open notifications" }).click();
  await page.locator("#notif-perm-btn").click();
  await expect(page.locator("#notif-perm-btn")).toHaveText(
    "Notifications Enabled",
  );

  const now = new Date();
  await page.evaluate((date) => {
    window.CasheroStorage.writeJSON("cashero_v2", {
      expenses: [
        {
          id: 1,
          date,
          amount: 85,
          category: "Food & Dining",
          note: "Mobile notification test",
          tags: [],
        },
      ],
      payouts: [
        {
          id: 2,
          amount: 100,
          month: Number(date.slice(5, 7)) - 1,
          year: Number(date.slice(0, 4)),
          note: "",
        },
      ],
      goals: [],
      recurring: [],
      currency: "USD",
    });
  }, now.toISOString().slice(0, 10));
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("cashero_v2")))
    .toMatch(/^enc:/);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#stat-grid .stat-card")).toHaveCount(5);
  await page.locator("#pwa-install-dismiss").click();
  await page.getByRole("button", { name: "Open notifications" }).click();
  await expect(page.locator("#notif-list")).toContainText(
    "spent 80% of your",
  );
  await expect
    .poll(() => page.evaluate(() => window.__systemNotifications))
    .toContainEqual(
      expect.objectContaining({
        title: "Budget Alert",
        options: expect.objectContaining({
          icon: "/android-chrome-192x192.png",
          badge: "/android-chrome-192x192.png",
        }),
      }),
    );
});
