import assert from "node:assert/strict";
import test from "node:test";
import { APILogger, fetchAPI } from "../modules/api.js";

async function withMockFetch(fetchMock, callback) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = fetchMock;
  APILogger.clear();
  try {
    await callback();
  } finally {
    globalThis.fetch = originalFetch;
    APILogger.clear();
  }
}

test("fetchAPI parses JSON and logs successful requests", async () => {
  await withMockFetch(
    async () => ({
      ok: true,
      status: 200,
      text: async () => '{"result":"ok"}',
    }),
    async () => {
      assert.deepEqual(await fetchAPI("/api/test"), { result: "ok" });
      assert.equal(APILogger.getLogs().length, 1);
      assert.equal(APILogger.getLogs()[0].status, 200);
      assert.equal(APILogger.getLogs()[0].method, "GET");
    },
  );
});

test("fetchAPI reports structured HTTP errors once with response details", async () => {
  await withMockFetch(
    async () => ({
      ok: false,
      status: 422,
      statusText: "Unprocessable Entity",
      text: async () => '{"error":{"message":"Invalid amount"}}',
    }),
    async () => {
      await assert.rejects(fetchAPI("/api/test"), (error) => {
        assert.equal(error.message, "Invalid amount");
        assert.equal(error.status, 422);
        assert.deepEqual(error.data, { error: { message: "Invalid amount" } });
        return true;
      });

      const logs = APILogger.getLogs();
      assert.equal(logs.length, 1);
      assert.equal(logs[0].status, 422);
      assert.equal(logs[0].errorDetails.error.message, "Invalid amount");
    },
  );
});

test("fetchAPI logs malformed successful responses and network failures", async () => {
  await withMockFetch(
    async () => ({
      ok: true,
      status: 200,
      text: async () => "not-json",
    }),
    async () => {
      await assert.rejects(fetchAPI("/api/test"), SyntaxError);
      assert.equal(APILogger.getLogs()[0].status, 200);
      assert.match(APILogger.getLogs()[0].error, /JSON|position/i);
    },
  );

  await withMockFetch(
    async () => {
      throw new TypeError("Network unavailable");
    },
    async () => {
      await assert.rejects(fetchAPI("/api/test"), /Network unavailable/);
      assert.equal(APILogger.getLogs().length, 1);
      assert.equal(APILogger.getLogs()[0].status, 0);
      assert.equal(APILogger.getLogs()[0].isNetworkError, true);
    },
  );
});
