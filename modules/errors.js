let lastNotice = "";
let lastNoticeAt = 0;

function normalizeError(error) {
  if (error instanceof Error) return error;
  if (typeof error === "string") return new Error(error);

  try {
    return new Error(JSON.stringify(error) || String(error));
  } catch {
    return new Error(String(error));
  }
}

function showErrorNotice(message, appendAvailability = true) {
  if (!document.body) return;

  const now = Date.now();
  if (message === lastNotice && now - lastNoticeAt < 5000) return;
  lastNotice = message;
  lastNoticeAt = now;

  let notice = document.getElementById("cashero-error-notice");
  if (!notice) {
    notice = document.createElement("div");
    notice.id = "cashero-error-notice";
    notice.setAttribute("role", "alert");
    notice.style.cssText =
      "position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:10000;max-width:min(560px,calc(100vw - 24px));padding:12px 16px;border:1px solid #ef4444;border-radius:10px;background:#1f1316;color:#fee2e2;box-shadow:0 8px 24px rgba(0,0,0,.3);font:14px/1.5 system-ui,sans-serif";

    const text = document.createElement("span");
    text.className = "cashero-error-message";
    const dismiss = document.createElement("button");
    dismiss.type = "button";
    dismiss.textContent = "Dismiss";
    dismiss.setAttribute("aria-label", "Dismiss error message");
    dismiss.style.cssText =
      "margin-left:12px;border:0;background:transparent;color:inherit;text-decoration:underline;cursor:pointer";
    dismiss.addEventListener("click", () => notice.remove());
    notice.append(text, dismiss);
  }

  notice.querySelector(".cashero-error-message").textContent =
    appendAvailability
      ? `${message} Some features may be unavailable.`
      : message;
  if (!notice.isConnected) document.body.append(notice);
  clearTimeout(notice.dismissTimer);
  notice.dismissTimer = setTimeout(() => notice.remove(), 10000);
}

export function reportError(error, context = "Application error", options = {}) {
  const normalized = normalizeError(error);
  const message = `${context}: ${normalized.message}`;
  console.error(`[Cashero] ${message}`, normalized);

  if (options.notify !== false) {
    showErrorNotice(options.userMessage || message, !options.userMessage);
  }
}

export function installGlobalErrorHandlers() {
  window.addEventListener("error", (event) => {
    reportError(event.error || event.message, "Unexpected application error");
  });

  window.addEventListener("unhandledrejection", (event) => {
    reportError(event.reason, "Unexpected asynchronous error");
  });
}
