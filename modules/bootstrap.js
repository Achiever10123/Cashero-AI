import { APILogger, fetchAPI } from "./api.js";
import {
  mountNotificationPanel,
  renderNotificationPanel,
} from "./components/notification-panel.js";
import {
  mountDashboardComponents,
  renderDashboardComponents,
} from "./components/dashboard.js";
import {
  mountNavigation,
  renderNavigation,
} from "./components/navigation.js";
import {
  mountToastContainer,
  showToast,
} from "./components/toast.js";
import { mountDailyQuote } from "./components/daily-quote.js";
import { mountPwaInstallPrompt } from "./pwa-install.js";
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
mountToastContainer();
mountDailyQuote();
mountNotificationPanel();
mountDashboardComponents();
mountNavigation();
mountPwaInstallPrompt();

Object.assign(window, {
  fetchAPI,
  CasheroComponents: {
    renderDashboard: renderDashboardComponents,
    renderNotifications: renderNotificationPanel,
    renderNavigation,
    toast: showToast,
  },
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
    return;
  }

  const appScript = document.createElement("script");
  appScript.src = new URL("../main.js", import.meta.url).href;
  appScript.onerror = () =>
    reportError(new Error("Could not load main.js"), "App startup failed");
  document.head.append(appScript);
})();
