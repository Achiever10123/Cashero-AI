const assert = require("node:assert/strict");
const test = require("node:test");
const handler = require("../api/random-quote.js");

function createResponse() {
  return {
    headers: {},
    statusCode: null,
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test("proxies a validated random ZenQuotes response without caching", async () => {
  const originalFetch = global.fetch;
  const quote = [{ q: "Keep going.", a: "Unknown" }];
  let fetchUrl;
  let fetchOptions;
  global.fetch = async (url, options) => {
    fetchUrl = url;
    fetchOptions = options;
    return { ok: true, status: 200, json: async () => quote };
  };

  try {
    const response = createResponse();
    await handler({ method: "GET" }, response);

    assert.equal(fetchUrl, "https://zenquotes.io/api/random");
    assert.equal(fetchOptions.cache, "no-store");
    assert.equal(response.statusCode, 200);
    assert.equal(response.headers["Cache-Control"], "no-store, max-age=0");
    assert.deepEqual(response.body, quote);
  } finally {
    global.fetch = originalFetch;
  }
});

test("rejects non-GET requests", async () => {
  const response = createResponse();
  await handler({ method: "POST" }, response);

  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.Allow, "GET");
});
