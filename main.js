  // ═══════════════════════════════════════════
  //  CONSTANTS & STATE
  // ═══════════════════════════════════════════
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const CATS = [
    { name: "Food & Dining", icon: "🍜", color: "#ff6b6b" },
    { name: "Transport", icon: "🚗", color: "#00d4c8" },
    { name: "Software & Tools", icon: "💻", color: "#60a5fa" },
    { name: "Entertainment", icon: "🎮", color: "#a78bfa" },
    { name: "Health", icon: "💊", color: "#fbbf24" },
    { name: "Housing", icon: "🏠", color: "#f472b6" },
    { name: "Shopping", icon: "🛍️", color: "#f97316" },
    { name: "Education", icon: "📚", color: "#34d399" },
    { name: "Other", icon: "📦", color: "#94a3b8" },
  ];
  const SK = "cashflow_v2";

  // ═══════════════════════════════════════════
  //  ⚠ PASTE YOUR OPENAI API KEY HERE
  // ═══════════════════════════════════════════
  const OPENAI_KEY =
    "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";
  const OPENAI_MODEL = "gpt-4o-mini"; // or 'gpt-4o' for smarter analysis
  const PAGE_META = {
    dashboard: { title: "Dashboard", sub: "Your financial overview" },
    charts: { title: "Charts", sub: "Visual spending breakdown" },
    compare: { title: "Compare", sub: "Month-over-month analysis" },
    goals: { title: "Savings Goals", sub: "Track your targets" },
    recurring: { title: "Recurring", sub: "Subscriptions & fixed costs" },
    analysis: { title: "AI Analysis", sub: "Personalized insights" },
    add: { title: "Add Expense", sub: "Log new spending" },
    payouts: { title: "Payouts", sub: "Monthly income" },
    history: { title: "History", sub: "All transactions" },
    yearly: { title: "Yearly Report", sub: "Annual overview + PDF export" },
  };

  let S = {
    expenses: [],
    payouts: [],
    goals: [],
    recurring: [],
    lastAnalysis: null,
    lastAnalysisDate: null,
    lastCheckin: null,
    lastCheckinDate: null,
    lastAnalysisMonthKey: null,
    theme: "dark",
  };
  let activeMonth = mkNow();
  let activeYear = new Date().getFullYear();
  let donutChart = null,
    lineChart = null,
    savingsChart = null,
    yrLineChart = null;
  let nlpParsed = null;
  let notifications = [];

  // ═══════════════════════════════════════════
  //  PERSISTENCE
  // ═══════════════════════════════════════════
  function load() {
    try {
      const r = localStorage.getItem(SK);
      if (r) S = JSON.parse(r);
    } catch {}
  }
  function save() {
    localStorage.setItem(SK, JSON.stringify(S));
  }

  // ═══════════════════════════════════════════
  //  MONTH HELPERS
  // ═══════════════════════════════════════════
  function mkNow() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}`;
  }
  function mk(date) {
    return `${date.getFullYear()}-${date.getMonth()}`;
  }
  function parseMK(s) {
    const [y, m] = s.split("-").map(Number);
    return { y, m };
  }
  function monthLabel(s) {
    const { y, m } = parseMK(s);
    return `${MONTHS[m]} ${y}`;
  }
  function monthExpenses(mk2) {
    return S.expenses.filter((e) => {
      const d = new Date(e.date);
      return mk(d) === mk2;
    });
  }
  function monthPayout(mk2) {
    const { y, m } = parseMK(mk2);
    return S.payouts.find((p) => p.year == y && p.month == m);
  }
  function fmt(n) {
    return (
      "$" +
      Number(n).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
  function fmtShort(n) {
    return n >= 1000 ? "$" + (n / 1000).toFixed(1) + "k" : fmt(n);
  }

  // ═══════════════════════════════════════════
  //  NAVIGATION
  // ═══════════════════════════════════════════
  function navigate(page) {
    document
      .querySelectorAll(".page")
      .forEach((p) => p.classList.remove("active"));
    document
      .querySelectorAll(".nav-item")
      .forEach((n) => n.classList.remove("active"));
    document.getElementById("page-" + page).classList.add("active");
    const sEl = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (sEl) sEl.classList.add("active");
    const m = PAGE_META[page] || { title: page, sub: "" };
    document.getElementById("topbar-title").textContent = m.title;
    document.getElementById("topbar-sub").textContent = m.sub;
    renderPage(page);
  }
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => navigate(btn.dataset.page));
  });

  // ═══════════════════════════════════════════
  //  MONTH PILLS
  // ═══════════════════════════════════════════
  function renderMonthPills() {
    const all = new Set([mkNow()]);
    S.expenses.forEach((e) => all.add(mk(new Date(e.date))));
    S.payouts.forEach((p) => all.add(`${p.year}-${p.month}`));
    const sorted = [...all].sort().reverse().slice(0, 7);
    document.getElementById("month-pills").innerHTML = sorted
      .map(
        (k) =>
          `<button class="month-pill${k === activeMonth ? " active" : ""}" onclick="setMonth('${k}')">${monthLabel(k)}</button>`,
      )
      .join("");
  }
  function setMonth(mk2) {
    activeMonth = mk2;
    renderMonthPills();
    renderAll();
  }

  // ═══════════════════════════════════════════
  //  RENDER ALL
  // ═══════════════════════════════════════════
  function renderAll() {
    renderDashboard();
    renderGoals();
    renderRecurring();
    renderPayoutHistory();
    renderHistory();
    renderCharts();
    renderCompare();
    renderCatDeep();
    detectDuplicates();
  }
  function renderPage(page) {
    if (page === "dashboard") renderDashboard();
    else if (page === "charts") renderCharts();
    else if (page === "compare") renderCompare();
    else if (page === "goals") renderGoals();
    else if (page === "recurring") renderRecurring();
    else if (page === "analysis") renderCatDeep();
    else if (page === "history") {
      renderHistory();
      detectDuplicates();
    } else if (page === "yearly") renderYearly();
    else if (page === "payouts") renderPayoutHistory();
  }

  // ═══════════════════════════════════════════
  //  DASHBOARD
  // ═══════════════════════════════════════════
  function renderDashboard() {
    const exps = monthExpenses(activeMonth);
    const po = monthPayout(activeMonth);
    const payout = po?.amount || 0;
    const spent = exps.reduce((s, e) => s + e.amount, 0);
    const saved = payout - spent;
    const savePct = payout > 0 ? ((saved / payout) * 100).toFixed(1) : 0;
    const spentPct = payout > 0 ? ((spent / payout) * 100).toFixed(0) : 0;

    // Stats
    document.getElementById("stat-grid").innerHTML = `
    <div class="stat-card c-purple">
      <div class="stat-label">Monthly Income</div>
      <div class="stat-val" style="color:var(--accent2)">${payout > 0 ? fmt(payout) : "$—"}</div>
      <div class="stat-sub">this month</div>
    </div>
    <div class="stat-card c-red">
      <div class="stat-label">Total Spent</div>
      <div class="stat-val" style="color:var(--red)">${fmt(spent)}</div>
      <div class="stat-sub">${payout > 0 ? spentPct + "% of income" : "set payout first"}</div>
    </div>
    <div class="stat-card c-green">
      <div class="stat-label">Saved</div>
      <div class="stat-val" style="color:${saved >= 0 ? "var(--green)" : "var(--red)"}">${payout > 0 ? fmt(saved) : "$—"}</div>
      <div class="stat-sub">${payout > 0 ? savePct + "% rate" : "—"}</div>
    </div>
    <div class="stat-card c-teal">
      <div class="stat-label">Transactions</div>
      <div class="stat-val" style="color:var(--teal)">${exps.length}</div>
      <div class="stat-sub">this month</div>
    </div>`;

    // Budget bar
    const barPct = payout > 0 ? Math.min(100, (spent / payout) * 100) : 0;
    const bar = document.getElementById("budget-bar");
    bar.style.width = barPct + "%";
    bar.style.background =
      barPct > 90
        ? "var(--red)"
        : barPct > 70
          ? "var(--yellow)"
          : "var(--accent)";
    document.getElementById("budget-pct-label").textContent =
      barPct.toFixed(0) + "% used";
    document.getElementById("budget-left").textContent = payout > 0 ? fmt(spent) + " spent" : "Set payout";
    document.getElementById("budget-right").textContent =
      "of " + (payout > 0 ? fmt(payout) : "$—");

    // Categories
    const byCat = CATS.map((c) => ({
      ...c,
      total: exps
        .filter((e) => e.category === c.name)
        .reduce((s, e) => s + e.amount, 0),
    }))
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);

    const dashCats = document.getElementById("dash-cats");
    if (!byCat.length) {
      dashCats.innerHTML =
        '<div class="empty"><div class="empty-icon">📦</div>No expenses yet</div>';
    } else {
      dashCats.innerHTML = byCat
        .map((c) => {
          const pct = payout > 0 ? ((c.total / payout) * 100).toFixed(1) : 0;
          const warn = pct > 30 ? '<span class="cat-badge">HIGH</span>' : "";
          return `<div class="cat-row">
        <div class="cat-header">
          <div class="cat-name">${c.icon} <span style="color:${c.color}">${c.name}</span>${warn}</div>
          <div style="font-size:12px;font-weight:700;color:${c.color}">${fmt(c.total)}</div>
        </div>
        <div class="prog-wrap" style="height:5px;"><div class="prog-fill" style="width:${Math.min(100, payout > 0 ? (c.total / payout) * 100 : 0)}%;background:${c.color}"></div></div>
        <div style="font-size:9px;color:var(--text3);margin-top:3px">${pct}% of income</div>
      </div>`;
        })
        .join("");
    }

    // Projection
    renderProjection(exps, payout);

    // Recent
    const recent = [...exps]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
    renderTxList("dash-recent", recent, false);

    // Anomalies
    detectAnomalies();
    // Weekly checkin banner
    renderCheckinBanner();
  }

  // ═══════════════════════════════════════════
  //  PROJECTION
  // ═══════════════════════════════════════════
  function renderProjection(exps, payout) {
    const now = new Date();
    const { y, m } = parseMK(activeMonth);
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const today = activeMonth === mkNow() ? now.getDate() : daysInMonth;
    const dailyRate =
      today > 0 ? exps.reduce((s, e) => s + e.amount, 0) / today : 0;
    const projected = dailyRate * daysInMonth;
    const daysLeft = daysInMonth - today;
    const remaining =
      payout > 0 ? payout - exps.reduce((s, e) => s + e.amount, 0) : null;
    const safeDaily = remaining && daysLeft > 0 ? remaining / daysLeft : null;

    document.getElementById("proj-box").innerHTML = `
    <div class="projection-box">
      <div class="proj-row"><span class="proj-key">Avg daily spend</span><span class="proj-val" style="color:var(--yellow)">${fmt(dailyRate)}/day</span></div>
      <div class="proj-row"><span class="proj-key">Projected month total</span><span class="proj-val" style="color:${projected > payout && payout > 0 ? "var(--red)" : "var(--text)"}">${fmt(projected)}</span></div>
      ${remaining !== null ? `<div class="proj-row"><span class="proj-key">Budget remaining</span><span class="proj-val" style="color:${remaining < 0 ? "var(--red)" : "var(--green)"}">${fmt(remaining)}</span></div>` : ""}
      ${safeDaily ? `<div class="proj-row"><span class="proj-key">Safe to spend/day</span><span class="proj-val" style="color:var(--green)">${fmt(safeDaily)}</span></div>` : ""}
      <div class="proj-row"><span class="proj-key">Days remaining</span><span class="proj-val">${daysLeft}</span></div>
    </div>`;
  }

  // ═══════════════════════════════════════════
  //  ANOMALY DETECTION
  // ═══════════════════════════════════════════
  function detectAnomalies() {
    const area = document.getElementById("anomaly-area");
    const exps = monthExpenses(activeMonth);
    if (!exps.length) {
      area.innerHTML = "";
      return;
    }

    // Compare each category vs previous month
    const { y, m } = parseMK(activeMonth);
    const prevMK = m === 0 ? `${y - 1}-11` : `${y}-${m - 1}`;
    const prevExps = monthExpenses(prevMK);

    const anomalies = [];
    CATS.forEach((c) => {
      const curr = exps
        .filter((e) => e.category === c.name)
        .reduce((s, e) => s + e.amount, 0);
      const prev = prevExps
        .filter((e) => e.category === c.name)
        .reduce((s, e) => s + e.amount, 0);
      if (prev > 0 && curr > 0) {
        const delta = ((curr - prev) / prev) * 100;
        if (delta > 50 && curr > 50)
          anomalies.push({ cat: c, curr, prev, delta: delta.toFixed(0) });
      }
    });

    if (!anomalies.length) {
      area.innerHTML = "";
      return;
    }
    area.innerHTML = `<div class="card anomaly-card" style="margin-bottom:18px;">
    <div class="anomaly-header">
      <div class="anomaly-dot"></div>
      <div style="font-size:10px;color:var(--yellow);letter-spacing:2px;text-transform:uppercase;">Spending Anomalies Detected</div>
    </div>
    ${anomalies.map((a) => `<div class="anomaly-item"><span class="arrow">↑</span><span><strong style="color:var(--yellow)">${a.cat.name}</strong> is up ${a.delta}% vs last month (${fmt(a.prev)} → ${fmt(a.curr)})</span></div>`).join("")}
  </div>`;
  }

  // ═══════════════════════════════════════════
  //  CHARTS
  // ═══════════════════════════════════════════
  function getChartColors() {
    const isDark = S.theme === "dark";
    return {
      grid: isDark ? "#1e1e3a" : "#d4ccff",
      text: isDark ? "#8888b0" : "#5a5580",
    };
  }
  function renderCharts() {
    renderDonut();
    renderLineChart();
    renderHeatmap();
  }
  function renderDonut() {
    const exps = monthExpenses(activeMonth);
    const byCat = CATS.map((c) => ({
      label: c.name,
      value: exps
        .filter((e) => e.category === c.name)
        .reduce((s, e) => s + e.amount, 0),
      color: c.color,
    })).filter((c) => c.value > 0);

    const ctx = document.getElementById("donut-chart").getContext("2d");
    if (donutChart) donutChart.destroy();
    if (!byCat.length) return;
    const { text } = getChartColors();
    donutChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: byCat.map((c) => c.label),
        datasets: [
          {
            data: byCat.map((c) => c.value),
            backgroundColor: byCat.map((c) => c.color + "cc"),
            borderColor: byCat.map((c) => c.color),
            borderWidth: 2,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: text,
              font: { family: "JetBrains Mono", size: 10 },
              padding: 10,
              boxWidth: 12,
            },
          },
          tooltip: {
            callbacks: { label: (ctx) => `${ctx.label}: ${fmt(ctx.parsed)}` },
          },
        },
      },
    });
  }
  function renderLineChart() {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: mk(d), label: MONTHS[d.getMonth()] });
    }
    const spentData = months.map(({ key }) =>
      monthExpenses(key).reduce((s, e) => s + e.amount, 0),
    );
    const incomeData = months.map(({ key }) => monthPayout(key)?.amount || 0);
    const { grid, text } = getChartColors();
    const ctx = document.getElementById("line-chart").getContext("2d");
    if (lineChart) lineChart.destroy();
    lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: months.map((m) => m.label),
        datasets: [
          {
            label: "Income",
            data: incomeData,
            borderColor: "#6c47ff",
            backgroundColor: "#6c47ff18",
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#6c47ff",
          },
          {
            label: "Expenses",
            data: spentData,
            borderColor: "#ff4d6d",
            backgroundColor: "#ff4d6d15",
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#ff4d6d",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: text,
              font: { family: "JetBrains Mono", size: 10 },
              boxWidth: 12,
            },
          },
        },
        scales: {
          x: {
            grid: { color: grid },
            ticks: {
              color: text,
              font: { family: "JetBrains Mono", size: 10 },
            },
          },
          y: {
            grid: { color: grid },
            ticks: {
              color: text,
              font: { family: "JetBrains Mono", size: 10 },
              callback: (v) => fmtShort(v),
            },
          },
        },
      },
    });
  }
  function renderHeatmap() {
    const { y, m } = parseMK(activeMonth);
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstDay = new Date(y, m, 1).getDay();
    const exps = monthExpenses(activeMonth);
    const byDay = {};
    exps.forEach((e) => {
      const d = new Date(e.date).getDate();
      byDay[d] = (byDay[d] || 0) + e.amount;
    });
    const maxSpend = Math.max(...Object.values(byDay), 1);
    const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    document.getElementById("heatmap-days-labels").innerHTML = DAYS.map(
      (d) => `<div class="heatmap-label">${d}</div>`,
    ).join("");
    let cells = "";
    for (let i = 0; i < firstDay; i++) cells += `<div></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const amt = byDay[d] || 0;
      const intensity = amt / maxSpend;
      let bg = "var(--bg3)";
      if (intensity > 0.8) bg = "var(--accent)";
      else if (intensity > 0.6) bg = "#6c47ffcc";
      else if (intensity > 0.4) bg = "#6c47ff88";
      else if (intensity > 0.1) bg = "#6c47ff44";
      const title =
        amt > 0 ? `${MONTHS[m]} ${d}: ${fmt(amt)}` : `${MONTHS[m]} ${d}: $0`;
      cells += `<div class="heatmap-day" style="background:${bg};" title="${title}"></div>`;
    }
    document.getElementById("heatmap-grid").innerHTML = cells;
  }

  // ═══════════════════════════════════════════
  //  MONTH-OVER-MONTH COMPARE
  // ═══════════════════════════════════════════
  function renderCompare() {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: mk(d),
        label: MONTHS[d.getMonth()] + " " + d.getFullYear(),
      });
    }
    const rows = months.map(({ key, label }) => {
      const exps = monthExpenses(key);
      const spent = exps.reduce((s, e) => s + e.amount, 0);
      const payout = monthPayout(key)?.amount || 0;
      const saved = payout - spent;
      const savePct = payout > 0 ? ((saved / payout) * 100).toFixed(0) : 0;
      return { label, spent, payout, saved, savePct, key };
    });
    const table = `<table class="mom-table">
    <thead><tr>
      <th>Month</th><th>Income</th><th>Spent</th><th>Saved</th><th>Rate</th><th>vs Prev</th>
    </tr></thead>
    <tbody>${rows
      .map((r, i) => {
        const prev = rows[i - 1];
        let delta = "";
        if (prev && prev.spent > 0) {
          const d = (((r.spent - prev.spent) / prev.spent) * 100).toFixed(0);
          const cl = d > 0 ? "up" : "dn";
          delta = `<span class="delta ${cl}">${d > 0 ? "+" : ""}${d}%</span>`;
        }
        return `<tr>
        <td style="${r.key === activeMonth ? "color:var(--accent2);font-weight:700" : ""}">${r.label}</td>
        <td style="color:var(--accent2)">${r.payout > 0 ? fmt(r.payout) : "—"}</td>
        <td style="color:var(--red)">${fmt(r.spent)}</td>
        <td style="color:${r.saved >= 0 ? "var(--green)" : "var(--red)"}">${r.payout > 0 ? fmt(r.saved) : "—"}</td>
        <td style="color:var(--text2)">${r.payout > 0 ? r.savePct + "%" : "—"}</td>
        <td>${delta}</td>
      </tr>`;
      })
      .join("")}</tbody>
  </table>`;
    document.getElementById("mom-table-wrap").innerHTML = table;

    // Savings trend chart
    const { grid, text } = getChartColors();
    const ctx = document.getElementById("savings-trend-chart").getContext("2d");
    if (savingsChart) savingsChart.destroy();
    const validRows = rows.filter((r) => r.payout > 0);
    if (!validRows.length) return;
    savingsChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: rows.map((r) => r.label.split(" ")[0]),
        datasets: [
          {
            label: "Savings Rate %",
            data: rows.map((r) => (r.payout > 0 ? +r.savePct : null)),
            backgroundColor: rows.map((r) =>
              +r.savePct >= 20 ? "#00e5a0aa" : "#ff4d6d88",
            ),
            borderColor: rows.map((r) =>
              +r.savePct >= 20 ? "var(--green)" : "var(--red)",
            ),
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y}% saved` } },
        },
        scales: {
          x: {
            grid: { color: grid },
            ticks: {
              color: text,
              font: { family: "JetBrains Mono", size: 10 },
            },
          },
          y: {
            grid: { color: grid },
            ticks: {
              color: text,
              font: { family: "JetBrains Mono", size: 10 },
              callback: (v) => v + "%",
            },
            suggestedMin: 0,
          },
        },
      },
    });
  }

  // ═══════════════════════════════════════════
  //  GOALS
  // ═══════════════════════════════════════════
  function renderGoals() {
    const el = document.getElementById("goals-list");
    if (!S.goals.length) {
      el.innerHTML =
        '<div class="empty"><div class="empty-icon">🎯</div>No goals yet.<br>Add one to start tracking.</div>';
      return;
    }
    el.innerHTML = S.goals
      .map((g, i) => {
        const pct = Math.min(100, (g.saved / g.target) * 100);
        const remaining = g.target - g.saved;
        const deadlineStr = g.deadline
          ? `Deadline: ${g.deadline}`
          : "No deadline";
        const daysLeft = g.deadline
          ? Math.ceil((new Date(g.deadline) - new Date()) / 86400000)
          : null;
        const deadlineColor =
          daysLeft !== null && daysLeft < 30 ? "var(--red)" : "var(--text3)";
        return `<div class="goal-track-item">
      <div class="goal-head">
        <div class="goal-name">${g.name}</div>
        <div class="goal-pct">${pct.toFixed(0)}%</div>
      </div>
      <div class="prog-wrap" style="height:7px;"><div class="prog-fill" style="width:${pct}%;background:${pct >= 100 ? "var(--green)" : "var(--accent)"}"></div></div>
      <div class="goal-amounts"><span>${fmt(g.saved)} saved</span><span>${fmt(g.target)} target</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
        <div class="goal-deadline" style="color:${deadlineColor}">${deadlineStr}${daysLeft !== null ? ` (${daysLeft}d left)` : ""}</div>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-ghost" onclick="addToGoal(${i})" style="font-size:9px;padding:4px 10px;">+ Add</button>
          <button class="del-btn" onclick="deleteGoal(${i})">✕</button>
        </div>
      </div>
    </div>`;
      })
      .join("");
  }
  function showGoalForm() {
    document.getElementById("goal-form-card").style.display = "block";
  }
  function hideGoalForm() {
    document.getElementById("goal-form-card").style.display = "none";
  }
  function addGoal() {
    const name = document.getElementById("g-name").value.trim();
    const target = parseFloat(document.getElementById("g-target").value);
    const saved = parseFloat(document.getElementById("g-saved").value) || 0;
    const deadline = document.getElementById("g-deadline").value;
    if (!name || !target || target <= 0) {
      toast("Enter a name and target amount", "err");
      return;
    }
    S.goals.push({ id: Date.now(), name, target, saved, deadline });
    save();
    document.getElementById("g-name").value = "";
    document.getElementById("g-target").value = "";
    document.getElementById("g-saved").value = "";
    document.getElementById("g-deadline").value = "";
    hideGoalForm();
    renderGoals();
    toast("Goal added ✓");
  }
  function addToGoal(i) {
    const amt = parseFloat(prompt("How much to add to this goal?"));
    if (isNaN(amt) || amt <= 0) return;
    S.goals[i].saved = Math.min(S.goals[i].target, S.goals[i].saved + amt);
    save();
    renderGoals();
    toast(`+${fmt(amt)} added ✓`);
  }
  function deleteGoal(i) {
    if (!confirm("Delete this goal?")) return;
    S.goals.splice(i, 1);
    save();
    renderGoals();
    toast("Goal removed");
  }

  // ═══════════════════════════════════════════
  //  RECURRING
  // ═══════════════════════════════════════════
  function showRecurForm() {
    document.getElementById("recur-form-card").style.display = "block";
  }
  function hideRecurForm() {
    document.getElementById("recur-form-card").style.display = "none";
  }
  function renderRecurring() {
    const el = document.getElementById("recur-list");
    if (!S.recurring.length) {
      el.innerHTML =
        '<div class="empty"><div class="empty-icon">↺</div>No recurring expenses</div>';
      document.getElementById("recur-total").textContent = "$0.00";
      return;
    }
    let totalMonthly = 0;
    S.recurring.forEach((r) => {
      if (r.freq === "monthly") totalMonthly += r.amount;
      else if (r.freq === "weekly") totalMonthly += r.amount * 4.33;
      else if (r.freq === "yearly") totalMonthly += r.amount / 12;
    });
    document.getElementById("recur-total").textContent = fmt(totalMonthly);
    const cat = (n) => CATS.find((c) => c.name === n) || CATS[CATS.length - 1];
    el.innerHTML = S.recurring
      .map((r, i) => {
        const c = cat(r.cat);
        return `<div class="recur-item">
      <div class="recur-icon" style="background:${c.color}22">${c.icon}</div>
      <div class="recur-info">
        <div class="recur-name">${r.name}</div>
        <div class="recur-meta">${r.freq} · ${r.cat}${r.day ? ` · day ${r.day}` : ""}</div>
      </div>
      <div class="recur-amount">${fmt(r.amount)}</div>
      <button class="del-btn" onclick="deleteRecurring(${i})">✕</button>
    </div>`;
      })
      .join("");
  }
  function addRecurring() {
    const name = document.getElementById("r-name").value.trim();
    const amount = parseFloat(document.getElementById("r-amount").value);
    const cat = document.getElementById("r-cat").value;
    const freq = document.getElementById("r-freq").value;
    const day = parseInt(document.getElementById("r-day").value) || null;
    if (!name || !amount || amount <= 0) {
      toast("Enter name and amount", "err");
      return;
    }
    S.recurring.push({ id: Date.now(), name, amount, cat, freq, day });
    save();
    document.getElementById("r-name").value = "";
    document.getElementById("r-amount").value = "";
    document.getElementById("r-day").value = "";
    hideRecurForm();
    renderRecurring();
    toast("Recurring expense saved ✓");
  }
  function deleteRecurring(i) {
    S.recurring.splice(i, 1);
    save();
    renderRecurring();
    toast("Removed");
  }

  // Auto-log recurring expenses for current month
  function autoLogRecurring() {
    if (!S.recurring.length) return;
    const now = new Date();
    const monthKey = mkNow();
    const currentExpIds = new Set(
      S.expenses
        .filter((e) => e.recurringId)
        .map((e) => `${e.recurringId}-${mk(new Date(e.date))}`),
    );
    let added = 0;
    S.recurring.forEach((r) => {
      const key = `${r.id}-${monthKey}`;
      if (!currentExpIds.has(key) && r.day && now.getDate() >= r.day) {
        const { y, m } = parseMK(monthKey);
        const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(r.day).padStart(2, "0")}`;
        S.expenses.push({
          id: Date.now() + Math.random(),
          amount: r.amount,
          category: r.cat,
          note: r.name,
          date: dateStr,
          recurringId: r.id,
        });
        added++;
      }
    });
    if (added > 0) {
      save();
      toast(
        `${added} recurring expense${added > 1 ? "s" : ""} auto-logged`,
        "inf",
      );
    }
  }

  // ═══════════════════════════════════════════
  //  ADD / DELETE EXPENSES
  // ═══════════════════════════════════════════
  function addExpense() {
    const amount = parseFloat(document.getElementById("f-amount").value);
    const cat = document.getElementById("f-cat").value;
    const note = document.getElementById("f-note").value.trim();
    const date = document.getElementById("f-date").value;
    const recur = document.getElementById("f-recur").value;
    if (!amount || amount <= 0 || !date) {
      toast("Enter a valid amount and date", "err");
      return;
    }
    const exp = { id: Date.now(), amount, category: cat, note, date };
    if (recur) {
      S.recurring.push({
        id: Date.now() + 1,
        name: note || cat,
        amount,
        cat,
        freq: recur,
        day: new Date(date).getDate(),
      });
    }
    S.expenses.push(exp);
    save();
    document.getElementById("f-amount").value = "";
    document.getElementById("f-note").value = "";
    document.getElementById("f-recur").value = "";
    toast("Expense added ✓");
    renderAll();
    renderMonthPills();
  }
  function deleteExpense(id) {
    S.expenses = S.expenses.filter((e) => e.id !== id);
    save();
    renderAll();
    toast("Deleted");
  }

  // ═══════════════════════════════════════════
  //  PAYOUTS
  // ═══════════════════════════════════════════
  function savePayout() {
    const amount = parseFloat(document.getElementById("p-amount").value);
    const month = parseInt(document.getElementById("p-month").value);
    const year = parseInt(document.getElementById("p-year").value);
    const note = document.getElementById("p-note").value.trim();
    if (!amount || amount <= 0) {
      toast("Enter a valid amount", "err");
      return;
    }
    S.payouts = S.payouts.filter(
      (p) => !(p.year === year && p.month === month),
    );
    S.payouts.push({ id: Date.now(), amount, month, year, note });
    save();
    document.getElementById("p-amount").value = "";
    document.getElementById("p-note").value = "";
    toast("Payout saved ✓");
    renderAll();
    renderMonthPills();
    renderPayoutHistory();
  }
  function renderPayoutHistory() {
    const el = document.getElementById("payout-history");
    const sorted = [...S.payouts].sort((a, b) =>
      b.year !== a.year ? b.year - a.year : b.month - a.month,
    );
    if (!sorted.length) {
      el.innerHTML =
        '<div class="empty"><div class="empty-icon">💰</div>No payouts yet</div>';
      return;
    }
    el.innerHTML = sorted
      .map(
        (
          p,
        ) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid var(--border);">
    <div><div style="font-size:12px">${MONTHS[p.month]} ${p.year}</div>${p.note ? `<div style="font-size:10px;color:var(--text3)">${p.note}</div>` : ""}</div>
    <div style="font-size:14px;font-weight:700;color:var(--accent2)">${fmt(p.amount)}</div>
  </div>`,
      )
      .join("");
  }

  // ═══════════════════════════════════════════
  //  HISTORY
  // ═══════════════════════════════════════════
  function renderHistory() {
    const exps = [...monthExpenses(activeMonth)].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    const { m, y } = parseMK(activeMonth);
    document.getElementById("history-title").textContent =
      `${MONTHS[m]} ${y} — All Expenses`;
    document.getElementById("history-total").textContent = fmt(
      exps.reduce((s, e) => s + e.amount, 0),
    );
    renderTxList("history-list", exps, true);
  }

  // ═══════════════════════════════════════════
  //  TX LIST RENDERER
  // ═══════════════════════════════════════════
  function renderTxList(id, list, showDel) {
    const el = document.getElementById(id);
    if (!list.length) {
      el.innerHTML =
        '<div class="empty"><div class="empty-icon">💸</div>Nothing here yet</div>';
      return;
    }
    el.innerHTML = list
      .map((e) => {
        const c =
          CATS.find((x) => x.name === e.category) || CATS[CATS.length - 1];
        const del = showDel
          ? `<button class="del-btn" onclick="deleteExpense(${e.id})">✕</button>`
          : "";
        const recur = e.recurringId ? `<span class="tx-recur">↺</span>` : "";
        return `<div class="tx-row">
      <div class="tx-icon" style="background:${c.color}22">${c.icon}</div>
      <div class="tx-info">
        <div class="tx-name">${e.note || e.category}</div>
        <div class="tx-meta">${e.date} · ${e.category}</div>
      </div>
      <div class="tx-right">
        ${recur}
        <div class="tx-amount" style="color:${c.color}">${fmt(e.amount)}</div>
        ${del}
      </div>
    </div>`;
      })
      .join("");
  }

  // ═══════════════════════════════════════════
  //  CATEGORY DEEP DIVE
  // ═══════════════════════════════════════════
  function renderCatDeep() {
    const exps = monthExpenses(activeMonth);
    const po = monthPayout(activeMonth);
    const payout = po?.amount || 0;
    const byCat = CATS.map((c) => ({
      ...c,
      total: exps
        .filter((e) => e.category === c.name)
        .reduce((s, e) => s + e.amount, 0),
      count: exps.filter((e) => e.category === c.name).length,
    }))
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);
    const el = document.getElementById("cat-deep");
    if (!byCat.length) {
      el.innerHTML =
        '<div class="empty"><div class="empty-icon">📊</div>No data yet</div>';
      return;
    }
    el.innerHTML = byCat
      .map((c) => {
        const pct = payout > 0 ? ((c.total / payout) * 100).toFixed(1) : 0;
        const warn = pct > 30 ? `<span class="cat-badge">HIGH</span>` : "";
        return `<div class="cat-row">
      <div class="cat-header">
        <div class="cat-name">${c.icon} <span style="color:${c.color}">${c.name}</span>${warn}</div>
        <div style="text-align:right"><div style="font-size:12px;font-weight:700;color:${c.color}">${fmt(c.total)}</div><div style="font-size:9px;color:var(--text3)">${c.count} txn${c.count !== 1 ? "s" : ""}</div></div>
      </div>
      <div class="prog-wrap" style="height:5px"><div class="prog-fill" style="width:${Math.min(100, payout > 0 ? (c.total / payout) * 100 : 0)}%;background:${c.color}"></div></div>
      <div style="font-size:9px;color:var(--text3);margin-top:3px">${pct}% of income · avg ${c.count > 0 ? fmt(c.total / c.count) : "$0"}/txn</div>
    </div>`;
      })
      .join("");
  }

  // ═══════════════════════════════════════════
  //  AI ANALYSIS
  // ═══════════════════════════════════════════
  async function runAnalysis() {
    const btn = document.getElementById("analysis-btn");
    const out = document.getElementById("analysis-output");
    const exps = monthExpenses(activeMonth);
    const po = monthPayout(activeMonth);
    const payout = po?.amount || 0;
    const spent = exps.reduce((s, e) => s + e.amount, 0);
    const saved = payout - spent;
    if (!exps.length || !payout) {
      toast("Add expenses and set payout first", "err");
      return;
    }
    btn.disabled = true;
    btn.textContent = "Analyzing…";
    out.innerHTML = `<div style="color:var(--accent2);font-size:12px;text-align:center;padding:36px 0;animation:blink 1.5s infinite">✦ Crunching your numbers…</div>`;

    const byCat = CATS.map((c) => ({
      name: c.name,
      total: exps
        .filter((e) => e.category === c.name)
        .reduce((s, e) => s + e.amount, 0),
    }))
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);
    const savePct = payout > 0 ? ((saved / payout) * 100).toFixed(1) : 0;

    // Compare prev month for context
    const { y, m } = parseMK(activeMonth);
    const prevMK = m === 0 ? `${y - 1}-11` : `${y}-${m - 1}`;
    const prevSpent = monthExpenses(prevMK).reduce((s, e) => s + e.amount, 0);
    const prevPayout = monthPayout(prevMK)?.amount || 0;

    const prompt = `You are a brutally honest financial advisor for a freelancer. No fluff. Be direct, specific, actionable.

CURRENT MONTH: ${monthLabel(activeMonth)}
Payout: ${fmt(payout)} | Spent: ${fmt(spent)} | Saved: ${fmt(saved)} (${savePct}%)
PREV MONTH: Payout: ${prevPayout > 0 ? fmt(prevPayout) : "N/A"} | Spent: ${fmt(prevSpent)}

SPENDING BY CATEGORY:
${byCat.map((c) => `- ${c.name}: ${fmt(c.total)} (${payout > 0 ? ((c.total / payout) * 100).toFixed(1) : 0}% of income)`).join("\n")}

RECENT EXPENSES (last 10):
${exps
  .slice(-10)
  .map(
    (e) =>
      `- ${e.date}: ${fmt(e.amount)} on ${e.category}${e.note ? " (" + e.note + ")" : ""}`,
  )
  .join("\n")}

RECURRING SUBSCRIPTIONS: ${S.recurring.length ? S.recurring.map((r) => `${r.name} ${fmt(r.amount)}/${r.freq}`).join(", ") : "None set"}

Respond ONLY with valid JSON (no markdown). Be brutally honest but with dark humor — like a sarcastic accountant who's seen too much. Roast their spending habits where deserved, but keep it useful:
{"verdict":"one brutal sentence on their financial health","cutbacks":[{"category":"...","reason":"...","target":"specific % or $ reduction"}],"goal":"specific dollar savings goal for next month","danger":"warning if any cat >30% of income or null","quickWins":["stop buying X","cancel Y","reduce Z"],"projectionNote":"one sentence on whether they're on track or heading for trouble this month"}`;

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const json = await res.json();
      const text = json.choices?.[0]?.message?.content || "";
      const a = JSON.parse(text.replace(/```json|```/g, "").trim());
      S.lastAnalysis = a;
      S.lastAnalysisDate = new Date().toLocaleDateString();
      S.lastAnalysisMonthKey = activeMonth;
      save();
      out.innerHTML = buildAnalysisHTML(a);
      toast("Analysis complete ✓");
    } catch (e) {
      out.innerHTML = `<div style="color:var(--red);font-size:12px">Analysis failed — try again</div>`;
      toast("Analysis failed", "err");
    }
    btn.disabled = false;
    btn.textContent = "✦ Analyze Now";
  }
  function buildAnalysisHTML(a) {
    return `
    <div class="verdict-box"><div class="verdict-label">VERDICT</div><div class="verdict-text">"${a.verdict}"</div></div>
    ${a.danger ? `<div class="danger-box"><div class="danger-label">⚠ DANGER ZONE</div><div style="font-size:12px;color:#ffa0b4;line-height:1.5">${a.danger}</div></div>` : ""}
    ${a.projectionNote ? `<div class="warn-box"><div class="warn-label">📊 PROJECTION</div><div style="font-size:12px;color:#ffd980;line-height:1.5">${a.projectionNote}</div></div>` : ""}
    ${a.goal ? `<div class="goal-box"><div class="goal-label">NEXT MONTH GOAL</div><div style="font-size:12px;color:#7eebd3;line-height:1.5">${a.goal}</div></div>` : ""}
    <div style="margin-bottom:14px">
      <div class="sec-label" style="margin-bottom:8px">CUT BACK ON</div>
      ${(a.cutbacks || [])
        .map(
          (c) => `<div class="cutback-item">
        <div style="color:var(--red);font-size:13px;margin-top:2px">↓</div>
        <div><div style="font-size:12px;color:var(--yellow);font-weight:500">${c.category}</div><div style="font-size:11px;color:var(--text2)">${c.reason}</div>${c.target ? `<div style="font-size:10px;color:var(--green);margin-top:2px">Target: ${c.target}</div>` : ""}</div>
      </div>`,
        )
        .join("")}
    </div>
    <div>
      <div class="sec-label" style="margin-bottom:8px">STOP BUYING</div>
      ${(a.quickWins || []).map((w) => `<div class="wins-item"><span style="color:var(--red)">×</span>${w}</div>`).join("")}
    </div>
    <div style="font-size:9px;color:var(--text3);margin-top:14px;letter-spacing:1px">Last updated ${S.lastAnalysisDate || ""}</div>`;
  }

  // ═══════════════════════════════════════════
  //  WEEKLY CHECK-IN
  // ═══════════════════════════════════════════
  function renderCheckinBanner() {
    const area = document.getElementById("checkin-area");
    const needsCheckin =
      !S.lastCheckinDate || isOlderThan(S.lastCheckinDate, 7);
    if (!needsCheckin || !monthExpenses(activeMonth).length) {
      area.innerHTML = "";
      return;
    }
    area.innerHTML = `<div class="checkin-banner" onclick="navigate('analysis')">
    <div class="checkin-icon">📋</div>
    <div class="checkin-text">
      <div class="checkin-title">Weekly check-in available</div>
      <div class="checkin-sub">See how your spending is tracking this week</div>
    </div>
    <div class="checkin-arrow">→</div>
  </div>`;
  }
  function isOlderThan(dateStr, days) {
    if (!dateStr) return true;
    return Date.now() - new Date(dateStr).getTime() > days * 86400000;
  }
  async function runCheckin() {
    const out = document.getElementById("checkin-output");
    const exps = monthExpenses(activeMonth);
    const po = monthPayout(activeMonth);
    if (!exps.length || !po) {
      toast("Add expenses and payout first", "err");
      return;
    }
    out.innerHTML = `<div style="color:var(--accent2);font-size:12px;animation:blink 1.5s infinite;padding:20px 0;text-align:center">Running check-in…</div>`;
    const now = new Date();
    const daysIn = now.getDate();
    const payout = po.amount;
    const spent = exps.reduce((s, e) => s + e.amount, 0);
    const dailyRate = spent / daysIn;
    const prompt = `Freelancer weekly spending check-in. Be concise, 3-4 sentences max. Direct. Add dry humor — like a disappointed but funny financial advisor. Roast where deserved.
Payout: ${fmt(payout)} | Spent so far: ${fmt(spent)} | Days into month: ${daysIn} | Daily rate: ${fmt(dailyRate)}
Give them: 1) quick verdict on their week, 2) one thing to watch, 3) one actionable thing to do today. No JSON, just plain text.`;
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          max_tokens: 300,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const json = await res.json();
      const text = json.choices?.[0]?.message?.content || "";
      S.lastCheckin = text;
      S.lastCheckinDate = new Date().toISOString();
      save();
      out.innerHTML = `<div class="checkin-output">${text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>")}</div>`;
      renderCheckinBanner();
      toast("Check-in complete ✓");
    } catch (e) {
      out.innerHTML = `<div style="color:var(--red);font-size:12px">Failed — try again</div>`;
    }
  }

  // ═══════════════════════════════════════════
  //  QUICK-ADD & NLP
  // ═══════════════════════════════════════════
  function openQuickAdd() {
    document.getElementById("quick-modal").classList.add("open");
    setTimeout(() => document.getElementById("nlp-input").focus(), 100);
  }
  function closeQuickAdd() {
    document.getElementById("quick-modal").classList.remove("open");
    document.getElementById("nlp-input").value = "";
    document.getElementById("nlp-parsed").classList.remove("show");
    document.getElementById("nlp-form").style.display = "none";
    nlpParsed = null;
  }
  function handleNlpKey(e) {
    if (e.key === "Enter") parseNLP();
  }
  async function parseNLP() {
    const input = document.getElementById("nlp-input").value.trim();
    if (!input) return;
    const prompt = `Extract expense details from this text. Return ONLY valid JSON.
Text: "${input}"
Today's date: ${new Date().toISOString().slice(0, 10)}
Categories available: ${CATS.map((c) => c.name).join(", ")}
JSON format: {"amount":number,"category":"exact category name from list","note":"brief description","date":"YYYY-MM-DD"}
If amount not found, use 0. Pick the closest matching category.`;
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          max_tokens: 200,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const json = await res.json();
      const text = json.choices?.[0]?.message?.content || "";
      nlpParsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      document.getElementById("np-amount").textContent = fmt(
        nlpParsed.amount || 0,
      );
      document.getElementById("np-cat").textContent = nlpParsed.category || "—";
      document.getElementById("np-note").textContent = nlpParsed.note || "—";
      document.getElementById("np-date").textContent = nlpParsed.date || "—";
      document.getElementById("nlp-parsed").classList.add("show");
      // Prefill form
      document.getElementById("qa-amount").value = nlpParsed.amount || "";
      const qaCat = document.getElementById("qa-cat");
      if (nlpParsed.category) {
        for (let o of qaCat.options)
          if (o.value === nlpParsed.category) {
            o.selected = true;
            break;
          }
      }
      document.getElementById("qa-note").value = nlpParsed.note || "";
      document.getElementById("qa-date").value =
        nlpParsed.date || new Date().toISOString().slice(0, 10);
      document.getElementById("nlp-form").style.display = "block";
    } catch (e) {
      toast("Could not parse — fill manually", "err");
      document.getElementById("nlp-form").style.display = "block";
      document.getElementById("qa-amount").value = "";
      document.getElementById("qa-date").value = new Date()
        .toISOString()
        .slice(0, 10);
    }
  }
  function confirmQuickAdd() {
    const amount = parseFloat(document.getElementById("qa-amount").value);
    const cat = document.getElementById("qa-cat").value;
    const note = document.getElementById("qa-note").value.trim();
    const date = document.getElementById("qa-date").value;
    if (!amount || amount <= 0 || !date) {
      toast("Enter amount and date", "err");
      return;
    }
    S.expenses.push({ id: Date.now(), amount, category: cat, note, date });
    save();
    closeQuickAdd();
    toast("Added ✓");
    renderAll();
    renderMonthPills();
  }

  // ═══════════════════════════════════════════
  //  SIDEBAR TOGGLE
  // ═══════════════════════════════════════════
  function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("expanded");
  }

  // ═══════════════════════════════════════════
  //  THEME
  // ═══════════════════════════════════════════
  function toggleTheme() {
    S.theme = S.theme === "dark" ? "light" : "dark";
    applyTheme();
    save();
    // Redraw charts after theme change
    setTimeout(() => {
      renderCharts();
      renderCompare();
    }, 100);
  }
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", S.theme);
    document.getElementById("theme-icon").textContent =
      S.theme === "dark" ? "◑" : "●";
    document.getElementById("theme-label").textContent =
      S.theme === "dark" ? "Light Mode" : "Dark Mode";
    document.getElementById("theme-meta").content =
      S.theme === "dark" ? "#080810" : "#f4f3ff";
  }

  // ═══════════════════════════════════════════
  //  CSV EXPORT
  // ═══════════════════════════════════════════
  function exportCSV() {
    const header = "Date,Category,Note,Amount,Recurring\n";
    const rows = S.expenses
      .map(
        (e) =>
          `"${e.date}","${e.category}","${(e.note || "").replace(/"/g, '""')}","${e.amount}","${e.recurringId ? "Yes" : "No"}"`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cashflow-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast("CSV exported ✓");
  }

  // ═══════════════════════════════════════════
  //  KEYBOARD SHORTCUTS
  // ═══════════════════════════════════════════
  document.addEventListener("keydown", (e) => {
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.tagName === "SELECT"
    )
      return;
    if (e.key === "q" || e.key === "Q") openQuickAdd();
    if (e.key === "Escape") closeQuickAdd();
    if (e.key === "1") navigate("dashboard");
    if (e.key === "2") navigate("charts");
    if (e.key === "3") navigate("compare");
    if (e.key === "4") navigate("goals");
    if (e.key === "5") navigate("recurring");
    if (e.key === "6") navigate("analysis");
  });

  // ═══════════════════════════════════════════
  //  TOAST
  // ═══════════════════════════════════════════
  function toast(msg, type = "ok") {
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = msg;
    document.getElementById("toast-container").appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  // ═══════════════════════════════════════════
  //  PWA SERVICE WORKER
  // ═══════════════════════════════════════════
  if ("serviceWorker" in navigator) {
    const swCode = `
    const CACHE='cashflow-v2';
    const ASSETS=['.'];
    self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
    self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
  `;
    const blob = new Blob([swCode], { type: "application/javascript" });
    const swUrl = URL.createObjectURL(blob);
    navigator.serviceWorker.register(swUrl).catch(() => {});
  }

  // ═══════════════════════════════════════════
  //  INIT SELECTS
  // ═══════════════════════════════════════════
  function initSelects() {
    const catOpts = CATS.map(
      (c) => `<option value="${c.name}">${c.icon} ${c.name}</option>`,
    ).join("");
    ["f-cat", "qa-cat", "r-cat"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = catOpts;
    });
    const monOpts = MONTHS.map(
      (m, i) => `<option value="${i}">${m}</option>`,
    ).join("");
    document.getElementById("p-month").innerHTML = monOpts;
    document.getElementById("p-month").value = new Date().getMonth();
    document.getElementById("p-year").value = new Date().getFullYear();
    document.getElementById("f-date").value = new Date()
      .toISOString()
      .slice(0, 10);
    document.getElementById("qa-date").value = new Date()
      .toISOString()
      .slice(0, 10);
  }

  // ═══════════════════════════════════════════
  //  BOOT
  // ═══════════════════════════════════════════
  load();
  applyTheme();
  initSelects();
  renderMonthPills();
  renderAll();
  autoLogRecurring();
  initYearPills();

  // Restore saved analysis if exists
  if (S.lastAnalysis) {
    document.getElementById("analysis-output").innerHTML = buildAnalysisHTML(
      S.lastAnalysis,
    );
  }
  if (S.lastCheckin) {
    document.getElementById("checkin-output").innerHTML =
      `<div class="checkin-output">${S.lastCheckin.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>")}</div>`;
  }

  // Auto weekly analysis trigger
  if (
    S.lastAnalysisMonthKey === mkNow() &&
    S.lastAnalysisDate &&
    isOlderThan(S.lastAnalysisDate, 7)
  ) {
    setTimeout(
      () => toast("Weekly analysis due — head to AI Analysis", "inf"),
      2000,
    );
  }

  // ═══════════════════════════════════════════
  //  DUPLICATE DETECTION
  // ═══════════════════════════════════════════
  function detectDuplicates() {
    const banner = document.getElementById("duplicate-banner");
    if (!banner) return;
    const exps = monthExpenses(activeMonth);
    const seen = {};
    const dupes = [];
    exps.forEach((e) => {
      const key = `${e.date}__${e.amount}__${e.category}`;
      seen[key] = (seen[key] || 0) + 1;
    });
    Object.entries(seen).forEach(([key, count]) => {
      if (count > 1) {
        const [date, amount, category] = key.split("__");
        dupes.push({ date, amount: +amount, category, count });
      }
    });
    if (!dupes.length) {
      banner.style.display = "none";
      return;
    }
    banner.style.display = "block";
    banner.innerHTML = `<div style="background:#ffc94715;border:1px solid var(--yellow);border-radius:10px;padding:12px 16px;">
    <div style="font-size:10px;color:var(--yellow);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">⚠ Possible Duplicates Detected</div>
    ${dupes
      .map(
        (
          d,
        ) => `<div style="font-size:11px;color:var(--text2);padding:3px 0;display:flex;gap:8px;">
      <span style="color:var(--yellow)">!</span>
      <span>${fmt(d.amount)} on <strong>${d.category}</strong> — ${d.date} appears <strong>${d.count}×</strong> — delete extras below</span>
    </div>`,
      )
      .join("")}
  </div>`;
  }

  // ═══════════════════════════════════════════
  //  BACKUP & RESTORE JSON
  // ═══════════════════════════════════════════
  function backupJSON() {
    const blob = new Blob([JSON.stringify(S, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cashflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Backup downloaded ✓");
  }

  function restoreJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!Array.isArray(parsed.expenses) || !Array.isArray(parsed.payouts)) {
          toast("Invalid backup file", "err");
          return;
        }
        const expCount = parsed.expenses.length;
        const payCount = parsed.payouts.length;
        const goalCount = (parsed.goals || []).length;
        const recCount = (parsed.recurring || []).length;
        if (
          !confirm(
            `Restore backup?\n\n• ${expCount} expenses\n• ${payCount} payouts\n• ${goalCount} goals\n• ${recCount} recurring\n\nThis will REPLACE your current data.`,
          )
        ) {
          event.target.value = "";
          return;
        }
        S = {
          expenses: parsed.expenses || [],
          payouts: parsed.payouts || [],
          goals: parsed.goals || [],
          recurring: parsed.recurring || [],
          lastAnalysis: parsed.lastAnalysis || null,
          lastAnalysisDate: parsed.lastAnalysisDate || null,
          lastCheckin: parsed.lastCheckin || null,
          lastCheckinDate: parsed.lastCheckinDate || null,
          lastAnalysisMonthKey: parsed.lastAnalysisMonthKey || null,
          theme: parsed.theme || "dark",
        };
        save();
        applyTheme();
        renderMonthPills();
        renderAll();
        initYearPills();
        toast(`Restored: ${expCount} expenses, ${payCount} payouts ✓`);
      } catch (err) {
        toast("Failed to parse backup file", "err");
      }
      event.target.value = "";
    };
    reader.readAsText(file);
  }

  // ═══════════════════════════════════════════
  //  YEARLY SUMMARY
  // ═══════════════════════════════════════════
  function initYearPills() {
    const el = document.getElementById("year-pills");
    if (!el) return;
    const years = new Set([new Date().getFullYear()]);
    S.expenses.forEach((e) => years.add(new Date(e.date).getFullYear()));
    S.payouts.forEach((p) => years.add(p.year));
    el.innerHTML = [...years]
      .sort()
      .reverse()
      .map(
        (y) =>
          `<button class="month-pill${y === activeYear ? " active" : ""}" onclick="setYear(${y})">${y}</button>`,
      )
      .join("");
  }

  function setYear(y) {
    activeYear = y;
    initYearPills();
    renderYearly();
  }

  function renderYearly() {
    initYearPills();
    const mData = Array.from({ length: 12 }, (_, m) => {
      const key = `${activeYear}-${m}`;
      const exps = monthExpenses(key);
      const payout = monthPayout(key)?.amount || 0;
      const spent = exps.reduce((s, e) => s + e.amount, 0);
      return {
        m,
        key,
        exps,
        payout,
        spent,
        saved: payout - spent,
        label: MONTHS[m],
      };
    });

    const totalIncome = mData.reduce((s, d) => s + d.payout, 0);
    const totalSpent = mData.reduce((s, d) => s + d.spent, 0);
    const totalSaved = totalIncome - totalSpent;
    const avgRate =
      totalIncome > 0 ? ((totalSaved / totalIncome) * 100).toFixed(1) : 0;
    const txnCount = mData.reduce((s, d) => s + d.exps.length, 0);

    // Stats
    document.getElementById("yr-stats").innerHTML = `
    <div class="stat-card c-purple"><div class="stat-label">Total Income ${activeYear}</div><div class="stat-val" style="color:var(--accent2)">${totalIncome > 0 ? fmt(totalIncome) : "$—"}</div><div class="stat-sub">${mData.filter((d) => d.payout > 0).length} paid months</div></div>
    <div class="stat-card c-red"><div class="stat-label">Total Spent</div><div class="stat-val" style="color:var(--red)">${fmt(totalSpent)}</div><div class="stat-sub">${txnCount} transactions</div></div>
    <div class="stat-card c-green"><div class="stat-label">Total Saved</div><div class="stat-val" style="color:${totalSaved >= 0 ? "var(--green)" : "var(--red)"}">${totalIncome > 0 ? fmt(totalSaved) : "$—"}</div><div class="stat-sub">${avgRate}% avg rate</div></div>
    <div class="stat-card c-teal"><div class="stat-label">Avg Monthly Spend</div><div class="stat-val" style="color:var(--teal)">${fmt(totalSpent / 12)}</div><div class="stat-sub">across 12 months</div></div>`;

    // Highlights
    const withPayout = mData.filter((d) => d.payout > 0 && d.saved >= 0);
    const bestSaveMo = withPayout.length
      ? [...withPayout].sort(
          (a, b) => b.saved / b.payout - a.saved / a.payout,
        )[0]
      : null;
    const activeMData = mData.filter((d) => d.spent > 0);
    const worstMo = activeMData.length
      ? [...activeMData].sort((a, b) => b.spent - a.spent)[0]
      : null;
    let streak = 0,
      maxStreak = 0;
    mData.forEach((d) => {
      if (d.payout > 0 && d.saved > 0) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else streak = 0;
    });

    document.getElementById("yr-highlights").innerHTML = `
    <div class="highlight-card">
      <div class="highlight-label">Best Saving Month</div>
      <div class="highlight-val" style="color:var(--green)">${bestSaveMo ? bestSaveMo.label : "—"}</div>
      <div class="highlight-sub">${bestSaveMo ? fmt(bestSaveMo.saved) + " saved (" + ((bestSaveMo.saved / bestSaveMo.payout) * 100).toFixed(0) + "%)" : "No data yet"}</div>
    </div>
    <div class="highlight-card">
      <div class="highlight-label">Highest Spending Month</div>
      <div class="highlight-val" style="color:var(--red)">${worstMo ? worstMo.label : "—"}</div>
      <div class="highlight-sub">${worstMo ? fmt(worstMo.spent) + " spent" : "No data yet"}</div>
    </div>
    <div class="highlight-card">
      <div class="highlight-label">Savings Streak</div>
      <div class="highlight-val" style="color:var(--yellow)">${maxStreak} month${maxStreak !== 1 ? "s" : ""}</div>
      <div class="highlight-sub">consecutive months in the green</div>
    </div>`;

    // Monthly table
    document.getElementById("yr-table").innerHTML = `
    <thead><tr><th>Month</th><th>Income</th><th>Spent</th><th>Saved</th><th>Rate</th><th>Status</th></tr></thead>
    <tbody>${mData
      .map((d) => {
        const rate =
          d.payout > 0 ? ((d.saved / d.payout) * 100).toFixed(0) : null;
        const over = d.payout > 0 && d.spent > d.payout;
        return `<tr>
        <td style="${d.key === activeMonth ? "color:var(--accent2);font-weight:700" : ""}">${d.label}</td>
        <td style="color:var(--accent2)">${d.payout > 0 ? fmt(d.payout) : "—"}</td>
        <td style="color:var(--red)">${d.spent > 0 ? fmt(d.spent) : "—"}</td>
        <td style="color:${d.saved >= 0 ? "var(--green)" : "var(--red)"}">${d.payout > 0 ? fmt(d.saved) : "—"}</td>
        <td>${rate !== null ? `<span class="delta ${+rate >= 20 ? "dn" : "up"}">${rate}%</span>` : "—"}</td>
        <td>${over ? '<span class="delta up">Over budget</span>' : d.payout > 0 && d.spent > 0 ? '<span class="delta dn">On track</span>' : "—"}</td>
      </tr>`;
      })
      .join("")}</tbody>`;

    // Category totals
    const allExps = mData.flatMap((d) => d.exps);
    const catTotals = CATS.map((c) => ({
      ...c,
      total: allExps
        .filter((e) => e.category === c.name)
        .reduce((s, e) => s + e.amount, 0),
    }))
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);
    const catMax = catTotals[0]?.total || 1;
    document.getElementById("yr-cats").innerHTML = catTotals.length
      ? catTotals
          .map(
            (c) => `<div class="cat-row">
        <div class="cat-header">
          <div class="cat-name">${c.icon} <span style="color:${c.color}">${c.name}</span></div>
          <div style="font-size:12px;font-weight:700;color:${c.color}">${fmt(c.total)}</div>
        </div>
        <div class="prog-wrap" style="height:5px;"><div class="prog-fill" style="width:${((c.total / catMax) * 100).toFixed(0)}%;background:${c.color}"></div></div>
        <div style="font-size:9px;color:var(--text3);margin-top:3px">${totalSpent > 0 ? ((c.total / totalSpent) * 100).toFixed(1) : 0}% of total</div>
      </div>`,
          )
          .join("")
      : '<div class="empty"><div class="empty-icon">📊</div>No data</div>';

    // Yearly line chart
    const { grid, text } = getChartColors();
    const ctx = document.getElementById("yr-line-chart").getContext("2d");
    if (yrLineChart) yrLineChart.destroy();
    yrLineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: mData.map((d) => d.label),
        datasets: [
          {
            label: "Income",
            data: mData.map((d) => d.payout || null),
            borderColor: "#6c47ff",
            backgroundColor: "#6c47ff18",
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: "#6c47ff",
          },
          {
            label: "Expenses",
            data: mData.map((d) => d.spent || null),
            borderColor: "#ff4d6d",
            backgroundColor: "#ff4d6d15",
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: "#ff4d6d",
          },
          {
            label: "Saved",
            data: mData.map((d) =>
              d.payout > 0 ? Math.max(0, d.saved) : null,
            ),
            borderColor: "#00e5a0",
            backgroundColor: "#00e5a010",
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: "#00e5a0",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: text,
              font: { family: "JetBrains Mono", size: 10 },
              boxWidth: 12,
            },
          },
        },
        scales: {
          x: {
            grid: { color: grid },
            ticks: {
              color: text,
              font: { family: "JetBrains Mono", size: 10 },
            },
          },
          y: {
            grid: { color: grid },
            ticks: {
              color: text,
              font: { family: "JetBrains Mono", size: 10 },
              callback: (v) => fmtShort(v),
            },
            suggestedMin: 0,
          },
        },
      },
    });
  }

  // ═══════════════════════════════════════════
  //  PDF REPORT (browser print)
  // ═══════════════════════════════════════════
  function printPDFReport() {
    document
      .querySelectorAll(".page")
      .forEach((p) => p.classList.remove("active"));
    document.getElementById("page-yearly").classList.add("active");
    setTimeout(() => window.print(), 400);
  }

  // ── call init after boot ──
  initYearPills();

  // ═══════════════════════════════════════════
  //  NOTIFICATIONS
  // ═══════════════════════════════════════════

  function loadNotifications() {
    try {
      notifications = JSON.parse(
        localStorage.getItem("cashflow_notifs") || "[]",
      );
    } catch {
      notifications = [];
    }
  }
  function saveNotifications() {
    localStorage.setItem(
      "cashflow_notifs",
      JSON.stringify(notifications.slice(0, 50)),
    );
  }
  loadNotifications();

  function addNotification(type, msg, pushAlso = true) {
    const n = {
      id: Date.now() + Math.random(),
      type,
      msg,
      time: new Date().toISOString(),
      read: false,
    };
    notifications.unshift(n);
    saveNotifications();
    renderNotifBadge();
    renderNotifList();
    if (pushAlso) sendPushNotification(type, msg);
  }

  function renderNotifBadge() {
    const unread = notifications.filter((n) => !n.read).length;
    const el = document.getElementById("notif-count");
    if (!el) return;
    el.style.display = unread > 0 ? "flex" : "none";
    el.textContent = unread > 9 ? "9+" : unread;
  }

  function renderNotifList() {
    const el = document.getElementById("notif-list");
    if (!el) return;
    if (!notifications.length) {
      el.innerHTML =
        '<div style="color:var(--text3);font-size:12px;text-align:center;padding:30px 0;">No notifications yet</div>';
      return;
    }
    const typeIcon = { budget: "💸", recurring: "↺", goal: "◎", system: "✦" };
    const typeColor = {
      budget: "var(--red)",
      recurring: "var(--yellow)",
      goal: "var(--green)",
      system: "var(--teal)",
    };
    el.innerHTML = notifications
      .map(
        (n) => `
    <div class="notif-item ${n.read ? "" : "unread"}" onclick="markRead('${n.id}')">
      <div class="notif-type" style="color:${typeColor[n.type] || "var(--text3)"};">${typeIcon[n.type] || "•"} ${n.type}</div>
      <div class="notif-msg">${n.msg}</div>
      <div class="notif-time">${timeAgo(n.time)}</div>
    </div>`,
      )
      .join("");
  }

  function markRead(id) {
    notifications = notifications.map((n) =>
      n.id == id ? { ...n, read: true } : n,
    );
    saveNotifications();
    renderNotifBadge();
    renderNotifList();
  }

  function clearNotifs() {
    notifications = [];
    saveNotifications();
    renderNotifBadge();
    renderNotifList();
  }

  function openNotifPanel() {
    document.getElementById("notif-panel")?.classList.add("open");
    document.getElementById("notif-backdrop")?.classList.add("show");
    notifications.forEach((n) => (n.read = true));
    saveNotifications();
    renderNotifBadge();
    renderNotifList();
  }

  function closeNotifPanel() {
    document.getElementById("notif-panel")?.classList.remove("open");
    document.getElementById("notif-backdrop")?.classList.remove("show");
  }

  function timeAgo(iso) {
    const diff = (Date.now() - new Date(iso)) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  async function requestNotifPermission() {
    if (!("Notification" in window)) {
      toast("Notifications not supported in this browser", "err");
      return;
    }
    if (location.protocol === "file:") {
      toast(
        "Push alerts require the app to be hosted — in-app alerts still work",
        "err",
      );
      const btn = document.getElementById("notif-perm-btn");
      if (btn) btn.textContent = "⚠ Host app to enable push";
      return;
    }
    const perm = await Notification.requestPermission();
    const btn = document.getElementById("notif-perm-btn");
    if (perm === "granted") {
      if (btn) {
        btn.textContent = "✓ Push Alerts Enabled";
        btn.classList.add("granted");
      }
      toast("Push alerts enabled ✓");
    } else {
      if (btn) btn.textContent = "Permission Denied";
      toast("Permission denied — in-app alerts still work", "err");
    }
  }

  function sendPushNotification(type, body) {
    if (location.protocol === "file:") return;
    if (Notification.permission !== "granted") return;
    const titles = {
      budget: "💸 Budget Alert",
      recurring: "↺ Recurring Reminder",
      goal: "◎ Goal Update",
      system: "✦ Cashflow",
    };
    try {
      new Notification(titles[type] || "Cashflow", {
        body,
        tag: `cashflow-${type}`,
      });
    } catch (e) {}
  }

  (function syncNotifBtn() {
    const btn = document.getElementById("notif-perm-btn");
    if (!btn) return;
    if (location.protocol === "file:") {
      btn.textContent = "⚠ Host app to enable push";
      return;
    }
    if (Notification.permission === "granted") {
      btn.textContent = "✓ Push Alerts Enabled";
      btn.classList.add("granted");
    } else if (Notification.permission === "denied") {
      btn.textContent = "Permission Denied";
    }
  })();

  // ─── Init notif badge on load ───
  renderNotifBadge();

  // ═══════════════════════════════════════════
  //  SMART NOTIFICATION CHECKS
  // ═══════════════════════════════════════════
  function checkAllNotifications() {
    checkBudgetAlert();
    checkRecurringReminders();
  }

  function checkBudgetAlert() {
    const payout = monthPayout(activeMonth);
    if (!payout || !payout.amount) return;
    const spent = monthExpenses(activeMonth).reduce((s, e) => s + e.amount, 0);
    const pct = spent / payout.amount;
    const daysLeft = daysRemainingInMonth();
    const alertKey = `cashflow_budget_alerted_${activeMonth}`;
    const alerted80 = localStorage.getItem(alertKey + "_80");
    const alerted100 = localStorage.getItem(alertKey + "_100");
    if (pct >= 1.0 && !alerted100) {
      addNotification(
        "budget",
        `You've spent 100% of your ${monthLabel(activeMonth)} income (${fmt(spent)} / ${fmt(payout.amount)}) — you're in the red.`,
      );
      localStorage.setItem(alertKey + "_100", "1");
    } else if (pct >= 0.8 && !alerted80) {
      addNotification(
        "budget",
        `You've spent 80% of your ${monthLabel(activeMonth)} income with ${daysLeft} day${daysLeft !== 1 ? "s" : ""} left — ${fmt(payout.amount - spent)} remaining.`,
      );
      localStorage.setItem(alertKey + "_80", "1");
    }
  }

  function checkRecurringReminders() {
    if (!S.recurring.length) return;
    const today = new Date();
    const tomorrow = today.getDate() + 1;
    const alertKey = `cashflow_recur_alerted_${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const alerted = new Set(JSON.parse(localStorage.getItem(alertKey) || "[]"));
    const newAlerts = [];
    S.recurring.forEach((r) => {
      if (
        r.freq === "monthly" &&
        r.day === tomorrow &&
        !alerted.has(String(r.id))
      ) {
        addNotification(
          "recurring",
          `Heads up: your ${r.name} subscription (${fmt(r.amount)}) hits tomorrow (day ${r.day}).`,
        );
        newAlerts.push(String(r.id));
      }
    });
    if (newAlerts.length)
      localStorage.setItem(
        alertKey,
        JSON.stringify([...alerted, ...newAlerts]),
      );
  }

  function daysRemainingInMonth() {
    const now = new Date();
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return last - now.getDate();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkAllNotifications();
  });

  // Run on load
  checkAllNotifications();