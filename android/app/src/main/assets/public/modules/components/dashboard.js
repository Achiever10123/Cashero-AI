function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
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
      value: data.payout > 0 ? data.savedLabel : data.placeholder,
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

  return stats.map((stat) => {
    const card = element("div", `stat-card ${stat.className}`);
    card.append(
      element("div", "stat-label", stat.label),
      element("div", "stat-val", stat.value),
      element("div", "stat-sub", stat.sub),
    );
    card.querySelector(".stat-val").style.color = stat.color;
    return card;
  });
}

function renderCategories(data) {
  if (!data.categories.length) {
    const empty = element("div", "empty");
    const icon = element("div", "empty-icon");
    const iconElement = element("i", "fa-solid fa-box-open");
    iconElement.setAttribute("aria-hidden", "true");
    icon.append(iconElement);
    empty.append(icon, document.createTextNode("No expenses yet"));
    return [empty];
  }

  return data.categories.map((category) => {
    const row = element("div", "cat-row");
    const header = element("div", "cat-header");
    const name = element("div", "cat-name");
    const icon = element("span");
    icon.style.cssText =
      "display:inline-block;width:16px;height:16px;margin-right:6px";
    const iconTemplate = document.createElement("template");
    iconTemplate.innerHTML = category.iconHtml;
    icon.append(iconTemplate.content);

    const categoryName = element("span", "", category.name);
    categoryName.style.color = category.color;
    name.append(icon, categoryName);
    if (category.pct > 30) name.append(element("span", "cat-badge", "HIGH"));

    const total = element("div", "", category.totalLabel);
    total.style.cssText =
      `font-size:12px;font-weight:700;color:${category.color}`;
    header.append(name, total);

    const progress = element("div", "prog-wrap");
    progress.style.height = "5px";
    const fill = element("div", "prog-fill");
    fill.style.width = `${Math.min(100, category.width)}%`;
    fill.style.background = category.color;
    progress.append(fill);

    const percent = element("div", "", `${category.pct}% of income`);
    percent.style.cssText =
      "font-size:9px;color:var(--text3);margin-top:3px";
    row.append(header, progress, percent);
    return row;
  });
}

function renderProjection(data) {
  const rows = [
    ["Avg daily spend", data.dailyRateLabel, "var(--yellow)"],
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
      ? ["Safe to spend/day", data.safeDailyLabel, "var(--green)"]
      : null,
    ["Days remaining", String(data.daysLeft), "var(--text)"],
  ].filter(Boolean);

  const box = element("div", "projection-box");
  for (const [label, value, color] of rows) {
    const row = element("div", "proj-row");
    row.append(
      element("span", "proj-key", label),
      element("span", "proj-val", value),
    );
    row.querySelector(".proj-val").style.color = color;
    box.append(row);
  }
  return box;
}

function renderSlot(containerId, render) {
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`Missing #${containerId} mount point`);
  container.replaceChildren(...render());
}

export function mountDashboardComponents() {
  for (const containerId of ["stat-grid", "dash-cats", "proj-box"]) {
    if (!document.getElementById(containerId)) {
      throw new Error(`Missing #${containerId} mount point`);
    }
  }
}

export function renderDashboardComponents(data) {
  renderSlot("stat-grid", () => renderStats(data));
  renderSlot("dash-cats", () => renderCategories(data));
  const projection = document.getElementById("proj-box");
  if (!projection) throw new Error("Missing #proj-box mount point");
  projection.replaceChildren(renderProjection(data));
}
