import { APILogger, fetchAPI } from "./api.js";
import { installGlobalErrorHandlers, reportError } from "./errors.js";
import {
  getStorageItem,
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

const appScript = document.createElement("script");
appScript.src = new URL("../main.js", import.meta.url).href;
appScript.onerror = () =>
  reportError(new Error("Could not load main.js"), "App startup failed");
document.head.append(appScript);
