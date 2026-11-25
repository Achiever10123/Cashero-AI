import { createElement, Fragment } from "react";
import { createBoundaryRoot } from "./create-boundary-root.js";

let root = null;
let nextToastId = 0;
let activeToasts = [];
const toastTimers = new Map();

function ToastContainer({ toasts, onDismiss }) {
  return createElement(
    Fragment,
    null,
    ...toasts.map((toast) =>
      createElement(
        "div",
        {
          className: `toast ${toast.type}`,
          role: toast.type === "err" ? "alert" : "status",
          key: toast.id,
        },
        createElement("span", { className: "toast-msg" }, toast.message),
        createElement(
          "button",
          {
            className: "toast-close",
            type: "button",
            "aria-label": "Dismiss notification",
            title: "Dismiss notification",
            onClick: () => onDismiss(toast.id),
          },
          createElement("i", {
            className: "fa-solid fa-xmark",
            style: { fontSize: "16px" },
            "aria-hidden": true,
          }),
        ),
      ),
    ),
  );
}

function renderToasts() {
  root.render(
    createElement(ToastContainer, {
      toasts: activeToasts,
      onDismiss: dismissToast,
    }),
  );
}

function dismissToast(id) {
  const timer = toastTimers.get(id);
  if (timer) clearTimeout(timer);
  toastTimers.delete(id);
  activeToasts = activeToasts.filter((toast) => toast.id !== id);
  renderToasts();
}

export function mountToastContainer() {
  const container = document.getElementById("toast-container");
  if (!container) throw new Error("Missing #toast-container mount point");
  if (root) return;
  root = createBoundaryRoot(container, "Could not render notifications");
}

export function showToast(message, type = "ok") {
  if (!root) throw new Error("Toast components have not been mounted");

  const id = nextToastId++;
  activeToasts = [...activeToasts, { id, message: String(message), type }];
  renderToasts();
  toastTimers.set(id, setTimeout(() => dismissToast(id), 3000));
}
