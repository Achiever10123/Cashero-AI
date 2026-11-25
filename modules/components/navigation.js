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

let container = null;

export function mountNavigation(activePage = "dashboard") {
  container = document.querySelector(".nav-container");
  if (!container) throw new Error("Missing navigation mount point");

  const group = document.createElement("div");
  group.className = "nav-group";
  for (const [page, icon, label] of NAV_ITEMS) {
    const button = document.createElement("button");
    button.className = "nav-item";
    button.dataset.page = page;
    button.title = label;
    button.addEventListener("click", () => window.navigate(page));

    const iconElement = document.createElement("i");
    iconElement.className = `nav-icon fa-solid ${icon}`;
    iconElement.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    text.className = "nav-label";
    text.textContent = label;
    button.append(iconElement, text);
    group.append(button);
  }
  container.replaceChildren(group);
  renderNavigation(activePage);
}

export function renderNavigation(activePage) {
  if (!container) return;
  for (const button of container.querySelectorAll(".nav-item")) {
    const active = button.dataset.page === activePage;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  }
}
