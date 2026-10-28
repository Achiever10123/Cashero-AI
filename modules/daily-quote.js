import { reportError } from "./errors.js";
import { readJSON, writeJSON } from "./storage.js";

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

function readCachedDailyQuote() {
  try {
    const cached = readJSON(DAILY_QUOTE_STORAGE_KEY);
    if (
      cached &&
      typeof cached.quote === "string" &&
      cached.quote.trim() &&
      typeof cached.author === "string" &&
      cached.author.trim() &&
      typeof cached.date === "string"
    ) {
      return cached;
    }
    return null;
  } catch (error) {
    reportError(error, "Could not read the cached daily quote", {
      notify: false,
    });
    return null;
  }
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
  const cached = readCachedDailyQuote();

  if (cached?.date === today) {
    renderDailyQuote(cached);
  } else {
    renderDailyQuote(getDailyQuoteFallback());
  }
  if (
    cached?.date === today ||
    dailyQuoteRequestDate === today ||
    dailyQuoteAttemptDate === today
  ) {
    return;
  }

  dailyQuoteRequestDate = today;
  dailyQuoteAttemptDate = today;
  try {
    const response = await fetch("https://zenquotes.io/api/today", {
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
    try {
      writeJSON(DAILY_QUOTE_STORAGE_KEY, quote);
    } catch (error) {
      reportError(error, "Could not cache the daily quote", {
        notify: false,
      });
    }
  } catch (error) {
    reportError(error, "Could not load the daily motivational quote", {
      notify: false,
    });
  } finally {
    if (dailyQuoteRequestDate === today) dailyQuoteRequestDate = null;
  }
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
window.addEventListener("online", () => {
  if (!dailyQuoteRequestDate) dailyQuoteAttemptDate = null;
  loadDailyQuote();
});


export { loadDailyQuote, scheduleDailyQuoteRefresh };
