import { APILogger, fetchAPI } from "./api.js";
import { installGlobalErrorHandlers, reportError } from "./errors.js";
import {
  getStorageItem,
  initializeStorage,
  readJSON,
  removeStorageItem,
  setStorageItem,
  writeJSON,
} from "./storage.js";
import { loadDailyQuote, scheduleDailyQuoteRefresh } from "./daily-quote.js";
import {
  decryptBackup,
  encryptBackup,
  filterTransactions,
  normalizeTags,
  paginateItems,
  parseTransactionCSV,
  transactionsToCSV,
  transactionsToExcelXML,
} from "./data-features.mjs";

installGlobalErrorHandlers();

Object.assign(window, {
  fetchAPI,
  CasheroErrors: { reportError },
  CasheroStorage: {
    getItem: getStorageItem,
    initialize: initializeStorage,
    readJSON,
    removeItem: removeStorageItem,
    setItem: setStorageItem,
    writeJSON,
  },
  CasheroDataFeatures: {
    decryptBackup,
    encryptBackup,
    filterTransactions,
    normalizeTags,
    paginateItems,
    parseTransactionCSV,
    transactionsToCSV,
    transactionsToExcelXML,
  },
  loadDailyQuote,
  scheduleDailyQuoteRefresh,
});

if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  window.APILogger = APILogger;
}

(async () => {
  try {
    await initializeStorage();
  } catch (error) {
    reportError(error, "Could not initialize encrypted local storage");
  }

  const appScript = document.createElement("script");
  appScript.src = new URL("../main.js", import.meta.url).href;
  appScript.onerror = () =>
    reportError(new Error("Could not load main.js"), "App startup failed");
  document.head.append(appScript);
})();
