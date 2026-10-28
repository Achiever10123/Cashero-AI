const APILogger = {
  logs: [],
  maxLogs: 50,

  log(endpoint, status, duration, error = null, details = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      endpoint,
      status,
      duration: `${duration}ms`,
      error: error ? error.message : null,
      stack: error ? error.stack : null,
      ...details,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) this.logs.shift();

    if (error || status >= 400) {
      console.error(`[API ERROR] ${endpoint}`, {
        status,
        duration: `${duration}ms`,
        error: error?.message,
        details,
      });
    }

    return entry;
  },

  getLogs() {
    return [...this.logs];
  },

  getLastError() {
    return [...this.logs]
      .reverse()
      .find((log) => log.error || log.status >= 400);
  },

  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  },

  clear() {
    this.logs = [];
  },
};

export { APILogger };

export async function fetchAPI(endpoint, options = {}) {
  const startTime = performance.now();
  const method = options.method || "GET";

  try {
    const response = await fetch(endpoint, options);
    const duration = Math.round(performance.now() - startTime);
    const responseText = await response.text();
    let data = null;

    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        if (response.ok) throw parseError;
        data = {
          message: response.statusText || `HTTP ${response.status}`,
        };
      }
    }

    if (!response.ok) {
      const error = new Error(
        data?.error?.message || data?.message || `HTTP ${response.status}`,
      );
      error.status = response.status;
      error.data = data;

      APILogger.log(endpoint, response.status, duration, error, {
        method,
        errorDetails: data,
      });
      throw error;
    }

    APILogger.log(endpoint, response.status, duration, null, { method });
    return data;
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);

    const requestError =
      error instanceof Error ? error : new Error(String(error));
    if (!requestError.status) {
      APILogger.log(endpoint, 0, duration, requestError, {
        method,
        isNetworkError: requestError instanceof TypeError,
      });
    }

    throw requestError;
  }
}
