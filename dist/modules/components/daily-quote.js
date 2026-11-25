import { createElement } from "react";
import { createBoundaryRoot } from "./create-boundary-root.js";

let root = null;

function DailyQuote({ quote, onDismiss }) {
  if (!quote) return null;

  return createElement(
    "aside",
    {
      className: "daily-quote-banner",
      "aria-label": "Daily motivational quote",
      role: "status",
    },
    createElement(
      "span",
      { className: "daily-quote-mark", "aria-hidden": true },
      "“",
    ),
    createElement(
      "div",
      { className: "daily-quote-content" },
      createElement("div", { className: "daily-quote-label" }, "Daily inspiration"),
      createElement("blockquote", { className: "daily-quote-text" }, quote.quote),
      quote.author
        ? createElement(
            "div",
            { className: "daily-quote-attribution" },
            createElement("cite", null, quote.author),
          )
        : null,
    ),
    createElement(
      "button",
      {
        className: "daily-quote-close",
        type: "button",
        "aria-label": "Dismiss daily quote",
        onClick: onDismiss,
      },
      "×",
    ),
  );
}

export function mountDailyQuote() {
  const container = document.getElementById("daily-quote-toast");
  if (!container) throw new Error("Missing #daily-quote-toast mount point");
  if (root) return;
  root = createBoundaryRoot(container, "Could not render the daily quote");
}

export function renderDailyQuote(quote, onDismiss = () => {}) {
  if (!root) throw new Error("Daily quote component has not been mounted");
  root.render(createElement(DailyQuote, { quote, onDismiss }));
}
