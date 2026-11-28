const { test, expect } = require("@playwright/test");

test.use({ serviceWorkers: "allow" });

test("installs a complete app shell and opens it offline", async ({
  page,
  context,
}) => {
  const pageErrors = [];
  const failedRequests = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (request) =>
    failedRequests.push(`${request.url()}: ${request.failure()?.errorText}`),
  );
  await page.route("https://**/*", (route) => route.abort());

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#stat-grid .stat-card")).toHaveCount(5);

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect
    .poll(() =>
      page.evaluate(() => Boolean(navigator.serviceWorker.controller)),
    )
    .toBe(true);

  const cachedAssets = await page.evaluate(async () => {
    const cacheNames = await caches.keys();
    const appCacheName = cacheNames.find((name) =>
      name.startsWith("cashero-static-"),
    );
    if (!appCacheName) throw new Error("The app shell cache was not installed.");

    const cache = await caches.open(appCacheName);
    const requiredAssets = [
      "/",
      "/index.html",
      "/main.js",
      "/modules/bootstrap.js",
      "/modules/pwa-install.js",
      "/modules/storage.js",
      "/assets/site.webmanifest",
      "/favicon.ico",
      "/apple-touch-icon.png",
      "/android-chrome-192x192.png",
      "/android-chrome-512x512.png",
      "/assets/favicon/favicon-16x16.png",
      "/assets/favicon/favicon-32x32.png",
    ];
    const manifestResponse = await fetch("/asset-manifest.json");
    const manifest = await manifestResponse.json();
    for (const entry of Object.values(manifest)) {
      requiredAssets.push(
        entry.file,
        ...(entry.css || []),
        ...(entry.assets || []),
      );
    }
    return Promise.all(
      [...new Set(requiredAssets)].map(async (path) => {
        const response = await cache.match(new URL(path, location.origin));
        return { path, cached: Boolean(response && response.ok) };
      }),
    );
  });
  expect(cachedAssets.filter((asset) => !asset.cached)).toEqual([]);

  const icons = await page.evaluate(async () => {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    const manifestResponse = await fetch(manifestLink.href);
    const manifest = await manifestResponse.json();
    const iconPaths = [
      ...manifest.icons.map((icon) => icon.src),
      document
        .querySelector('link[rel="apple-touch-icon"]')
        .getAttribute("href"),
      document
        .querySelector('link[rel="icon"][sizes="32x32"]')
        .getAttribute("href"),
      document.querySelector('meta[name="msapplication-TileImage"]').content,
    ];
    return Promise.all(
      [...new Set(iconPaths)].map(async (path) => {
        const response = await fetch(new URL(path, location.href));
        return {
          path,
          ok: response.ok,
          contentType: response.headers.get("content-type"),
        };
      }),
    );
  });
  expect(
    icons.filter(
      (icon) => !icon.ok || !icon.contentType?.startsWith("image/"),
    ),
  ).toEqual([]);

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const offlineStats = await page
    .locator("#stat-grid .stat-card")
    .count();
  expect(offlineStats, JSON.stringify({ pageErrors, failedRequests })).toBe(5);
});