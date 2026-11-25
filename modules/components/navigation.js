import { createElement, useSyncExternalStore } from "react";
import {
  getAppState,
  setActivePage,
  subscribeToAppState,
} from "../app-state.js";
import { createBoundaryRoot } from "./create-boundary-root.js";

let root = null;

const NAV_ITEMS = [
  ["dashboard", "fa-house", "Dashboard"],
  ["charts", "fa-chart-pie", "Charts"],
  ["compare", "fa-code-compare", "Compare"],
  ["summary", "fa-chart-line", "Summary"],
  ["goals", "fa-bullseye", "Goals"],
  ["recurring", "fa-rotate", "Recurring"],
  ["analysis", "fa-brain", "AI Analysis"],
  ["add", "fa-plus", "Add Expense"],
  ["payouts", "fa-money-bill", "Payouts"],
  ["history", "fa-clock", "History"],
  ["yearly", "fa-chart-area", "Yearly Report"],
  ["settings", "fa-gear", "Settings"],
  ["help", "fa-circle-info", "Help"],
];

function Navigation() {
  const { activePage } = useSyncExternalStore(
    subscribeToAppState,
    getAppState,
  );

  return createElement(
    "div",
    { className: "nav-group" },
    ...NAV_ITEMS.map(([page, icon, label]) =>
      createElement(
        "button",
        {
          className: `nav-item${activePage === page ? " active" : ""}`,
          "data-page": page,
          "aria-current": activePage === page ? "page" : undefined,
          title: label,
          key: page,
          onClick: () => window.navigate(page),
        },
        createElement("i", {
          className: `nav-icon fa-solid ${icon}`,
          "aria-hidden": true,
        }),
        createElement("span", { className: "nav-label" }, label),
      ),
    ),
  );
}

export function mountNavigation(activePage = "dashboard") {
  const container = document.querySelector(".nav-container");
  if (!container) throw new Error("Missing navigation mount point");
  setActivePage(activePage);
  if (!root) root = createBoundaryRoot(container, "Could not render navigation");
  root.render(createElement(Navigation));
}

export function renderNavigation(activePage) {
  setActivePage(activePage);
}
