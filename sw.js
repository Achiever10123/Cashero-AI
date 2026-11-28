const CACHE_NAME = "cashero-static-v2.1.0";
const RUNTIME_CACHE = "cashero-runtime-v2.1.0";
// External origin lists for runtime caching
// NOTE: AI API origins (openrouter.ai, api.openai.com) are intentionally excluded.
// Caching AI responses could serve stale financial advice silently.
const EXTERNAL_RUNTIME_ORIGINS = new Set([
  // Add non-AI real-time origins here if needed
]);
const EXTERNAL_CACHE_FIRST_ORIGINS = new Set([
  "https://cdn.jsdelivr.net",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
  "https://kit.fontawesome.com",
  "https://ka-f.fontawesome.com",
]);
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/main.js",
  "/modules/api.js",
  "/modules/bootstrap.js",
  "/modules/components/daily-quote.js",
  "/modules/components/dashboard.js",
  "/modules/components/navigation.js",
  "/modules/components/notification-panel.js",
  "/modules/components/toast.js",
  "/modules/daily-quote.js",
  "/modules/data-features.mjs",
  "/modules/errors.js",
  "/modules/pwa-install.js",
  "/modules/storage.js",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/assets/site.webmanifest",
  "/asset-manifest.json",
  "/assets/favicon/favicon.ico",
  "/assets/favicon/favicon-16x16.png",
  "/assets/favicon/favicon-32x32.png",
];

function fetchAndCache(request) {
  return fetch(request).then((response) => {
    if (!response.ok) return response;
    return caches
      .open(CACHE_NAME)
      .then((cache) => cache.put(request, response.clone()))
      .then(
        () => response,
        () => response,
      );
  });
}

function matchStatic(request) {
  return caches.open(CACHE_NAME).then((cache) =>
    cache.match(request, { ignoreVary: true }),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(CORE_ASSETS);

      const manifestResponse = await cache.match("/asset-manifest.json");
      if (!manifestResponse) {
        throw new Error("The production asset manifest was not cached.");
      }

      const manifest = await manifestResponse.json();
      const buildAssets = new Set();
      for (const entry of Object.values(manifest)) {
        for (const asset of [
          entry.file,
          ...(entry.css || []),
          ...(entry.assets || []),
        ]) {
          if (typeof asset === "string") {
            const url = new URL(asset, self.location.origin);
            if (url.origin === self.location.origin) {
              buildAssets.add(url.href);
            }
          }
        }
      }

      await cache.addAll([...buildAssets]);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Only handle GET requests in SW caching logic
  if (req.method !== "GET") return;

  // Serve cached documents immediately; the worker version controls updates.
  if (
    req.mode === "navigate" ||
    req.headers.get("accept")?.includes("text/html")
  ) {
    event.respondWith(
      matchStatic(req).then((cached) => {
        if (cached) return cached;

        return fetchAndCache(req).catch(async (error) => {
          const fallback = await matchStatic("/index.html");
          if (fallback) return fallback;
          throw error;
        });
      }),
    );
    return;
  }
  // Runtime caching for API / JSON requests (network-first fallback to cache)
  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  if (isSameOrigin && url.pathname === "/api/random-quote") {
    return;
  }
  const acceptsJSON = req.headers.get("accept")?.includes("application/json");
  const isApi = isSameOrigin && url.pathname.startsWith("/api");
  const isExternalRuntime = EXTERNAL_RUNTIME_ORIGINS.has(url.origin);
  const isExternalCacheFirst = EXTERNAL_CACHE_FIRST_ORIGINS.has(url.origin);

  if (isApi || acceptsJSON || isExternalRuntime) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((r) => r)),
    );
    return;
  }
  // External cache-first origins (fonts, cdn)
  if (isExternalCacheFirst) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((res) => {
            if (res && res.status === 200) {
              const copy = res.clone();
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
            }
            return res;
          })
          .catch(() => cached);
      }),
    );
    return;
  }

  if (!isSameOrigin) return;

  // Serve cached same-origin assets immediately.
  event.respondWith(
    matchStatic(req).then((cached) => cached || fetchAndCache(req)),
  );
});

// Listen for skip waiting message from the page to activate new worker immediately
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
