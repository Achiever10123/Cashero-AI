const CACHE_NAME = "cashero-static-v1.1.1";
const RUNTIME_CACHE = "cashero-runtime-v1.1.0";
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
]);
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/main.js",
  "/favicon.ico",
  "/assets/favicon/site.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch(() => {
        // ignore individual failures
      });
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
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Only handle GET requests in SW caching logic
  if (req.method !== "GET") return;

  // For navigation requests prefer network first then cache fallback
  if (
    req.mode === "navigate" ||
    req.headers.get("accept")?.includes("text/html")
  ) {
    event.respondWith(
      fetch(req, { cache: "no-store" })
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match("/index.html")),
        ),
    );
    return;
  }
  // Runtime caching for API / JSON requests (network-first fallback to cache)
  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
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

  // Default: network-first for same-origin assets (js, css, etc.)
  // Cache only serves as offline fallback
  event.respondWith(
    fetch(req, { cache: "no-store" })
      .then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req)),
  );
});

// Listen for skip waiting message from the page to activate new worker immediately
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
