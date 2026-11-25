import {
  createElement,
  Fragment,
  useSyncExternalStore,
} from "react";
import { getAppState, setDashboardState, subscribeToAppState } from "../app-state.js";
import { createBoundaryRoot } from "./create-boundary-root.js";

const roots = new Map();

function DashboardSlot({ name }) {
  const { dashboard } = useSyncExternalStore(subscribeToAppState, getAppState);
  if (!dashboard) return null;

  if (name === "stats") return renderStats(dashboard);
  if (name === "categories") return renderCategories(dashboard);
  return renderProjection(dashboard);
}

function renderStats(data) {
  const stats = [
    {
      className: "c-purple",
      label: "Monthly Income",
      value: data.payout > 0 ? data.payoutLabel : data.placeholder,
      sub: "this month",
      color: "var(--accent2)",
    },
    {
      className: "c-red",
      label: "Total Spent",
      value: data.spentLabel,
      sub: data.payout > 0 ? `${data.spentPct}% of income` : "set payout first",
      color: "var(--red)",
    },
    {
      className: "c-green",
      label: "Saved",
      value:
        data.payout > 0
          ? data.savedLabel
          : data.placeholder,
      sub: data.payout > 0 ? `${data.savePct}% rate` : "—",
      color: data.saved >= 0 ? "var(--green)" : "var(--red)",
    },
    {
      className: "c-teal",
      label: "Transactions",
      value: String(data.transactionCount),
      sub: "this month",
      color: "var(--teal)",
    },
    {
      className: "c-olive",
      label: "Health Score",
      value: String(data.healthScore),
      sub: "0-100 (higher is better)",
      color: data.healthColor,
    },
  ];

  return createElement(
    Fragment,
    null,
    ...stats.map((stat) =>
      createElement(
        "div",
        { className: `stat-card ${stat.className}`, key: stat.className },
        createElement("div", { className: "stat-label" }, stat.label),
        createElement(
          "div",
          { className: "stat-val", style: { color: stat.color } },
          stat.value,
        ),
        createElement("div", { className: "stat-sub" }, stat.sub),
      ),
    ),
  );
}

function renderCategories(data) {
  if (!data.categories.length) {
    return createElement(
      "div",
      { className: "empty" },
      createElement(
        "div",
        { className: "empty-icon" },
        createElement("i", {
          className: "fa-solid fa-box-open",
          "aria-hidden": true,
        }),
      ),
      "No expenses yet",
    );
  }

  return createElement(
    Fragment,
    null,
    ...data.categories.map((category) =>
      createElement(
        "div",
        { className: "cat-row", key: category.name },
        createElement(
          "div",
          { className: "cat-header" },
          createElement(
            "div",
            { className: "cat-name" },
            createElement("span", {
              style: {
                display: "inline-block",
                width: "16px",
                height: "16px",
                marginRight: "6px",
              },
              dangerouslySetInnerHTML: { __html: category.iconHtml },
            }),
            createElement(
              "span",
              { style: { color: category.color } },
              category.name,
            ),
            category.pct > 30
              ? createElement("span", { className: "cat-badge" }, "HIGH")
              : null,
          ),
          createElement(
            "div",
            {
              style: {
                fontSize: "12px",
                fontWeight: 700,
                color: category.color,
              },
            },
            category.totalLabel,
          ),
        ),
        createElement(
          "div",
          { className: "prog-wrap", style: { height: "5px" } },
          createElement("div", {
            className: "prog-fill",
            style: {
              width: `${Math.min(100, category.width)}%`,
              background: category.color,
            },
          }),
        ),
        createElement(
          "div",
          {
            style: {
              fontSize: "9px",
              color: "var(--text3)",
              marginTop: "3px",
            },
          },
          `${category.pct}% of income`,
        ),
      ),
    ),
  );
}

function renderProjection(data) {
  const rows = [
    [
      "Avg daily spend",
      data.dailyRateLabel,
      "var(--yellow)",
    ],
    [
      "Projected month total",
      data.projectedLabel,
      data.projected > data.payout && data.payout > 0
        ? "var(--red)"
        : "var(--text)",
    ],
    data.remaining !== null
      ? [
          "Budget remaining",
          data.remainingLabel,
          data.remaining < 0 ? "var(--red)" : "var(--green)",
        ]
      : null,
    data.safeDaily
      ? [
          "Safe to spend/day",
          data.safeDailyLabel,
          "var(--green)",
        ]
      : null,
    ["Days remaining", String(data.daysLeft), "var(--text)"],
  ].filter(Boolean);

  return createElement(
    "div",
    { className: "projection-box" },
    ...rows.map(([label, value, color]) =>
      createElement(
        "div",
        { className: "proj-row", key: label },
        createElement("span", { className: "proj-key" }, label),
        createElement(
          "span",
          { className: "proj-val", style: { color } },
          value,
        ),
      ),
    ),
  );
}

function mountSlot(containerId, name) {
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`Missing #${containerId} mount point`);

  let root = roots.get(containerId);
  if (!root) {
    root = createBoundaryRoot(container, `Could not render ${containerId}`);
    roots.set(containerId, root);
  }
  root.render(createElement(DashboardSlot, { name }));
}

export function mountDashboardComponents() {
  mountSlot("stat-grid", "stats");
  mountSlot("dash-cats", "categories");
  mountSlot("proj-box", "projection");
}

export function renderDashboardComponents(data) {
  setDashboardState(data);
}
