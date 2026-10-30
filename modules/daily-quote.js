import { reportError } from "./errors.js";
import { removeStorageItem } from "./storage.js";

const DAILY_QUOTE_STORAGE_KEY = "cashero_daily_quote";
const DAILY_QUOTE_FALLBACKS = [
  "Well done is better than well said.",
  "Energy and persistence conquer all things.",
  "Diligence is the mother of good luck.",
  "Never leave that till tomorrow which you can do today.",
  "Lost time is never found again.",
];
let dailyQuoteRequestDate = null;
let dailyQuoteAttemptDate = null;
let dailyQuoteRefreshTimer = null;
let dailyQuoteToastTimer = null;
let dailyQuoteToastShown = false;

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDailyQuoteFallback(date = new Date()) {
  const dateKey = localDateKey(date);
  const dayNumber = Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0)) /
      86_400_000,
  );
  return {
    quote: DAILY_QUOTE_FALLBACKS[dayNumber % DAILY_QUOTE_FALLBACKS.length],
    author: "Benjamin Franklin",
    date: dateKey,
  };
}

function renderDailyQuote(quote) {
  const area = document.getElementById("daily-quote-toast");
  if (!area) return;
  if (area.hidden && dailyQuoteToastShown) return;

  const banner = document.createElement("aside");
  banner.className = "daily-quote-banner";
  banner.setAttribute("aria-label", "Daily motivational quote");
  banner.setAttribute("role", "status");

  const mark = document.createElement("span");
  mark.className = "daily-quote-mark";
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = "“";

  const content = document.createElement("div");
  content.className = "daily-quote-content";

  const label = document.createElement("div");
  label.className = "daily-quote-label";
  label.textContent = "Daily inspiration";

  const text = document.createElement("blockquote");
  text.className = "daily-quote-text";
  text.textContent = quote.quote;

  if (quote.author) {
    const attribution = document.createElement("div");
    attribution.className = "daily-quote-attribution";

    const author = document.createElement("cite");
    author.textContent = quote.author;
    attribution.append(author);
    content.append(attribution);
  }

  const closeButton = document.createElement("button");
  closeButton.className = "daily-quote-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Dismiss daily quote");
  closeButton.textContent = "×";
  closeButton.addEventListener("click", () => {
    clearTimeout(dailyQuoteToastTimer);
    area.hidden = true;
    area.replaceChildren();
  });

  content.prepend(label, text);
  banner.append(mark, content, closeButton);
  area.replaceChildren(banner);
  area.hidden = false;
  if (!dailyQuoteToastShown) {
    dailyQuoteToastShown = true;
    dailyQuoteToastTimer = setTimeout(() => {
      area.hidden = true;
      area.replaceChildren();
    }, 60_000);
  }
}

async function loadDailyQuote() {
  const today = localDateKey();
  if (dailyQuoteRequestDate === today || dailyQuoteAttemptDate === today) return;

  dailyQuoteAttemptDate = today;
  const fallback = getDailyQuoteFallback();
  if (!navigator.onLine) {
    renderDailyQuote(fallback);
    return;
  }

  dailyQuoteRequestDate = today;
  try {
    const response = await fetch("/api/random-quote", {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Quote API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const result = Array.isArray(data) ? data[0] : null;
    if (
      !result ||
      typeof result.q !== "string" ||
      !result.q.trim() ||
      typeof result.a !== "string"
    ) {
      throw new Error("Quote API returned an invalid response");
    }

    if (today !== localDateKey()) return;
    const quote = {
      quote: result.q.trim(),
      author: result.a.trim() || "Unknown",
      date: today,
    };
    renderDailyQuote(quote);
  } catch (error) {
    if (!navigator.onLine) renderDailyQuote(fallback);
    reportError(error, "Could not load the daily motivational quote", {
      notify: true,
    });
  } finally {
    if (dailyQuoteRequestDate === today) dailyQuoteRequestDate = null;
  }
}

try {
  removeStorageItem(DAILY_QUOTE_STORAGE_KEY);
} catch (error) {
  reportError(error, "Could not clear the cached daily quote", {
    notify: false,
  });
}

function scheduleDailyQuoteRefresh() {
  clearTimeout(dailyQuoteRefreshTimer);
  const nextMidnight = new Date();
  nextMidnight.setHours(24, 0, 0, 0);
  dailyQuoteRefreshTimer = setTimeout(
    () => {
      loadDailyQuote();
      scheduleDailyQuoteRefresh();
    },
    Math.max(1000, nextMidnight.getTime() - Date.now()),
  );
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") loadDailyQuote();
});
window.addEventListener("offline", () => {
  if (dailyQuoteRequestDate) renderDailyQuote(getDailyQuoteFallback());
});
window.addEventListener("online", () => {
  if (!dailyQuoteRequestDate) dailyQuoteAttemptDate = null;
  loadDailyQuote();
});


export { loadDailyQuote, scheduleDailyQuoteRefresh };
