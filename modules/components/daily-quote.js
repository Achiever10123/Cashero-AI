let container = null;

export function mountDailyQuote() {
  container = document.getElementById("daily-quote-toast");
  if (!container) throw new Error("Missing #daily-quote-toast mount point");
}

export function renderDailyQuote(quote, onDismiss = () => {}) {
  if (!container) throw new Error("Daily quote component has not been mounted");
  if (!quote) {
    container.replaceChildren();
    return;
  }

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
  const blockquote = document.createElement("blockquote");
  blockquote.className = "daily-quote-text";
  blockquote.textContent = quote.quote;
  content.append(label, blockquote);

  if (quote.author) {
    const attribution = document.createElement("div");
    attribution.className = "daily-quote-attribution";
    const author = document.createElement("cite");
    author.textContent = quote.author;
    attribution.append(author);
    content.append(attribution);
  }

  const close = document.createElement("button");
  close.className = "daily-quote-close";
  close.type = "button";
  close.setAttribute("aria-label", "Dismiss daily quote");
  close.textContent = "×";
  close.addEventListener("click", onDismiss);

  banner.append(mark, content, close);
  container.replaceChildren(banner);
}
