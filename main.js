const BACKEND_URL = "https://vercel-deploy-xptk.vercel.app/";

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
  { name: "Food & Dining", icon: "UtensilsCrossed", color: "#ff6b6b" },
  { name: "Transport", icon: "Car", color: "#00d4c8" },
  { name: "Software & Tools", icon: "Laptop", color: "#60a5fa" },
  { name: "Entertainment", icon: "Gamepad2", color: "#a78bfa" },
  { name: "Health", icon: "Pill", color: "#fbbf24" },
  { name: "Housing", icon: "Home", color: "#f472b6" },
  { name: "Shopping", icon: "ShoppingBag", color: "#f97316" },
  { name: "Education", icon: "BookOpen", color: "#34d399" },
  { name: "Other", icon: "Package", color: "#94a3b8" },
];
const CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar" },
  EUR: { symbol: "€", name: "Euro" },
  GBP: { symbol: "£", name: "British Pound" },
  INR: { symbol: "₹", name: "Indian Rupee" },
  JPY: { symbol: "¥", name: "Japanese Yen" },
  CAD: { symbol: "C$", name: "Canadian Dollar" },
  AUD: { symbol: "A$", name: "Australian Dollar" },
  CHF: { symbol: "CHF", name: "Swiss Franc" },
  CNY: { symbol: "¥", name: "Chinese Yuan" },
  AED: { symbol: "د.إ", name: "UAE Dirham" },
  NGN: { symbol: "₦", name: "Nigerian Naira" },
};

// ═══════════════════════════════════════════
//  LUCIDE ICON HELPER
// ═══════════════════════════════════════════
function getLucideIcon(name, size = 24) {
  const icons = {
    UtensilsCrossed: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h-2.5A2.5 2.5 0 0 0 11 5.5v13a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V5.5a1 1 0 0 1 1-1h.5a1 1 0 0 1 1 1v13a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V5.5A2.5 2.5 0 0 0 16 3"></path><path d="M2 12.5a6.5 6.5 0 0 1 13 0"></path></svg>`,
    Car: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.5 0 1-.5 1-1v-3c0-.9-.7-1.7-1.5-1.8C18.4 10.5 16.9 10 15.5 10c-.6 0-1.2-.1-1.7-.3l-1.2-5.2c-.1-.4-.5-.7-1-. 7-2h-3c-.5 0-1 .5-1 1v.5"></path><circle cx="6" cy="17" r="2"></circle><circle cx="18" cy="17" r="2"></circle></svg>`,
    Laptop: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path><path d="M6 17v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2"></path></svg>`,
    Gamepad2: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h4m-2-2v4"></path><circle cx="13" cy="11" r="1"></circle><circle cx="13" cy="15" r="1"></circle><circle cx="16" cy="13" r="1"></circle><path d="M5 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z"></path></svg>`,
    Pill: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6m-11 1 17-17m-2.5 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"></path></svg>`,
    Home: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    ShoppingBag: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
    BookOpen: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
    Package: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    X: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6l-12 12M6 6l12 12"></path></svg>`,
    Bell: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
    Copy: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`,
    Download: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
    AlertTriangle: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    Save: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`,
    BarChart3: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"></path><rect x="7" y="16" width="4" height="4"></rect><rect x="15" y="10" width="4" height="10"></rect><rect x="11" y="13" width="4" height="7"></rect></svg>`,
    TrendingUp: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
    Palette: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="13" r="8"></circle><path d="M5.5 11.5a7.5 7.5 0 1 0 10.5 10.5"></path><circle cx="5.5" cy="5.5" r="1"></circle><circle cx="18" cy="5" r="1"></circle><circle cx="20" cy="11" r="1"></circle><circle cx="15" cy="20" r="1"></circle></svg>`,
    Lightbulb: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.83-1.48 1.5-2.75 1.5-4.5A6 6 0 0 0 6 9.5c0 1.75.67 3 1.5 4.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>`,
    ArrowLeftRight: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline><polyline points="5 12 12 5 19 12"></polyline></svg>`,
    Target: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="12" r="9"></circle></svg>`,
    RotateCw: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2-8.83"></path></svg>`,
    Sparkles: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6"></path><path d="M15.5 3.5l4.5 4.5"></path><path d="M15 9h6"></path><path d="M3 15h6"></path><path d="M3.5 15.5l4.5 4.5"></path><path d="M3 21h6"></path></svg>`,
    Plus: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    Menu: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line></svg>`,
    Grid: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    Check: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    Clipboard: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`,
    Wallet: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 24H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14c0 1.1-.9 2-2 2z"></path><path d="M16.5 11.5v3"></path></svg>`,
  };
  return icons[name] || "";
}

// Currency to Regional/Economic Context Mapping
const CURRENCY_CONTEXT = {
  USD: {
    region: "United States",
    economicContext:
      "Operating in a developed market with inflation around 3-4%, strong consumer spending trends, tech sector volatility. Cost of living varies significantly by region.",
  },
  EUR: {
    region: "Eurozone",
    economicContext:
      "Operating in developed EU markets facing moderate inflation (2-3%), energy cost concerns, stable regulatory environment. Strong purchasing power in most regions.",
  },
  GBP: {
    region: "United Kingdom",
    economicContext:
      "Developed market with inflation around 3-4%, post-Brexit economic adjustments, strong finance sector. Standard of living generally high but costs rising.",
  },
  INR: {
    region: "India",
    economicContext:
      "Emerging market with growing economy, inflation 5-6%, rapidly rising cost of living in tech hubs, lower overhead costs overall. Strong growth potential.",
  },
  JPY: {
    region: "Japan",
    economicContext:
      "Developed market with low inflation (1-2%), conservative consumer spending, strong currency, aging demographic affecting market. Stable costs.",
  },
  CAD: {
    region: "Canada",
    economicContext:
      "Developed market with inflation 3-4%, energy sector importance, tech growth, regional cost variations. Similar to US economic patterns.",
  },
  AUD: {
    region: "Australia",
    economicContext:
      "Developed market with inflation 3-5%, commodity-driven economy, higher costs of living (especially housing), strong employment trends.",
  },
  CHF: {
    region: "Switzerland",
    economicContext:
      "Developed market with low inflation (1-2%), high cost of living, strong currency, banking & finance dominance. Stable but expensive.",
  },
  CNY: {
    region: "China",
    economicContext:
      "Emerging economy in transition, moderate inflation (2-3%), significant regional disparities, strong manufacturing base, rapid urbanization.",
  },
  AED: {
    region: "United Arab Emirates",
    economicContext:
      "Growing economy dependent on oil/tourism, low inflation, high salaries & expat population, tax advantages. Premium lifestyle costs.",
  },
  NGN: {
    region: "Nigeria",
    economicContext:
      "Emerging African market, high inflation (25-30%), currency volatility, oil-dependent economy, rising cost of living in urban areas. Significant growth potential.",
  },
};
const SK = "cashero_v2";

// ═══════════════════════════════════════════
//  SECURITY UTILITIES
// ═══════════════════════════════════════════
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ═══════════════════════════════════════════
//  EFF WORDLIST (for recovery phrases)
// ═══════════════════════════════════════════
const EFF_WORDLIST = [
  "ability",
  "able",
  "about",
  "above",
  "absent",
  "absorb",
  "abstract",
  "absurd",
  "abuse",
  "access",
  "accident",
  "account",
  "accuse",
  "achieve",
  "acid",
  "acoustic",
  "acquire",
  "acre",
  "across",
  "act",
  "action",
  "activate",
  "active",
  "activity",
  "actual",
  "acute",
  "adapt",
  "add",
  "addict",
  "added",
  "address",
  "adjust",
  "admin",
  "admit",
  "adobe",
  "adopt",
  "adore",
  "adorn",
  "adult",
  "advance",
  "advent",
  "adverb",
  "advice",
  "advise",
  "affair",
  "afford",
  "afraid",
  "africa",
  "after",
  "again",
  "against",
  "agency",
  "agenda",
  "agent",
  "agree",
  "ahead",
  "aimed",
  "aiming",
  "air",
  "airplane",
  "aisle",
  "alarm",
  "album",
  "alert",
  "alien",
  "align",
  "alike",
  "alive",
  "all",
  "alley",
  "allied",
  "allies",
  "allot",
  "allow",
  "alloy",
  "allude",
  "allure",
  "ally",
  "almond",
  "almost",
  "alone",
  "along",
  "aloud",
  "alpha",
  "already",
  "also",
  "altar",
  "alter",
  "always",
  "amateur",
  "amaze",
  "amber",
  "ambiance",
  "ambiguous",
  "ambition",
  "ambitious",
  "ambush",
  "amend",
  "amendment",
  "amends",
  "amenity",
  "amid",
  "amidst",
  "amiss",
  "ammo",
  "among",
  "amongst",
  "amount",
  "amour",
  "ample",
  "amuse",
  "amusement",
  "amusing",
  "an",
  "ana",
  "anachronism",
  "anaemic",
  "anagramming",
  "anal",
  "anally",
  "analogies",
  "analogical",
  "analogously",
  "analogue",
  "analogy",
  "analyse",
  "analysed",
  "analyses",
  "analysing",
  "analysis",
  "analyst",
  "analytic",
  "analytical",
  "analytically",
  "analytics",
  "analyze",
  "analyzed",
  "analyzer",
  "analyzing",
  "anarchy",
  "anatomical",
  "anatomically",
  "anatomies",
  "anatomise",
  "anatomised",
  "anatomises",
  "anatomising",
  "anatomist",
  "anatomy",
  "ancestor",
  "ancestral",
  "ancestors",
  "ancestries",
  "ancestry",
  "anchor",
  "anchorages",
  "anchored",
  "anchoring",
  "anchors",
  "anchovy",
  "ancient",
  "ancientest",
  "anciently",
  "ancientness",
  "ancients",
  "ancillaries",
  "ancillary",
  "and",
  "andante",
  "andiron",
  "andirrons",
  "andirons",
  "android",
  "androids",
  "anecdotal",
  "anecdotally",
  "anecdote",
  "anecdotes",
  "anecdotist",
  "anele",
  "aneles",
  "aneling",
  "anemia",
  "anemias",
  "anaemic",
  "anemically",
  "anemometer",
  "anemometers",
  "anemone",
  "anemones",
  "anent",
  "anergy",
  "aneroid",
  "aneroids",
  "anesthesia",
  "anesthesias",
  "anesthetic",
  "anesthetically",
  "anestheticist",
  "anesthetics",
  "anesthetisation",
  "anesthetise",
  "anesthetised",
  "anesthetises",
  "anesthetising",
  "anesthetist",
  "anesthetists",
  "anesthetization",
];

// ═══════════════════════════════════════════
//  ⚠ API CALL
// ═══════════════════════════════════════════

const OPENAI_MODEL = "gpt-4o-mini"; // or 'gpt-4o' for smarter analysis
const PAGE_META = {
  dashboard: { title: "Dashboard", sub: "Your financial overview" },
  summary: { title: "Monthly Summary", sub: "Spending insights & analytics" },
  charts: { title: "Charts", sub: "Visual spending breakdown" },
  compare: { title: "Compare", sub: "Month-over-month analysis" },
  goals: { title: "Savings Goals", sub: "Track your targets" },
  recurring: { title: "Recurring", sub: "Subscriptions & fixed costs" },
  analysis: { title: "AI Analysis", sub: "Personalized insights" },
  add: { title: "Add Expense", sub: "Log new spending" },
  payouts: { title: "Payouts", sub: "Monthly income" },
  history: { title: "History", sub: "All transactions" },
  yearly: { title: "Yearly Report", sub: "Annual overview + PDF export" },
  settings: { title: "Settings", sub: "Preferences & security" },
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
  pinEnabled: false,
  currency: "USD",
  autoLockTimeout: 15,
};
let activeMonth = mkNow();
let activeYear = new Date().getFullYear();
let donutChart = null,
  lineChart = null,
  savingsChart = null,
  yrLineChart = null;
let chartJsPromise = null;
let nlpParsed = null;
let analysisLastRun = null;
let analysisCountdownInterval = null;
let notifications = [];

// ═══════════════════════════════════════════
//  PERSISTENCE
// ═══════════════════════════════════════════
function load() {
  try {
    const storedState = CasheroStorage.readJSON(SK);
    if (storedState !== null) {
      if (
        !storedState ||
        typeof storedState !== "object" ||
        Array.isArray(storedState)
      ) {
        throw new Error("Saved application data has an invalid format.");
      }
      for (const key of ["expenses", "payouts", "goals", "recurring"]) {
        if (
          storedState[key] !== undefined &&
          !Array.isArray(storedState[key])
        ) {
          throw new Error(`Saved application data has an invalid "${key}" list.`);
        }
      }
      S = { ...S, ...storedState };
    }

    // Restore cooldown timestamp from localStorage
    const lastAnalysisTime = CasheroStorage.getItem("cashero_last_analysis");
    if (lastAnalysisTime) {
      const parsedTime = Number.parseInt(lastAnalysisTime, 10);
      if (Number.isFinite(parsedTime)) analysisLastRun = parsedTime;
    }
  } catch (error) {
    CasheroErrors.reportError(error, "Could not restore saved application data");
  }
}
function save() {
  CasheroStorage.writeJSON(SK, S);
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
    const d = expenseDate(e.date);
    return d && mk(d) === mk2;
  });
}
function monthPayout(mk2) {
  const { y, m } = parseMK(mk2);
  return S.payouts.find((p) => p.year == y && p.month == m);
}
function fmt(n) {
  const curr = CURRENCIES[S.currency] || CURRENCIES.USD;
  return (
    curr.symbol +
    Number(n).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
function fmtShort(n) {
  const curr = CURRENCIES[S.currency] || CURRENCIES.USD;
  return n >= 1000 ? curr.symbol + (n / 1000).toFixed(1) + "k" : fmt(n);
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
        `<button class="month-pill${k === activeMonth ? " active" : ""}" onclick="setMonth('${k}')"><i class="fa-solid fa-calendar"></i> ${monthLabel(k)}</button>`,
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
  const activePage = document.querySelector(".page.active")?.id;
  if (activePage) renderPage(activePage.replace(/^page-/, ""));
}
function renderPage(page) {
  if (page === "dashboard") renderDashboard();
  else if (page === "summary") renderMonthlySummary();
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
  else if (page === "settings") renderSettings();
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
  // Compute financial health
  const healthScore = computeFinancialHealth(exps, payout);
  const healthColor =
    healthScore > 75
      ? "var(--green)"
      : healthScore > 50
        ? "var(--yellow)"
        : "var(--red)";

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
    </div>
    <div class="stat-card c-olive">
      <div class="stat-label">Health Score</div>
      <div class="stat-val" style="color:${healthColor}">${healthScore}</div>
      <div class="stat-sub">0-100 (higher is better)</div>
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
  document.getElementById("budget-left").textContent =
    payout > 0 ? fmt(spent) + " spent" : "Set payout";
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
          <div class="cat-name"><span style="display:inline-block;width:16px;height:16px;margin-right:6px">${getLucideIcon(c.icon, 16)}</span><span style="color:${c.color}">${c.name}</span>${warn}</div>
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
  renderSpendingBehavior();
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
//  FINANCIAL HEALTH SCORE
// ═══════════════════════════════════════════
function computeFinancialHealth(exps, payout) {
  if (!payout) return 40; // unknown baseline
  const spent = exps.reduce((s, e) => s + e.amount, 0);
  const saved = Math.max(0, payout - spent);
  const savePct = Math.max(0, Math.min(100, (saved / payout) * 100));

  const avg = exps.length ? spent / exps.length : 0;
  const sd = exps.length
    ? Math.sqrt(
        exps.reduce((s, e) => s + Math.pow(e.amount - avg, 2), 0) / exps.length,
      )
    : 0;
  const volatility = avg ? Math.min(100, (sd / avg) * 100) : 0; // %

  const discCats = ["Shopping", "Entertainment", "Software & Tools"];
  const disc = exps
    .filter((e) => discCats.includes(e.category))
    .reduce((s, e) => s + e.amount, 0);
  const discPct = Math.min(100, (disc / payout) * 100);

  // Weighted components: savings (50%), volatility (25%), discretionary (25%)
  const s1 = savePct; // higher is better
  const s2 = 100 - volatility; // higher is better
  const s3 = 100 - discPct; // higher is better

  const score = Math.round(s1 * 0.5 + s2 * 0.25 + s3 * 0.25);
  return Math.max(0, Math.min(100, score));
}

// ═══════════════════════════════════════════
//  ANOMALY DETECTION
// ═══════════════════════════════════════════
function expenseDate(dateValue) {
  const dateText = String(dateValue);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(dateText)
    ? new Date(`${dateText}T12:00:00`)
    : new Date(dateValue);
  return Number.isNaN(date.getTime()) ? null : date;
}

function median(values) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function getUnusualTransaction(expense) {
  const date = expenseDate(expense.date);
  if (!date) return null;

  const baseline = S.expenses
    .filter((candidate) => {
      if (candidate === expense || candidate.category !== expense.category)
        return false;
      const candidateDate = expenseDate(candidate.date);
      const daysBefore = candidateDate
        ? (date - candidateDate) / 86400000
        : -1;
      return daysBefore > 0 && daysBefore <= 90;
    })
    .map((candidate) => candidate.amount);

  if (baseline.length < 3) return null;
  const typicalAmount = median(baseline);
  if (typicalAmount <= 0 || expense.amount < typicalAmount * 3) return null;

  return { typicalAmount };
}

function notifyIfUnusualTransaction(expense) {
  const unusual = getUnusualTransaction(expense);
  if (!unusual) return;
  addNotification(
    "suspicious",
    `Unusually large ${expense.category} transaction: ${fmt(expense.amount)} is more than 3× your recent typical amount (${fmt(unusual.typicalAmount)}). Review it if you don't recognize it.`,
  );
}

function getSpendingPatterns(monthKey) {
  const expenses = monthExpenses(monthKey);
  const { y, m } = parseMK(monthKey);
  const previousMonthKey = m === 0 ? `${y - 1}-11` : `${y}-${m - 1}`;
  const previousMonth = monthExpenses(previousMonthKey);
  const isCurrentMonth = monthKey === mkNow();
  const dayCutoff = isCurrentMonth ? new Date().getDate() : 31;
  const inPeriod = (expense) => {
    const date = expenseDate(expense.date);
    return date && date.getDate() <= dayCutoff;
  };
  const currentToDate = expenses.filter(inPeriod);
  const previousToDate = previousMonth.filter(inPeriod);

  const categoryChanges = CATS.flatMap((category) => {
    const current = currentToDate
      .filter((expense) => expense.category === category.name)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const previous = previousToDate
      .filter((expense) => expense.category === category.name)
      .reduce((sum, expense) => sum + expense.amount, 0);
    if (previous <= 0 || current <= previous * 1.5) return [];
    return [{ category, current, previous, increase: Math.round((current / previous - 1) * 100) }];
  });

  const recurringGroups = new Map();
  S.expenses.forEach((expense) => {
    const name = String(expense.note || "").trim().toLowerCase().replace(/\s+/g, " ");
    if (!name) return;
    const key = `${expense.category}|${name}`;
    if (!recurringGroups.has(key)) recurringGroups.set(key, []);
    recurringGroups.get(key).push(expense);
  });

  const likelyRecurring = new Set(
    currentToDate
      .filter((expense) => expense.recurringId)
  );
  const currentExpenseSet = new Set(currentToDate);
  recurringGroups.forEach((group) => {
    const months = new Set(
      group.map((expense) => {
        const date = expenseDate(expense.date);
        return date ? mk(date) : null;
      }).filter(Boolean),
    );
    const typicalAmount = median(group.map((expense) => expense.amount));
    const amounts = group.map((expense) => expense.amount);
    const amountsAreSimilar =
      typicalAmount > 0 &&
      amounts.reduce((maximum, amount) => Math.max(maximum, amount), -Infinity) -
        amounts.reduce((minimum, amount) => Math.min(minimum, amount), Infinity) <=
        typicalAmount * 0.1;
    if (months.size < 2 || !amountsAreSimilar) return;
    group.forEach((expense) => {
      const date = expenseDate(expense.date);
      if (date && mk(date) === monthKey && currentExpenseSet.has(expense))
        likelyRecurring.add(expense);
    });
  });

  const recentExpenses = [...currentToDate]
    .sort((a, b) => expenseDate(b.date) - expenseDate(a.date))
    .slice(0, 100);
  const unusualTransactions = recentExpenses
    .map((expense) => {
      const unusual = getUnusualTransaction(expense);
      return unusual ? { expense, typicalAmount: unusual.typicalAmount } : null;
    })
    .filter(Boolean)
    .slice(0, 3);

  const payout = monthPayout(monthKey)?.amount || 0;
  const spent = currentToDate.reduce((sum, expense) => sum + expense.amount, 0);
  const { y: monthYear, m: monthIndex } = parseMK(monthKey);
  const daysInMonth = new Date(monthYear, monthIndex + 1, 0).getDate();
  const daysRemaining = isCurrentMonth
    ? Math.max(0, daysInMonth - new Date().getDate())
    : 0;
  const advice =
    payout > 0 && isCurrentMonth && daysRemaining > 0
      ? spent < payout
        ? `You have ${fmt(payout - spent)} of income left. To stay within it, aim for an average of ${fmt((payout - spent) / daysRemaining)} per day over the next ${daysRemaining} days.`
        : `Spending is ${fmt(spent - payout)} over this month's income. Pause non-essential purchases for the remaining ${daysRemaining} days.`
      : categoryChanges.length
        ? `Review ${categoryChanges[0].category.name} transactions: spending is ${categoryChanges[0].increase}% higher than the same point last month.`
        : payout <= 0 && isCurrentMonth && daysRemaining > 0
          ? "Add this month's income to get a daily spending target tailored to the days remaining."
          : "";

  return {
    expenses: currentToDate,
    categoryChanges,
    unusualTransactions,
    recurringCount: likelyRecurring.size,
    oneTimeCount: currentToDate.length - likelyRecurring.size,
    advice,
  };
}

function detectAnomalies() {
  const area = document.getElementById("anomaly-area");
  if (!area) return;
  const patterns = getSpendingPatterns(activeMonth);
  if (
    !patterns.expenses.length &&
    !(activeMonth === mkNow() && monthPayout(activeMonth)?.amount)
  ) {
    area.innerHTML = "";
    return;
  }

  const hasInsights =
    patterns.categoryChanges.length ||
    patterns.unusualTransactions.length ||
    patterns.advice;
  area.innerHTML = `<div class="card anomaly-card" style="margin-bottom:18px;">
    <div class="anomaly-header">
      <div class="anomaly-dot"></div>
      <div class="anomaly-title">Spending patterns</div>
    </div>
    ${patterns.unusualTransactions
      .map(
        ({ expense, typicalAmount }) =>
          `<div class="anomaly-item"><span class="arrow">!</span><span>Unusually large ${escapeHtml(expense.category)} transaction: ${fmt(expense.amount)} vs ${fmt(typicalAmount)} typical. Check it if you don't recognize it.</span></div>`,
      )
      .join("")}
    ${patterns.categoryChanges
      .map(
        ({ category, current, previous, increase }) =>
          `<div class="anomaly-item"><span class="arrow">↑</span><span><strong style="color:var(--yellow)">${escapeHtml(category.name)}</strong> is up ${increase}% vs the same point last month (${fmt(previous)} → ${fmt(current)}).</span></div>`,
      )
      .join("")}
    <div class="anomaly-item anomaly-classification"><span class="arrow">↻</span><span>${patterns.recurringCount} likely recurring · ${patterns.oneTimeCount} likely one-time transaction${patterns.oneTimeCount === 1 ? "" : "s"} this period. Repeated named expenses are matched across months.</span></div>
    ${patterns.advice ? `<div class="anomaly-advice">${escapeHtml(patterns.advice)}</div>` : ""}
    ${!hasInsights ? '<div class="anomaly-item">No unusual changes detected so far this period.</div>' : ""}
  </div>`;
}

function normalizeExpenseNote(note) {
  return String(note || "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function getLearnedCategorySuggestion(note) {
  const normalizedNote = normalizeExpenseNote(note);
  if (!normalizedNote) return null;

  const counts = new Map();
  let total = 0;
  S.expenses.forEach((expense) => {
    if (
      normalizeExpenseNote(expense.note) !== normalizedNote ||
      !CATS.some((category) => category.name === expense.category)
    ) {
      return;
    }
    counts.set(expense.category, (counts.get(expense.category) || 0) + 1);
    total++;
  });

  const [category, count] = [...counts.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0] || [];
  return count >= 2 && count / total >= 0.75
    ? { category, count }
    : null;
}

function updateCategorySuggestion(noteId, categoryId, suggestionId) {
  const note = document.getElementById(noteId);
  const categorySelect = document.getElementById(categoryId);
  const suggestion = document.getElementById(suggestionId);
  if (!note || !categorySelect || !suggestion) return;

  const learned = getLearnedCategorySuggestion(note.value);
  suggestion.replaceChildren();
  suggestion.hidden = !learned;
  if (!learned) return;

  const message = document.createElement("span");
  message.textContent = `Based on ${learned.count} similar expenses: ${learned.category}. `;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "learning-suggestion";
  button.textContent = "Use suggestion";
  button.addEventListener("click", () => {
    categorySelect.value = learned.category;
    categorySelect.dispatchEvent(new Event("change", { bubbles: true }));
  });
  suggestion.append(message, button);
}

function renderSpendingBehavior() {
  const area = document.getElementById("behavior-area");
  if (!area) return;

  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 89);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const recentExpenses = S.expenses.filter((expense) => {
    const date = expenseDate(expense.date);
    return (
      date &&
      date >= start &&
      date <= end &&
      Number.isFinite(expense.amount) &&
      expense.amount > 0
    );
  });
  if (!recentExpenses.length) {
    area.innerHTML = "";
    return;
  }

  const categoryTotals = new Map();
  const dailyTotals = new Map();
  recentExpenses.forEach((expense) => {
    categoryTotals.set(expense.category, {
      total: (categoryTotals.get(expense.category)?.total || 0) + expense.amount,
      count: (categoryTotals.get(expense.category)?.count || 0) + 1,
    });
    const date = expenseDate(expense.date);
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    dailyTotals.set(dateKey, {
      weekday: date.getDay(),
      total: (dailyTotals.get(dateKey)?.total || 0) + expense.amount,
    });
  });

  const insights = [];
  const totalSpent = recentExpenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );
  const topCategory = [...categoryTotals.entries()].sort(
    (a, b) => b[1].total - a[1].total,
  )[0];
  if (recentExpenses.length >= 5 && topCategory) {
    const [category, totals] = topCategory;
    const share = Math.round((totals.total / totalSpent) * 100);
    insights.push(
      `<div class="behavior-item"><span class="behavior-mark">↗</span><span><strong>${escapeHtml(category)}</strong> is your largest category over the last 90 days: ${fmt(totals.total)} across ${totals.count} expenses (${share}% of recorded spending).</span></div>`,
    );
  }

  if (dailyTotals.size >= 14) {
    const weekdayTotals = Array.from({ length: 7 }, () => ({
      total: 0,
      days: 0,
    }));
    dailyTotals.forEach(({ weekday, total }) => {
      weekdayTotals[weekday].total += total;
      weekdayTotals[weekday].days++;
    });
    const busiestDay = weekdayTotals
      .map((stats, weekday) => ({ ...stats, weekday }))
      .filter((stats) => stats.days >= 3)
      .sort((a, b) => b.total / b.days - a.total / a.days)[0];
    if (busiestDay) {
      const weekday = new Intl.DateTimeFormat("en", {
        weekday: "long",
      }).format(new Date(2024, 0, 7 + busiestDay.weekday));
      insights.push(
        `<div class="behavior-item"><span class="behavior-mark">◷</span><span>On days with recorded expenses, ${weekday} is your highest-spend day on average: ${fmt(busiestDay.total / busiestDay.days)} across ${busiestDay.days} logged ${weekday}s.</span></div>`,
      );
    }
  }

  area.innerHTML = `<div class="card behavior-card" style="margin-bottom:18px;">
    <div class="behavior-header">
      <div class="behavior-title">Your spending habits · last 90 days</div>
      <span class="behavior-note">Learns from expenses saved on this device</span>
    </div>
    ${insights.length ? insights.join("") : '<div class="behavior-item">Keep logging expenses to uncover reliable personal patterns.</div>'}
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

function loadChartJS() {
  if (window.Chart) return Promise.resolve(window.Chart);
  if (chartJsPromise) return chartJsPromise;

  chartJsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
    script.onload = () => {
      if (window.Chart) {
        resolve(window.Chart);
      } else {
        chartJsPromise = null;
        reject(new Error("Chart.js loaded without exposing its API."));
      }
    };
    script.onerror = () => {
      chartJsPromise = null;
      reject(new Error("Could not load Chart.js."));
    };
    document.head.append(script);
  });

  return chartJsPromise;
}

function renderCharts() {
  renderHeatmap();
  loadChartJS()
    .then(() => {
      if (!document.getElementById("page-charts")?.classList.contains("active"))
        return;
      renderDonut();
      renderLineChart();
    })
    .catch((error) =>
      CasheroErrors.reportError(error, "Could not load charts"),
    );
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
  donutChart = new window.Chart(ctx, {
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
  lineChart = new window.Chart(ctx, {
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
  const validRows = rows.filter((r) => r.payout > 0);
  if (savingsChart) {
    savingsChart.destroy();
    savingsChart = null;
  }
  if (!validRows.length) return;

  loadChartJS()
    .then(() => {
      if (
        !document.getElementById("page-compare")?.classList.contains("active")
      )
        return;
      const { grid, text } = getChartColors();
      const ctx = document
        .getElementById("savings-trend-chart")
        .getContext("2d");
      savingsChart = new window.Chart(ctx, {
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
            tooltip: {
              callbacks: { label: (ctx) => `${ctx.parsed.y}% saved` },
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
                callback: (v) => v + "%",
              },
              suggestedMin: 0,
            },
          },
        },
      });
    })
    .catch((error) =>
      CasheroErrors.reportError(error, "Could not load charts"),
    );
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
        <div class="goal-name">${escapeHtml(g.name)}</div>
        <div class="goal-pct">${pct.toFixed(0)}%</div>
      </div>
      <div class="prog-wrap" style="height:7px;"><div class="prog-fill" style="width:${pct}%;background:${pct >= 100 ? "var(--green)" : "var(--accent)"}"></div></div>
      <div class="goal-amounts"><span>${fmt(g.saved)} saved</span><span>${fmt(g.target)} target</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
        <div class="goal-deadline" style="color:${deadlineColor}">${deadlineStr}${daysLeft !== null ? ` (${daysLeft}d left)` : ""}</div>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-ghost" onclick="addToGoal('${g.id}')" style="font-size:9px;padding:4px 10px;">+ Add</button>
          <button class="del-btn" onclick="deleteGoal('${g.id}')" style="display:flex;align-items:center;justify-content:center;width:24px;height:24px">${getLucideIcon("X", 16)}</button>
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
function addToGoal(id) {
  const goal = S.goals.find((g) => g.id == id);
  if (!goal) return;
  const amt = parseFloat(prompt("How much to add to this goal?"));
  if (isNaN(amt) || amt <= 0) return;
  goal.saved = Math.min(goal.target, goal.saved + amt);
  save();
  renderGoals();
  toast(`+${fmt(amt)} added ✓`);
}
function deleteGoal(id) {
  if (!confirm("Delete this goal?")) return;
  S.goals = S.goals.filter((g) => g.id != id);
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
      <div class="recur-icon" style="background:${c.color}22;display:flex;align-items:center;justify-content:center">${getLucideIcon(c.icon, 16)}</div>
      <div class="recur-info">
        <div class="recur-name">${escapeHtml(r.name)}</div>
        <div class="recur-meta">${r.freq} · ${r.cat}${r.day ? ` · day ${r.day}` : ""}</div>
      </div>
      <div class="recur-amount">${fmt(r.amount)}</div>
      <button class="del-btn" onclick="deleteRecurring('${r.id}')" style="display:flex;align-items:center;justify-content:center;width:24px;height:24px">${getLucideIcon("X", 16)}</button>
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
function deleteRecurring(id) {
  S.recurring = S.recurring.filter((r) => r.id != id);
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
    const recurringId = Date.now() + 1;
    S.recurring.push({
      id: recurringId,
      name: note || cat,
      amount,
      cat,
      freq: recur,
      day: new Date(date).getDate(),
    });
    exp.recurringId = recurringId;
  }
  S.expenses.push(exp);
  save();
  notifyIfUnusualTransaction(exp);
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
  S.payouts = S.payouts.filter((p) => !(p.year === year && p.month === month));
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
    <div><div style="font-size:12px">${MONTHS[p.month]} ${p.year}</div>${p.note ? `<div style="font-size:10px;color:var(--text3)">${escapeHtml(p.note)}</div>` : ""}</div>
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
  // For very large lists, render in chunks to avoid blocking the main thread.
  const LARGE_THRESHOLD = 2000;
  const CHUNK_SIZE = 200;

  // Clean up any previous observers/props
  if (el._observer) {
    try {
      el._observer.disconnect();
    } catch (error) {
      CasheroErrors.reportError(error, "Could not release transaction list resources", {
        notify: false,
      });
    }
    el._observer = null;
  }
  el._sentinel = null;

  if (list.length > LARGE_THRESHOLD) {
    el.innerHTML = "";
    let rendered = 0;

    function renderChunk() {
      const frag = document.createDocumentFragment();
      for (
        let i = rendered;
        i < Math.min(list.length, rendered + CHUNK_SIZE);
        i++
      ) {
        const e = list[i];
        const c =
          CATS.find((x) => x.name === e.category) || CATS[CATS.length - 1];
        const row = document.createElement("div");
        row.className = "tx-row";
        row.innerHTML = `
          <div class="tx-icon" style="background:${c.color}22;display:flex;align-items:center;justify-content:center">${getLucideIcon(c.icon, 16)}</div>
          <div class="tx-info">
            <div class="tx-name">${escapeHtml(e.note || e.category)}</div>
            <div class="tx-meta">${escapeHtml(e.date)} · ${escapeHtml(e.category)}</div>
          </div>
          <div class="tx-right">
            ${e.recurringId ? `<span class="tx-recur" style="display:inline-flex;width:16px;height:16px">${getLucideIcon("RotateCw", 12)}</span>` : ""}
            <div class="tx-amount" style="color:${c.color}">${fmt(e.amount)}</div>
            ${showDel ? `<button class="del-btn" onclick="deleteExpense(${e.id})" style="display:flex;align-items:center;justify-content:center;width:24px;height:24px">${getLucideIcon("X", 16)}</button>` : ""}
          </div>`;
        frag.appendChild(row);
      }
      el.appendChild(frag);
      rendered += CHUNK_SIZE;

      if (rendered >= list.length) {
        // all done
        if (el._sentinel) {
          el._observer.disconnect();
          el._sentinel.remove();
          el._sentinel = null;
          el._observer = null;
        }
        return;
      }

      if (!el._sentinel) {
        const s = document.createElement("div");
        s.className = "load-sentinel";
        s.style.padding = "10px";
        s.style.textAlign = "center";
        s.textContent = "Loading more…";
        el.appendChild(s);
        el._sentinel = s;
        el._observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) renderChunk();
          },
          { root: el, threshold: 1 },
        );
        el._observer.observe(el._sentinel);
      }
    }

    renderChunk();
    return;
  }

  // Small/medium lists: render directly
  el.innerHTML = list
    .map((e) => {
      const c =
        CATS.find((x) => x.name === e.category) || CATS[CATS.length - 1];
      const del = showDel
        ? `<button class="del-btn" onclick="deleteExpense(${e.id})" style="display:flex;align-items:center;justify-content:center;width:24px;height:24px">${getLucideIcon("X", 16)}</button>`
        : "";
      const recur = e.recurringId
        ? `<span class="tx-recur" style="display:inline-flex;width:16px;height:16px">${getLucideIcon("RotateCw", 12)}</span>`
        : "";
      return `<div class="tx-row">
      <div class="tx-icon" style="background:${c.color}22;display:flex;align-items:center;justify-content:center">${getLucideIcon(c.icon, 16)}</div>
      <div class="tx-info">
        <div class="tx-name">${escapeHtml(e.note || e.category)}</div>
        <div class="tx-meta">${escapeHtml(e.date)} · ${escapeHtml(e.category)}</div>
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
        <div class="cat-name"><span style="display:inline-block;width:16px;height:16px;margin-right:6px">${getLucideIcon(c.icon, 16)}</span><span style="color:${c.color}">${c.name}</span>${warn}</div>
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

  // ═══ COOLDOWN CHECK ═══
  const now = Date.now();
  const timeSinceLastRun = analysisLastRun ? now - analysisLastRun : Infinity;
  const cooldownMs = 60000; // 60 seconds

  if (timeSinceLastRun < cooldownMs) {
    const secondsLeft = Math.ceil((cooldownMs - timeSinceLastRun) / 1000);
    toast(`Wait ${secondsLeft}s before analyzing again`, "err");
    startCooldownTimer(btn, secondsLeft);
    return;
  }

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

  // Get economic context for selected currency
  const currencyInfo = CURRENCIES[S.currency] || CURRENCIES.USD;
  const currencyContext = CURRENCY_CONTEXT[S.currency] || CURRENCY_CONTEXT.USD;

  const prompt = `You are a brutally honest financial advisor for a freelancer in ${currencyContext.region}. No fluff. Be direct, specific, actionable.

CURRENT LOCATION & ECONOMIC CONTEXT:
Region: ${currencyContext.region}
Currency: ${currencyInfo.name}
${currencyContext.economicContext}

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

ANALYSIS INSTRUCTIONS:
- Consider the economic conditions of ${currencyContext.region} when making recommendations
- Account for regional cost of living, inflation, and market dynamics
- Make spending advice realistic for their location's economy
- Reference specific economic challenges or opportunities relevant to their region

Respond ONLY with valid JSON (no markdown). Be brutally honest but with dark humor — like a sarcastic accountant who's seen too much. Roast their spending habits where deserved, but keep it useful and region-aware:
{"verdict":"one brutal sentence on their financial health in context of their regional economy","cutbacks":[{"category":"...","reason":"...","target":"specific % or $ reduction"}],"goal":"specific dollar savings goal for next month","danger":"warning if any cat >30% of income or null","quickWins":["stop buying X","cancel Y","reduce Z"],"projectionNote":"one sentence on whether they're on track or heading for trouble this month, considering economic factors"}`;

  try {
    const json = await fetchAPI(`${BACKEND_URL}api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const text = json.choices?.[0]?.message?.content || "";
    const a = JSON.parse(text.replace(/```json|```/g, "").trim());
    S.lastAnalysis = a;
    S.lastAnalysisDate = new Date().toLocaleDateString();
    S.lastAnalysisMonthKey = activeMonth;
    save();
    out.innerHTML = buildAnalysisHTML(a);
    toast("Analysis complete ✓");

    // ═══ SET COOLDOWN TIMESTAMP ═══
    analysisLastRun = Date.now();
    CasheroStorage.setItem("cashero_last_analysis", analysisLastRun.toString());
    startCooldownTimer(btn, 60);
  } catch (e) {
    console.error("[ANALYSIS ERROR]", e);
    const errMsg =
      e.status === 401
        ? "Invalid API key"
        : e.status === 429
          ? "Rate limited — wait a moment"
          : "Analysis failed — try again";
    out.innerHTML = `<div style="color:var(--red);font-size:12px">${errMsg}</div>`;
    toast(errMsg, "err");
    btn.disabled = false;
    btn.textContent = "✦ Analyze Now";
  }
}
function buildAnalysisHTML(a) {
  const esc = escapeHtml;
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
//  ANALYSIS COOLDOWN TIMER
// ═══════════════════════════════════════════
function startCooldownTimer(btn, secondsLeft) {
  // Clear any existing interval
  if (analysisCountdownInterval) {
    clearInterval(analysisCountdownInterval);
  }

  btn.disabled = true;

  const updateButton = () => {
    if (secondsLeft > 0) {
      btn.textContent = `✦ Analyze (${secondsLeft}s)`;
      secondsLeft--;
    } else {
      btn.textContent = "✦ Analyze Now";
      btn.disabled = false;
      clearInterval(analysisCountdownInterval);
      analysisCountdownInterval = null;
    }
  };

  updateButton(); // Show initial countdown immediately
  analysisCountdownInterval = setInterval(updateButton, 1000);
}

// ═══════════════════════════════════════════
//  WEEKLY CHECK-IN
// ═══════════════════════════════════════════
function renderCheckinBanner() {
  const area = document.getElementById("checkin-area");
  const needsCheckin = !S.lastCheckinDate || isOlderThan(S.lastCheckinDate, 7);
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
    const json = await fetchAPI(`${BACKEND_URL}api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const text = json.choices?.[0]?.message?.content || "";
    S.lastCheckin = text;
    S.lastCheckinDate = new Date().toISOString();
    save();
    // Sanitize the text to prevent any potential HTML injection, then replace markdown-style bold with actual bold tags and newlines with <br> for display.
    function sanitizeForDisplay(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }

    // Then at line 1804, replace the innerHTML assignment with:
    const safeText = sanitizeForDisplay(text)
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
    out.innerHTML = `<div class="checkin-output">${safeText}</div>`;

    renderCheckinBanner();
    toast("Check-in complete ✓");
  } catch (e) {
    console.error("[CHECK-IN ERROR]", e);
    const errMsg =
      e.status === 401
        ? "Invalid API key"
        : e.status === 429
          ? "Rate limited — wait a moment"
          : "Failed — try again";
    out.innerHTML = `<div style="color:var(--red);font-size:12px">${errMsg}</div>`;
    toast(errMsg, "err");
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
    const json = await fetchAPI(`${BACKEND_URL}api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

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
    updateCategorySuggestion(
      "qa-note",
      "qa-cat",
      "qa-category-suggestion",
    );
    document.getElementById("qa-date").value =
      nlpParsed.date || new Date().toISOString().slice(0, 10);
    document.getElementById("nlp-form").style.display = "block";
  } catch (e) {
    console.error("[NLP PARSE ERROR]", e);
    const errMsg =
      e.status === 401
        ? "Invalid API key"
        : e.status === 429
          ? "Rate limited — wait a moment"
          : "Could not parse — fill manually";
    toast(errMsg, "err");
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
  const expense = { id: Date.now(), amount, category: cat, note, date };
  S.expenses.push(expense);
  save();
  notifyIfUnusualTransaction(expense);
  closeQuickAdd();
  toast("Added ✓");
  renderAll();
  renderMonthPills();
}

// ═══════════════════════════════════════════
//  SIDEBAR TOGGLE
// ═══════════════════════════════════════════
function setSidebarExpanded(expand) {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  const backdrop = document.getElementById("sidebar-backdrop");
  const toggleBtn = document.getElementById("mobile-nav-toggle");
  sidebar.classList.toggle("expanded", expand);
  if (backdrop) backdrop.classList.toggle("active", expand);
  if (toggleBtn) toggleBtn.classList.toggle("active", expand);
  if (window.innerWidth <= 480) {
    document.body.style.overflow = expand ? "hidden" : "";
  }
}
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  setSidebarExpanded(!sidebar.classList.contains("expanded"));
}

// ═══════════════════════════════════════════
//  THEME
// ═══════════════════════════════════════════
function toggleTheme() {
  S.theme = S.theme === "dark" ? "light" : "dark";
  applyTheme();
  save();
  if (document.getElementById("page-charts")?.classList.contains("active"))
    renderCharts();
  if (document.getElementById("page-compare")?.classList.contains("active"))
    renderCompare();
  if (document.getElementById("page-yearly")?.classList.contains("active"))
    renderYearly();
}
function applyTheme() {
  document.documentElement.setAttribute("data-theme", S.theme);

  // Update theme icon SVG
  const themeIcon = document.querySelector(".topbar-theme-toggle .nav-icon");
  if (themeIcon) {
    if (S.theme === "dark") {
      themeIcon.className = "nav-icon fa-solid fa-moon";
    } else {
      themeIcon.className = "nav-icon fa-solid fa-sun";
    }
  }

  document.getElementById("theme-label").textContent =
    S.theme === "dark" ? "Light Mode" : "Dark Mode";
  document.getElementById("theme-meta").content =
    S.theme === "dark" ? "#080810" : "#f4f3ff";
}

// ═══════════════════════════════════════════
//  CSV EXPORT
// ═══════════════════════════════════════════
function openCSVExportModal() {
  const modal = document.getElementById("csv-export-modal");

  // Set default date range (last 30 days)
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  document.getElementById("csv-start-date").value = thirtyDaysAgo
    .toISOString()
    .split("T")[0];
  document.getElementById("csv-end-date").value = today
    .toISOString()
    .split("T")[0];

  modal.classList.add("open");
}

function closeCSVExportModal() {
  document.getElementById("csv-export-modal").classList.remove("open");
}

function exportCSV() {
  const startDateInput = document.getElementById("csv-start-date").value;
  const endDateInput = document.getElementById("csv-end-date").value;

  // Parse dates
  const startDate = startDateInput ? new Date(startDateInput) : new Date(0);
  const endDate = endDateInput ? new Date(endDateInput) : new Date();

  // Filter expenses by date range
  const filteredExpenses = S.expenses.filter((e) => {
    const expenseDate = new Date(e.date);
    return expenseDate >= startDate && expenseDate <= endDate;
  });

  // Build CSV with headers including Category
  const header = "Date,Category,Note,Amount,Recurring\n";
  const rows = filteredExpenses
    .map(
      (e) =>
        `"${e.date}","${e.category}","${(e.note || "").replace(/"/g, '""')}","${e.amount}","${e.recurringId ? "Yes" : "No"}"`,
    )
    .join("\n");

  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  // Create filename with date range
  const startStr = startDateInput || "start";
  const endStr = endDateInput || "end";
  a.download = `cashero-export-${startStr}-to-${endStr}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast(`CSV exported (${filteredExpenses.length} records) ✓`);
  closeCSVExportModal();
}

// ═══════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const quickModal = document.getElementById("quick-modal");
    const csvModal = document.getElementById("csv-export-modal");
    const recoveryOverlay = document.getElementById("recovery-overlay");

    if (quickModal && quickModal.classList.contains("open")) {
      closeQuickAdd();
      return;
    }
    if (csvModal && csvModal.classList.contains("open")) {
      closeCSVExportModal();
      return;
    }
    if (recoveryOverlay && recoveryOverlay.classList.contains("active")) {
      hideRecoveryPhrase();
      return;
    }
  }

  if (
    e.target.tagName === "INPUT" ||
    e.target.tagName === "TEXTAREA" ||
    e.target.tagName === "SELECT"
  )
    return;
  if (e.key === "q" || e.key === "Q") openQuickAdd();
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
  const container = document.getElementById("toast-container");
  if (!container) return;
  const el = document.createElement("div");
  el.className = `toast ${type}`;

  const txt = document.createElement("span");
  txt.className = "toast-msg";
  txt.textContent = msg;
  el.appendChild(txt);

  const close = document.createElement("button");
  close.className = "toast-close";
  close.type = "button";
  close.title = "Dismiss";
  close.innerHTML = getLucideIcon("X", 16);
  close.addEventListener("click", (e) => {
    e.stopPropagation();
    if (el._timeout) clearTimeout(el._timeout);
    el.remove();
  });
  el.appendChild(close);

  container.appendChild(el);

  // Auto-remove after 3s unless dismissed
  el._timeout = setTimeout(() => el.remove(), 3000);
}

// ═══════════════════════════════════════════
//  PWA SERVICE WORKER
// ═══════════════════════════════════════════
if ("serviceWorker" in navigator) {
  // Register the dedicated service worker file at the app root
  navigator.serviceWorker
    .register("/sw.js", { updateViaCache: "none" })
    .then((reg) => {
      console.log("ServiceWorker registered:", reg.scope);

      // Listen for updates to the service worker and notify user
      if (reg.waiting) {
        notifySWUpdate(reg);
      }
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            notifySWUpdate(reg);
          }
        });
      });
    })
    .catch((err) => {
      console.warn("ServiceWorker registration failed:", err);
    });
}

// Online/offline toasts
window.addEventListener("online", () => {
  // Throttle connectivity toasts to avoid spam
  if (
    !window._lastConnectivityToast ||
    Date.now() - window._lastConnectivityToast > 3000
  ) {
    toast("Back online", "ok");
    window._lastConnectivityToast = Date.now();
  }
});
window.addEventListener("offline", () => {
  if (
    !window._lastConnectivityToast ||
    Date.now() - window._lastConnectivityToast > 3000
  ) {
    toast("You are offline", "err");
    window._lastConnectivityToast = Date.now();
  }
});
// Show initial state
if (!navigator.onLine) {
  if (!window._lastConnectivityToast) {
    toast("You are offline", "err");
    window._lastConnectivityToast = Date.now();
  }
}

// Notify user there's an update available and offer to reload
function notifySWUpdate(reg) {
  const updateId = "sw-update-available";
  if (document.getElementById(updateId)) return;
  const el = document.createElement("div");
  el.id = updateId;
  el.style.position = "fixed";
  el.style.right = "12px";
  el.style.bottom = "12px";
  el.style.background = "var(--accent2)";
  el.style.color = "#fff";
  el.style.padding = "10px 12px";
  el.style.borderRadius = "8px";
  el.style.zIndex = 9999;
  el.style.boxShadow = "0 6px 18px rgba(0,0,0,0.12)";
  el.innerHTML =
    'Update available — <button id="reload-sw-btn" style="margin-left:8px;padding:6px 8px;border:none;border-radius:6px;cursor:pointer">Reload</button>';
  document.body.appendChild(el);

  document
    .getElementById("reload-sw-btn")
    .addEventListener("click", async () => {
      // Tell the waiting worker to skipWaiting, then reload
      if (!reg || !reg.waiting) return window.location.reload();
      reg.waiting.postMessage({ type: "SKIP_WAITING" });
      reg.waiting.addEventListener("statechange", (e) => {
        if (reg.waiting.state === "activated") window.location.reload();
      });
    });
}

// ═══════════════════════════════════════════
//  INIT SELECTS
// ═══════════════════════════════════════════
function initSelects() {
  const catOpts = CATS.map(
    (c) => `<option value="${c.name}">${c.name}</option>`,
  ).join("");
  ["f-cat", "qa-cat", "r-cat"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = catOpts;
  });
  [
    ["f-note", "f-cat", "f-category-suggestion"],
    ["qa-note", "qa-cat", "qa-category-suggestion"],
  ].forEach(([noteId, categoryId, suggestionId]) => {
    const note = document.getElementById(noteId);
    if (note)
      note.addEventListener("input", () =>
        updateCategorySuggestion(noteId, categoryId, suggestionId),
      );
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
//  SETTINGS
// ═══════════════════════════════════════════
function renderSettings() {
  updatePinToggleButton();
  updateCurrencySelector();
  updateAutoLockSelector();
}

function updateAutoLockSelector() {
  const sel = document.getElementById("auto-lock-selector");
  if (!sel) return;
  sel.value = S.autoLockTimeout ?? 15;
}

function changeAutoLockTimeout() {
  const sel = document.getElementById("auto-lock-selector");
  if (!sel) return;
  const val = parseInt(sel.value);
  S.autoLockTimeout = val;
  save();
  // Restart the inactivity timer with the new value
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
  if (val === 0) {
    toast("Auto-lock disabled", "ok");
  } else {
    resetInactivityTimer();
    toast(`Auto-lock set to ${val} minutes`, "ok");
  }
}

function clearAllData() {
  const confirmed = confirm(
    "⚠️ Delete ALL data?\n\nThis will permanently erase all expenses, payouts, goals, recurring bills, and settings. This cannot be undone.\n\nAre you absolutely sure?",
  );
  if (!confirmed) return;
  const doubleConfirm = confirm(
    "Last chance - all your Cashero data will be gone. Proceed?",
  );
  if (!doubleConfirm) return;

  // Clear localStorage completely
  CasheroStorage.removeItem("cashero_pin_hash");
  CasheroStorage.removeItem("cashero_pin_salt");
  CasheroStorage.removeItem("cashero_recovery_hash");
  CasheroStorage.removeItem("cashero_recovery_salt");
  CasheroStorage.removeItem("cashero_last_analysis");
  // Reset S to defaults and save
  S = {
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
    pinEnabled: false,
    currency: "USD",
    autoLockTimeout: 15,
  };
  save();
  toast("All data cleared", "ok");
  setTimeout(() => {
    renderAll();
    renderSettings();
  }, 100);
}

function updateCurrencySelector() {
  const selector = document.getElementById("currency-selector");
  if (!selector) return;
  selector.value = S.currency;
}

function changeCurrency() {
  const newCurrency = document.getElementById("currency-selector").value;
  if (newCurrency && CURRENCIES[newCurrency]) {
    S.currency = newCurrency;
    save();
    toast(`Currency changed to ${CURRENCIES[newCurrency].name} ✓`);
    // Redraw all pages that display currency
    setTimeout(() => {
      renderAll();
      renderMonthPills();
    }, 100);
  }
}

async function togglePinLock() {
  if (S.pinEnabled) {
    // Disable PIN lock
    if (
      confirm("Disable PIN lock? Your data will be accessible without a PIN.")
    ) {
      // Clear inactivity timer when disabling PIN
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
      }
      CasheroStorage.removeItem("cashero_pin_hash");
      CasheroStorage.removeItem("cashero_pin_salt");
      CasheroStorage.removeItem("cashero_recovery_hash");
      CasheroStorage.removeItem("cashero_recovery_salt");
      S.pinEnabled = false;
      save();
      updatePinToggleButton();
      toast("PIN lock disabled", "ok");
    }
  } else {
    // Enable PIN lock - show setup
    pinMode = "setup";
    showPinOverlay("setup");
  }
}

function updatePinToggleButton() {
  const btn = document.getElementById("pin-toggle-btn");
  const changePinSection = document.getElementById("change-pin-section");
  if (!btn) return;
  const active = S.pinEnabled && isPinSet();
  btn.textContent = active ? "Disable" : "Enable";
  if (changePinSection) {
    changePinSection.style.display = active ? "block" : "none";
  }
}

function startChangePinFlow() {
  pinMode = "changeVerify";
  showPinOverlay("changeVerify");
}

// ═══════════════════════════════════════════
//  PIN SECURITY
// ═══════════════════════════════════════════
let pinMode = "verify"; // verify, setup, changeVerify, changeNew
let inactivityTimer = null;
// INACTIVITY_TIMEOUT is dynamic — read from S.autoLockTimeout (minutes). 0 = disabled.

// Brute-force lockout state
let pinFailCount = 0;
const PIN_MAX_ATTEMPTS = 5;
let pinLockoutUntil = 0;

// Hash PIN using SubtleCrypto (Web Crypto API)
async function hashPin(pin, salt = null) {
  if (!salt) {
    salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { hash: hashHex, salt };
}

// Check if PIN is set in localStorage
function isPinSet() {
  return !!CasheroStorage.getItem("cashero_pin_hash");
}

// ═══════════════════════════════════════════
//  AUTO-LOCK FUNCTIONALITY
// ═══════════════════════════════════════════
function resetInactivityTimer() {
  // Only track inactivity if PIN is enabled
  if (!S.pinEnabled || !isPinSet()) return;

  // 0 means disabled
  const timeoutMinutes = S.autoLockTimeout ?? 15;
  if (timeoutMinutes === 0) return;

  // Clear existing timer
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  // Set new timer
  inactivityTimer = setTimeout(
    () => {
      triggerAutoLock();
    },
    timeoutMinutes * 60 * 1000,
  );
}

function triggerAutoLock() {
  // Lock the app by showing PIN overlay
  if (S.pinEnabled && isPinSet()) {
    pinMode = "verify";
    showPinOverlay("verify");
    toast("Session locked due to inactivity", "inf");
  }
}

function setupActivityListeners() {
  // Only setup if PIN is enabled
  if (!S.pinEnabled || !isPinSet()) return;

  const events = [
    "mousedown",
    "keydown",
    "touchstart",
    "click",
    "scroll",
    "wheel",
  ];

  events.forEach((event) => {
    document.addEventListener(event, resetInactivityTimer, true);
  });

  // Start initial timer
  resetInactivityTimer();
}

// Show/hide PIN overlay
function showPinOverlay(mode = "verify") {
  const overlay = document.getElementById("pin-overlay");
  const modeLabel = document.getElementById("pin-mode-label");
  const input = document.getElementById("pin-input");
  const msg = document.getElementById("pin-message");

  overlay.classList.add("active");
  input.value = "";
  msg.textContent = "";
  msg.classList.remove("error", "success");
  updatePinDots(0);

  if (mode === "setup") {
    modeLabel.textContent = "Setup your 4-digit PIN";
  } else if (mode === "verify") {
    modeLabel.textContent = "Enter your PIN to continue";
  } else if (mode === "changeVerify") {
    modeLabel.textContent = "Enter your current PIN";
  } else if (mode === "changeNew") {
    modeLabel.textContent = "Enter your new PIN";
  } else if (mode === "changeConfirm") {
    modeLabel.textContent = "Confirm your new PIN";
  }

  input.focus();
}

function hidePinOverlay() {
  const overlay = document.getElementById("pin-overlay");
  overlay.classList.remove("active");
  pinMode = "verify";
}

// Update PIN dots display
function updatePinDots(count) {
  const dots = document.querySelectorAll(".pin-dot");
  dots.forEach((dot, idx) => {
    if (idx < count) {
      dot.classList.add("filled");
    } else {
      dot.classList.remove("filled");
    }
  });
}

// Validate PIN input (numbers only, max 4)
function validatePinInput(input) {
  // Only enforce numeric/4-digit limit for PIN modes, not for recovery phrase
  if (pinMode === "recoverVerify") {
    // Recovery phrase mode - allow text input, no restrictions
    return;
  }
  // PIN modes - restrict to 4 digits
  input.value = input.value.replace(/[^0-9]/g, "").slice(0, 4);
  updatePinDots(input.value.length);

  // Auto-submit when 4 digits are entered
  if (input.value.length === 4) {
    setTimeout(() => submitPin(), 100);
  }
}

// Handle PIN key press
function handlePinKey(event) {
  if (event.key === "Enter") {
    submitPin();
  }
}

let tempNewPin = null; // Store first new PIN entry for confirmation

// Submit PIN
async function submitPin() {
  const input = document.getElementById("pin-input");
  const pin = input.value.trim();
  const msg = document.getElementById("pin-message");
  const modeLabel = document.getElementById("pin-mode-label");
  const btn = document.querySelector(".pin-submit-btn");

  // Validate based on mode
  if (pinMode !== "recoverVerify") {
    // PIN mode validation - must be exactly 4 digits
    if (pin.length !== 4) {
      msg.textContent = "PIN must be 4 digits";
      msg.classList.add("error");
      input.classList.add("error");
      setTimeout(() => {
        input.classList.remove("error");
      }, 500);
      return;
    }
  } else {
    // Recovery phrase mode - must have content
    if (!pin || pin.length < 5) {
      msg.textContent = "Please enter your recovery phrase";
      msg.classList.add("error");
      input.classList.add("error");
      setTimeout(() => {
        input.classList.remove("error");
      }, 500);
      return;
    }
  }

  btn.disabled = true;
  msg.textContent = "Processing...";
  msg.classList.remove("error", "success");

  // Brute-force lockout check (applies to verify and changeVerify modes only)
  if (pinMode === "verify" || pinMode === "changeVerify") {
    if (Date.now() < pinLockoutUntil) {
      const secsLeft = Math.ceil((pinLockoutUntil - Date.now()) / 1000);
      msg.textContent = `Too many attempts. Try again in ${secsLeft}s`;
      msg.classList.add("error");
      btn.disabled = false;
      return;
    }
  }

  try {
    const storedHash = CasheroStorage.getItem("cashero_pin_hash");

    if (pinMode === "setup") {
      // Set new PIN — generate fresh hash+salt and store both
      const { hash, salt } = await hashPin(pin);
      CasheroStorage.setItem("cashero_pin_hash", hash);
      CasheroStorage.setItem("cashero_pin_salt", salt);
      S.pinEnabled = true;
      save();
      msg.textContent = "PIN set successfully ✓";
      msg.classList.add("success");
      setTimeout(() => {
        hidePinOverlay();
        input.value = "";
        updatePinToggleButton();
        // Generate and show recovery phrase
        const recoveryPhrase = generateRecoveryPhrase();
        showRecoveryPhrase(recoveryPhrase);
      }, 500);
    } else if (pinMode === "verify") {
      // Verify PIN for app access — re-hash using stored salt
      const storedSalt = CasheroStorage.getItem("cashero_pin_salt");
      const { hash: verifyHash } = await hashPin(pin, storedSalt);
      if (verifyHash === storedHash) {
        pinFailCount = 0; // reset on success
        msg.textContent = "Access granted ✓";
        msg.classList.add("success");
        setTimeout(() => {
          hidePinOverlay();
          input.value = "";
          // Reset inactivity timer on successful PIN verification
          resetInactivityTimer();
        }, 500);
      } else {
        pinFailCount++;
        if (pinFailCount >= PIN_MAX_ATTEMPTS) {
          pinLockoutUntil = Date.now() + 30000; // 30s lockout
          pinFailCount = 0;
          msg.textContent = "Too many attempts. Locked for 30s.";
        } else {
          msg.textContent = `Incorrect PIN (${pinFailCount}/${PIN_MAX_ATTEMPTS})`;
        }
        msg.classList.add("error");
        input.classList.add("error");
        input.value = "";
        updatePinDots(0);
        setTimeout(() => {
          input.classList.remove("error");
        }, 500);
      }
    } else if (pinMode === "changeVerify") {
      // Verify old PIN before allowing change — re-hash using stored salt
      const storedSalt = CasheroStorage.getItem("cashero_pin_salt");
      const { hash: verifyHash } = await hashPin(pin, storedSalt);
      if (verifyHash === storedHash) {
        pinFailCount = 0;
        msg.textContent = "✓ Verified";
        msg.classList.add("success");
        setTimeout(() => {
          pinMode = "changeNew";
          showPinOverlay("changeNew");
        }, 500);
      } else {
        pinFailCount++;
        if (pinFailCount >= PIN_MAX_ATTEMPTS) {
          pinLockoutUntil = Date.now() + 30000;
          pinFailCount = 0;
          msg.textContent = "Too many attempts. Locked for 30s.";
        } else {
          msg.textContent = `Incorrect PIN (${pinFailCount}/${PIN_MAX_ATTEMPTS})`;
        }
        msg.classList.add("error");
        input.classList.add("error");
        input.value = "";
        updatePinDots(0);
        setTimeout(() => {
          input.classList.remove("error");
        }, 500);
      }
    } else if (pinMode === "changeNew") {
      // Store new PIN and ask for confirmation
      msg.textContent = "✓ Entered";
      msg.classList.add("success");
      tempNewPin = pin;
      setTimeout(() => {
        pinMode = "changeConfirm";
        showPinOverlay("changeConfirm");
      }, 500);
    } else if (pinMode === "changeConfirm") {
      // Confirm new PIN matches
      if (pin === tempNewPin) {
        const { hash: newHash, salt: newSalt } = await hashPin(pin);
        CasheroStorage.setItem("cashero_pin_hash", newHash);
        CasheroStorage.setItem("cashero_pin_salt", newSalt);
        save();
        msg.textContent = "PIN changed ✓";
        msg.classList.add("success");
        tempNewPin = null;
        setTimeout(() => {
          hidePinOverlay();
          input.value = "";
          navigate("settings");
          toast("PIN updated successfully", "ok");
        }, 500);
      } else {
        msg.textContent = "PINs don't match";
        msg.classList.add("error");
        input.classList.add("error");
        input.value = "";
        updatePinDots(0);
        setTimeout(() => {
          input.classList.remove("error");
        }, 500);
      }
    } else if (pinMode === "recoverVerify") {
      // Verify recovery phrase for PIN reset
      const phrase = pin.trim().toLowerCase();
      const isValid = await verifyRecoveryPhrase(phrase);

      if (isValid) {
        msg.textContent = "Recovery phrase verified ✓";
        msg.classList.add("success");
        setTimeout(() => {
          // Reset to PIN input mode for new PIN
          pinMode = "recoverNewPin";
          input.type = "password";
          input.placeholder = "••••";
          input.maxLength = "4";
          input.inputMode = "numeric";
          input.value = "";
          document.getElementById("pin-dots").style.display = "flex";
          msg.textContent = "";
          msg.classList.remove("error", "success");
          modeLabel.textContent = "Enter your new PIN";
          input.focus();
          updatePinDots(0);
        }, 500);
      } else {
        msg.textContent = "Invalid recovery phrase";
        msg.classList.add("error");
        input.classList.add("error");
        input.value = "";
        setTimeout(() => {
          input.classList.remove("error");
        }, 500);
      }
    } else if (pinMode === "recoverNewPin") {
      // Set new PIN after recovery — store hash+salt
      const { hash: newPinHash, salt: newPinSalt } = await hashPin(pin);
      CasheroStorage.setItem("cashero_pin_hash", newPinHash);
      CasheroStorage.setItem("cashero_pin_salt", newPinSalt);
      save();
      msg.textContent = "PIN reset successfully ✓";
      msg.classList.add("success");
      setTimeout(() => {
        hidePinOverlay();
        input.value = "";
        input.type = "password";
        document.getElementById("pin-dots").style.display = "flex";
        document.getElementById("forgot-pin-btn").style.display = "block";
        pinMode = "verify";
        toast("PIN reset complete", "ok");
      }, 500);
    }
  } catch (e) {
    msg.textContent = "Error: " + e.message;
    msg.classList.add("error");
  }

  btn.disabled = false;
}

// ═══════════════════════════════════════════
//  RECOVERY PHRASE
// ═══════════════════════════════════════════

// Generate cryptographically secure random bytes
function getRandomBytes(count) {
  const array = new Uint8Array(count);
  crypto.getRandomValues(array);
  return array;
}

// Generate recovery phrase (8 words from EFF wordlist) — rejection sampling to avoid modulo bias
function generateRecoveryPhrase() {
  const words = [];
  const wordCount = EFF_WORDLIST.length;
  // Rejection threshold: largest multiple of wordCount that fits in a byte (0-255)
  const limit = 256 - (256 % wordCount);

  while (words.length < 8) {
    const [byte] = crypto.getRandomValues(new Uint8Array(1));
    if (byte < limit) {
      words.push(EFF_WORDLIST[byte % wordCount]);
    }
  }

  return words.join(" ");
}

// Hash recovery phrase with SHA-256 + salt
async function hashRecoveryPhrase(phrase, salt = null) {
  if (!salt) {
    // Generate new salt if not provided
    salt = Array.from(getRandomBytes(16))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  const encoder = new TextEncoder();
  const saltedPhrase = phrase + salt;
  const data = encoder.encode(saltedPhrase);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return { salt, hash: hashHex };
}

// Show recovery phrase modal
function showRecoveryPhrase(phrase) {
  const overlay = document.getElementById("recovery-overlay");
  const wordsContainer = document.getElementById("recovery-words");
  const checkbox = document.getElementById("recovery-confirm-checkbox");
  const continueBtn = document.getElementById("recovery-continue-btn");

  // Display words in numbered list
  const words = phrase.split(" ");
  wordsContainer.innerHTML = words
    .map(
      (word, idx) => `
      <div style="display: flex; gap: 8px; align-items: center; padding: 8px; background: var(--bg3); border-radius: 6px;">
        <span style="font-size: 10px; color: var(--text3); min-width: 20px;">${idx + 1}.</span>
        <span style="font-size: 12px; font-weight: 500; color: var(--text);">${word}</span>
      </div>
    `,
    )
    .join("");

  // Reset checkbox and button
  checkbox.checked = false;
  continueBtn.disabled = true;

  // Show overlay
  overlay.classList.add("active");
}

// Hide recovery phrase modal
function hideRecoveryPhrase() {
  const overlay = document.getElementById("recovery-overlay");
  overlay.classList.remove("active");
}

// Copy recovery phrase to clipboard
async function copyRecoveryPhrase() {
  const wordsText = Array.from(
    document.querySelectorAll("#recovery-words > div"),
  )
    .map((div) => div.textContent.split(".")[1].trim())
    .join(" ");

  try {
    await navigator.clipboard.writeText(wordsText);
    toast("Recovery phrase copied to clipboard", "ok");
  } catch (error) {
    CasheroErrors.reportError(error, "Could not copy the recovery phrase", {
      notify: false,
    });
    toast("Failed to copy recovery phrase", "err");
  }
}

// Finish recovery phrase setup - store hash + salt
async function finishRecoveryPhrase() {
  const wordsText = Array.from(
    document.querySelectorAll("#recovery-words > div"),
  )
    .map((div) => div.textContent.split(".")[1].trim())
    .join(" ");

  // Hash recovery phrase
  const { salt, hash } = await hashRecoveryPhrase(wordsText);

  // Store in localStorage
  CasheroStorage.setItem("cashero_recovery_salt", salt);
  CasheroStorage.setItem("cashero_recovery_hash", hash);

  hideRecoveryPhrase();
  navigate("dashboard");
  toast("Recovery phrase secured", "ok");
}

// Show forgot PIN flow - ask for recovery phrase
function startForgotPinFlow() {
  pinMode = "recoverVerify";
  const overlay = document.getElementById("pin-overlay");
  const modeLabel = document.getElementById("pin-mode-label");
  const input = document.getElementById("pin-input");
  const msg = document.getElementById("pin-message");
  const btn = document.querySelector(".pin-submit-btn");
  const forgotBtn = document.getElementById("forgot-pin-btn");

  // Hide forgot button and change UI for recovery flow
  forgotBtn.style.display = "none";
  btn.textContent = "Verify";
  modeLabel.textContent =
    "Enter your recovery phrase (8 words, space-separated)";
  input.type = "text";
  input.placeholder = "word1 word2 word3 word4 word5 word6 word7 word8";
  input.maxLength = "100";
  input.inputMode = "text";
  input.value = "";
  msg.textContent = "";
  msg.classList.remove("error", "success");
  input.focus();

  // Hide PIN dots
  document.getElementById("pin-dots").style.display = "none";
}

// Verify recovery phrase for PIN reset
async function verifyRecoveryPhrase(phrase) {
  const storedSalt = CasheroStorage.getItem("cashero_recovery_salt");
  const storedHash = CasheroStorage.getItem("cashero_recovery_hash");

  if (!storedSalt || !storedHash) {
    return false;
  }

  const { hash } = await hashRecoveryPhrase(phrase, storedSalt);
  return hash === storedHash;
}

// Initialize PIN on app load
async function initPin() {
  // Set up activity listeners (they'll only trigger if PIN is enabled)
  setupActivityListeners();

  if (S.pinEnabled && isPinSet()) {
    // Show verification screen only if PIN is enabled
    showPinOverlay("verify");
    // Show forgot PIN button
    document.getElementById("forgot-pin-btn").style.display = "block";
  }
  // PIN is disabled by default - app loads normally without PIN overlay
}

// ═══════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════

// (debug reset function removed for production security)

load();
applyTheme();
initPin().then(() => {
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
}).catch((error) => {
  CasheroErrors.reportError(error, "Could not initialize app security");
});

// ═══════════════════════════════════════════
//  DUPLICATE DETECTION
// ═══════════════════════════════════════════
function detectDuplicates() {
  const banner = document.getElementById("duplicate-banner");
  if (!banner) return;
  const exps = monthExpenses(activeMonth);

  // Enhanced duplicate detection - finds expenses within same day/time range with similar amounts
  const seen = {};
  const dupes = [];

  exps.forEach((e) => {
    const key = `${e.date}__${Math.round(e.amount)}__${e.category}`;
    seen[key] = seen[key] || [];
    seen[key].push(e);
  });

  Object.entries(seen).forEach(([key, items]) => {
    if (items.length > 1) {
      const [date, amount, category] = key.split("__");
      dupes.push({
        date,
        amount: +amount,
        category,
        count: items.length,
        items: items,
      });
    }
  });

  if (!dupes.length) {
    banner.style.display = "none";
    return;
  }
  banner.style.display = "block";
  banner.innerHTML = `<div style="background:#ffc94715;border:1px solid var(--yellow);border-radius:10px;padding:12px 16px;">
    <div style="font-size:10px;color:var(--yellow);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">⚠ Possible Duplicates Detected (${dupes.length})</div>
    ${dupes
      .map(
        (
          d,
        ) => `<div style="font-size:11px;color:var(--text2);padding:6px 0;display:flex;gap:8px;">
      <span style="color:var(--yellow)">!</span>
      <span>${fmt(d.amount)} on <strong>${d.category}</strong> — ${d.date} appears <strong>${d.count}×</strong> — check & delete extras</span>
    </div>`,
      )
      .join("")}
    <div style="font-size:10px;color:var(--text3);margin-top:8px;">💡 Tip: Review in History page to delete duplicate transactions.</div>
  </div>`;
}

// ═══════════════════════════════════════════
//  MONTHLY SPENDING SUMMARY
// ═══════════════════════════════════════════
function generateMonthlySummary(monthKey) {
  const exps = monthExpenses(monthKey);
  const po = monthPayout(monthKey);
  const payout = po?.amount || 0;
  const spent = exps.reduce((s, e) => s + e.amount, 0);
  const saved = payout - spent;
  const savePct = payout > 0 ? ((saved / payout) * 100).toFixed(1) : 0;
  const spentPct = payout > 0 ? ((spent / payout) * 100).toFixed(0) : 0;

  const byCat = CATS.map((c) => ({
    ...c,
    total: exps
      .filter((e) => e.category === c.name)
      .reduce((s, e) => s + e.amount, 0),
    count: exps.filter((e) => e.category === c.name).length,
  }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const avgPerTx = exps.length > 0 ? spent / exps.length : 0;
  const topCategory = byCat.length > 0 ? byCat[0] : null;

  return {
    monthKey,
    monthLabel: monthLabel(monthKey),
    payout,
    spent,
    saved,
    savePct,
    spentPct,
    transactionCount: exps.length,
    avgPerTransaction: avgPerTx,
    byCat,
    topCategory,
    dayCount: exps.length > 0 ? new Set(exps.map((e) => e.date)).size : 0,
  };
}

function renderMonthlySummary() {
  const summary = generateMonthlySummary(activeMonth);
  const el = document.getElementById("summary-content");
  if (!el) return;

  const summaryHTML = `
    <div class="summary-header">
      <h2>${summary.monthLabel}</h2>
      <p class="summary-period">Monthly Overview & Analytics</p>
    </div>
    
    <div class="summary-stats-grid">
      <div class="summary-stat">
        <div class="summary-stat-label">Monthly Income</div>
        <div class="summary-stat-value" style="color: var(--accent2)">${summary.payout > 0 ? fmt(summary.payout) : "—"}</div>
      </div>
      <div class="summary-stat">
        <div class="summary-stat-label">Total Spent</div>
        <div class="summary-stat-value" style="color: var(--red)">${fmt(summary.spent)}</div>
      </div>
      <div class="summary-stat">
        <div class="summary-stat-label">Saved</div>
        <div class="summary-stat-value" style="color: ${summary.saved >= 0 ? "var(--green)" : "var(--red)"}">${summary.payout > 0 ? fmt(summary.saved) : "—"}</div>
      </div>
      <div class="summary-stat">
        <div class="summary-stat-label">Savings Rate</div>
        <div class="summary-stat-value">${summary.payout > 0 ? summary.savePct + "%" : "—"}</div>
      </div>
    </div>

    <div class="summary-details">
      <div class="summary-detail-row">
        <span class="detail-label">Total Transactions</span>
        <span class="detail-value">${summary.transactionCount}</span>
      </div>
      <div class="summary-detail-row">
        <span class="detail-label">Active Days</span>
        <span class="detail-value">${summary.dayCount}</span>
      </div>
      <div class="summary-detail-row">
        <span class="detail-label">Average per Transaction</span>
        <span class="detail-value">${fmt(summary.avgPerTransaction)}</span>
      </div>
      ${
        summary.topCategory
          ? `<div class="summary-detail-row">
        <span class="detail-label">Top Category</span>
        <span class="detail-value"><span style="display:inline-block;width:16px;height:16px;margin-right:4px">${getLucideIcon(summary.topCategory.icon, 16)}</span>${summary.topCategory.name}</span>
      </div>`
          : ""
      }
      <div class="summary-detail-row">
        <span class="detail-label">Spending Percentage</span>
        <span class="detail-value">${summary.payout > 0 ? summary.spentPct + "%" : "—"}</span>
      </div>
    </div>

    <div class="summary-breakdown">
      <h3 style="margin-bottom: 12px; font-size: 13px; text-transform: uppercase; color: var(--text3); letter-spacing: 1px;">Spending Breakdown</h3>
      ${
        summary.byCat.length > 0
          ? summary.byCat
              .map((c) => {
                const pct =
                  summary.payout > 0
                    ? ((c.total / summary.payout) * 100).toFixed(1)
                    : 0;
                return `<div class="cat-row">
        <div class="cat-header">
          <div class="cat-name"><span style="display:inline-block;width:16px;height:16px;margin-right:6px">${getLucideIcon(c.icon, 16)}</span><span style="color:${c.color}">${c.name}</span></div>
          <div style="font-size:12px;font-weight:700;color:${c.color}">${fmt(c.total)}</div>
        </div>
        <div class="prog-wrap" style="height:6px;"><div class="prog-fill" style="width:${Math.min(100, pct)}%;background:${c.color}"></div></div>
        <div style="font-size:9px;color:var(--text3);margin-top:3px">${pct}% of income · ${c.count} transaction${c.count !== 1 ? "s" : ""}</div>
      </div>`;
              })
              .join("")
          : '<div class="empty"><div class="empty-icon">📊</div>No expenses this month</div>'
      }
    </div>
  `;

  el.innerHTML = summaryHTML;
}

// ═══════════════════════════════════════════
//  IMPROVED DUPLICATE DETECTION
// ═══════════════════════════════════════════

// Schema definition for validation
const BACKUP_SCHEMA = {
  expenses: {
    type: "array",
    required: true,
    itemSchema: {
      id: { type: "number", required: true },
      amount: { type: "number", required: true },
      category: { type: "string", required: true },
      note: { type: "string", required: false },
      date: { type: "string", required: true },
      recurringId: { type: "number", required: false },
    },
  },
  payouts: {
    type: "array",
    required: true,
    itemSchema: {
      id: { type: "number", required: true },
      amount: { type: "number", required: true },
      month: { type: "number", required: true },
      year: { type: "number", required: true },
      note: { type: "string", required: false },
    },
  },
  goals: {
    type: "array",
    required: false,
    itemSchema: {
      id: { type: "number", required: true },
      name: { type: "string", required: true },
      target: { type: "number", required: true },
      saved: { type: "number", required: true },
      deadline: { type: "string", required: false },
    },
  },
  recurring: {
    type: "array",
    required: false,
    itemSchema: {
      id: { type: "number", required: true },
      name: { type: "string", required: true },
      amount: { type: "number", required: true },
      cat: { type: "string", required: true },
      freq: { type: "string", required: true },
      day: { type: "number", required: false },
    },
  },
  lastAnalysis: { type: "string", required: false, nullable: true },
  lastAnalysisDate: { type: "string", required: false, nullable: true },
  lastCheckin: { type: "string", required: false, nullable: true },
  lastCheckinDate: { type: "string", required: false, nullable: true },
  lastAnalysisMonthKey: { type: "string", required: false, nullable: true },
  theme: { type: "string", required: false },
  currency: { type: "string", required: false },
  autoLockTimeout: { type: "number", required: false },
  // Accepted for older backups, but PIN state must never be restored.
  pinEnabled: { type: "boolean", required: false },
};

function validateBackupSchema(data) {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Backup file must be a JSON object" };
  }

  // Check for unexpected top-level fields
  const allowedFields = Object.keys(BACKUP_SCHEMA);
  const unexpectedFields = Object.keys(data).filter(
    (field) => !allowedFields.includes(field),
  );
  if (unexpectedFields.length > 0) {
    return {
      valid: false,
      error: `Unexpected fields in backup: ${unexpectedFields.join(", ")}. This file may be corrupted or from a different app.`,
    };
  }

  // Validate each field
  for (const [field, fieldSchema] of Object.entries(BACKUP_SCHEMA)) {
    const value = data[field];

    // Check if required field is missing
    if (fieldSchema.required && !(field in data)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }

    // Skip validation if field is not present and not required
    if (!(field in data)) continue;

    if (value === null && fieldSchema.nullable) continue;

    // Type validation for arrays
    if (fieldSchema.type === "array") {
      if (!Array.isArray(value)) {
        return {
          valid: false,
          error: `Field "${field}" must be an array, got ${typeof value}`,
        };
      }

      // Validate each item in array
      if (fieldSchema.itemSchema) {
        for (let i = 0; i < value.length; i++) {
          const item = value[i];
          if (
            typeof item !== "object" ||
            item === null ||
            Array.isArray(item)
          ) {
            return {
              valid: false,
              error: `Item ${i} in "${field}" must be an object`,
            };
          }

          // Check for unexpected fields in array items
          const itemAllowedFields = Object.keys(fieldSchema.itemSchema);
          const itemUnexpectedFields = Object.keys(item).filter(
            (f) => !itemAllowedFields.includes(f),
          );
          if (itemUnexpectedFields.length > 0) {
            return {
              valid: false,
              error: `Item ${i} in "${field}" has unexpected fields: ${itemUnexpectedFields.join(", ")}`,
            };
          }

          // Validate each item field
          for (const [itemField, itemFieldSchema] of Object.entries(
            fieldSchema.itemSchema,
          )) {
            const itemValue = item[itemField];

            // Check required fields in item
            if (itemFieldSchema.required && !(itemField in item)) {
              return {
                valid: false,
                error: `Item ${i} in "${field}" is missing required field: ${itemField}`,
              };
            }

            // Skip if not present and not required
            if (!(itemField in item)) continue;

            // Type validation
            if (typeof itemValue !== itemFieldSchema.type) {
              return {
                valid: false,
                error: `Item ${i} in "${field}": field "${itemField}" must be ${itemFieldSchema.type}, got ${typeof itemValue}`,
              };
            }

            // Value range validation for specific fields
            if (itemField === "amount" && itemValue < 0) {
              return {
                valid: false,
                error: `Item ${i} in "${field}": amount cannot be negative`,
              };
            }
            if (itemField === "id" && itemValue <= 0) {
              return {
                valid: false,
                error: `Item ${i} in "${field}": id must be positive`,
              };
            }
            if (
              (itemField === "month" || itemField === "day") &&
              (itemValue < 0 || itemValue > 31)
            ) {
              return {
                valid: false,
                error: `Item ${i} in "${field}": ${itemField} must be between 0 and 31`,
              };
            }
            if (
              itemField === "year" &&
              (itemValue < 1900 || itemValue > 2100)
            ) {
              return {
                valid: false,
                error: `Item ${i} in "${field}": year must be between 1900 and 2100`,
              };
            }
          }
        }
      }
    } else {
      // Type validation for non-array fields
      if (typeof value !== fieldSchema.type) {
        return {
          valid: false,
          error: `Field "${field}" must be ${fieldSchema.type}, got ${typeof value}`,
        };
      }

      if (field === "currency" && !Object.hasOwn(CURRENCIES, value)) {
        return { valid: false, error: `Unsupported currency: ${value}` };
      }

      if (field === "autoLockTimeout" && ![0, 5, 10, 15, 30].includes(value)) {
        return {
          valid: false,
          error: "Auto-lock timeout must be 0, 5, 10, 15, or 30 minutes",
        };
      }
    }
  }

  return { valid: true };
}

function backupJSON() {
  const backup = {
    expenses: S.expenses,
    payouts: S.payouts,
    goals: S.goals,
    recurring: S.recurring,
    lastAnalysis: S.lastAnalysis,
    lastAnalysisDate: S.lastAnalysisDate,
    lastCheckin: S.lastCheckin,
    lastCheckinDate: S.lastCheckinDate,
    lastAnalysisMonthKey: S.lastAnalysisMonthKey,
    theme: S.theme,
    currency: S.currency,
    autoLockTimeout: S.autoLockTimeout,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cashero-backup-${new Date().toISOString().slice(0, 10)}.json`;
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

      // Validate against schema
      const validation = validateBackupSchema(parsed);
      if (!validation.valid) {
        toast(validation.error, "err");
        event.target.value = "";
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
        currency: parsed.currency || "USD",
        autoLockTimeout: parsed.autoLockTimeout ?? 15,
        pinEnabled: false, // never restore PIN state from backup — security risk
      };
      // Clear any PIN keys that might have been imported
      CasheroStorage.removeItem("cashero_pin_hash");
      CasheroStorage.removeItem("cashero_pin_salt");
      CasheroStorage.removeItem("cashero_recovery_hash");
      CasheroStorage.removeItem("cashero_recovery_salt");
      save();
      applyTheme();
      renderMonthPills();
      renderAll();
      initYearPills();
      toast(`Restored: ${expCount} expenses, ${payCount} payouts ✓`);
    } catch (err) {
      toast("Failed to parse backup file - invalid JSON", "err");
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
    ? [...withPayout].sort((a, b) => b.saved / b.payout - a.saved / a.payout)[0]
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
          <div class="cat-name"><span style="display:inline-block;width:16px;height:16px;margin-right:6px">${getLucideIcon(c.icon, 16)}</span><span style="color:${c.color}">${c.name}</span></div>
          <div style="font-size:12px;font-weight:700;color:${c.color}">${fmt(c.total)}</div>
        </div>
        <div class="prog-wrap" style="height:5px;"><div class="prog-fill" style="width:${((c.total / catMax) * 100).toFixed(0)}%;background:${c.color}"></div></div>
        <div style="font-size:9px;color:var(--text3);margin-top:3px">${totalSpent > 0 ? ((c.total / totalSpent) * 100).toFixed(1) : 0}% of total</div>
      </div>`,
        )
        .join("")
    : '<div class="empty"><div class="empty-icon">📊</div>No data</div>';

  // Yearly line chart
  const chartYear = activeYear;
  loadChartJS()
    .then(() => {
      if (
        activeYear !== chartYear ||
        !document.getElementById("page-yearly")?.classList.contains("active")
      )
        return;
      const { grid, text } = getChartColors();
      const ctx = document.getElementById("yr-line-chart").getContext("2d");
      if (yrLineChart) yrLineChart.destroy();
      yrLineChart = new window.Chart(ctx, {
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
    })
    .catch((error) =>
      CasheroErrors.reportError(error, "Could not load charts"),
    );
}

// ═══════════════════════════════════════════
//  PDF REPORT (browser print)
// ═══════════════════════════════════════════
function printPDFReport() {
  // Check if there are any transactions
  if (!S.expenses || S.expenses.length === 0) {
    toast("No transactions yet. Add expenses to generate a report.", "err");
    return;
  }

  // Check if there's data for the current year
  const yearlyExpenses = S.expenses.filter((e) =>
    e.date.startsWith(activeYear),
  );
  const payouts = S.payouts.filter((p) => p.date.startsWith(activeYear));

  if (yearlyExpenses.length === 0 && payouts.length === 0) {
    toast(
      `No transactions found for ${activeYear}. Add data to generate a report.`,
      "err",
    );
    return;
  }

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
    const storedNotifications =
      CasheroStorage.readJSON("cashero_notifs") || [];
    if (!Array.isArray(storedNotifications)) {
      throw new Error("Saved notifications have an invalid format.");
    }
    notifications = storedNotifications;
  } catch (error) {
    CasheroErrors.reportError(error, "Could not load saved notifications");
    notifications = [];
  }
}
function saveNotifications() {
  CasheroStorage.writeJSON("cashero_notifs", notifications.slice(0, 50));
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
  const typeIcon = {
    budget: "💸",
    recurring: "↺",
    goal: "◎",
    suspicious: "⚠",
    system: "✦",
  };
  const typeColor = {
    budget: "var(--red)",
    recurring: "var(--yellow)",
    goal: "var(--green)",
    suspicious: "var(--yellow)",
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
      "Push alerts require the app to be hosted - in-app alerts still work",
      "err",
    );
    const btn = document.getElementById("notif-perm-btn");
    if (btn) btn.textContent = "⚠ Host app to enable push";
    return;
  }
  try {
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
  } catch (error) {
    CasheroErrors.reportError(error, "Could not request notification permission");
    toast("Could not enable push alerts — in-app alerts still work", "err");
  }
}

function sendPushNotification(type, body) {
  if (location.protocol === "file:") return;
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  const titles = {
    budget: "💸 Budget Alert",
    recurring: "↺ Recurring Reminder",
    goal: "◎ Goal Update",
    suspicious: "⚠ Spending Alert",
    system: "✦ Cashero",
  };
  try {
    new Notification(titles[type] || "Cashero", {
      body,
      tag: `cashero-${type}`,
    });
  } catch (error) {
    CasheroErrors.reportError(error, "Could not display a push notification", {
      notify: false,
    });
  }
}

(function syncNotifBtn() {
  const btn = document.getElementById("notif-perm-btn");
  if (!btn) return;
  if (!("Notification" in window)) {
    btn.textContent = "Push alerts unavailable";
    return;
  }
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
  const alertKey = `cashero_budget_alerted_${activeMonth}`;
  const alerted80 = CasheroStorage.getItem(alertKey + "_80");
  const alerted100 = CasheroStorage.getItem(alertKey + "_100");
  if (pct >= 1.0 && !alerted100) {
    addNotification(
      "budget",
      `You've spent 100% of your ${monthLabel(activeMonth)} income (${fmt(spent)} / ${fmt(payout.amount)}) — you're in the red.`,
    );
    CasheroStorage.setItem(alertKey + "_100", "1");
  } else if (pct >= 0.8 && !alerted80) {
    addNotification(
      "budget",
      `You've spent 80% of your ${monthLabel(activeMonth)} income with ${daysLeft} day${daysLeft !== 1 ? "s" : ""} left — ${fmt(payout.amount - spent)} remaining.`,
    );
    CasheroStorage.setItem(alertKey + "_80", "1");
  }
}

function checkRecurringReminders() {
  if (!S.recurring.length) return;
  const today = new Date();
  const tomorrow = today.getDate() + 1;
  const alertKey = `cashero_recur_alerted_${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const alerted = new Set(JSON.parse(CasheroStorage.getItem(alertKey) || "[]"));
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
    CasheroStorage.setItem(alertKey, JSON.stringify([...alerted, ...newAlerts]));
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

// ═══════════════════════════════════════════
//  RESTORE COOLDOWN ON PAGE LOAD
// ═══════════════════════════════════════════
(function () {
  const lastAnalysisTime = CasheroStorage.getItem("cashero_last_analysis");
  if (!lastAnalysisTime) return;

  analysisLastRun = parseInt(lastAnalysisTime);
  const elapsed = Date.now() - analysisLastRun;
  const remaining = Math.max(0, 60 - Math.floor(elapsed / 1000));

  if (remaining > 0) {
    document.addEventListener("DOMContentLoaded", function () {
      const btn = document.getElementById("analysis-btn");
      if (btn) startCooldownTimer(btn, remaining);
    });
  }
})();

// ═══════════════════════════════════════════
//  MOBILE OPTIMIZATION & TOUCH HANDLING
// ═══════════════════════════════════════════
(function initMobileUI() {
  // Lock body scroll when modal is open
  const lockScroll = (shouldLock) => {
    if (shouldLock) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight =
        window.innerWidth - document.documentElement.clientWidth + "px";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  };

  // Monitor modal open/close states
  const quickModal = document.getElementById("quick-modal");
  const csvModal = document.getElementById("csv-export-modal");
  const pinOverlay = document.querySelector(".pin-overlay");

  const updateScrollLock = () => {
    const isModalOpen =
      (quickModal && quickModal.classList.contains("open")) ||
      (csvModal && csvModal.classList.contains("open")) ||
      (pinOverlay && pinOverlay.classList.contains("active"));
    lockScroll(isModalOpen);
  };

  if (quickModal) {
    const observer = new MutationObserver(updateScrollLock);
    observer.observe(quickModal, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  if (csvModal) {
    const observer = new MutationObserver(updateScrollLock);
    observer.observe(csvModal, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  if (pinOverlay) {
    const observer = new MutationObserver(updateScrollLock);
    observer.observe(pinOverlay, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  // Sidebar drawer behavior for mobile
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");

  if (sidebar) {
    // Close sidebar when nav item is clicked on mobile
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.addEventListener("click", () => {
        if (
          window.innerWidth <= 480 &&
          sidebar.classList.contains("expanded")
        ) {
          setSidebarExpanded(false);
        }
      });
    });

    // Close sidebar when clicking outside (backdrop, or anywhere off the drawer/trigger)
    document.addEventListener("click", (e) => {
      const mobileToggle = document.getElementById("mobile-nav-toggle");
      if (
        window.innerWidth <= 480 &&
        sidebar.classList.contains("expanded") &&
        !sidebar.contains(e.target) &&
        !(hamburger && hamburger.contains(e.target)) &&
        !(mobileToggle && mobileToggle.contains(e.target))
      ) {
        setSidebarExpanded(false);
      }
    });
  }

  // NOTE: we intentionally do NOT call preventDefault() on touchend for
  // buttons/inputs here. Doing so suppresses the synthetic "click" event
  // on real touch devices in most mobile browsers, which is why buttons
  // would visually respond to a tap but every onclick/addEventListener("click")
  // handler in the app would silently fail to fire. Double-tap-zoom and the
  // 300ms tap delay are handled the correct, non-destructive way via the
  // `touch-action: manipulation` CSS rule applied to interactive elements.

  // Optimize viewport for notches and safe areas
  const setupSafeAreas = () => {
    const style = document.createElement("style");
    style.textContent = `
      @supports (padding: max(0px)) {
        body {
          padding-left: max(12px, env(safe-area-inset-left));
          padding-right: max(12px, env(safe-area-inset-right));
          padding-top: max(0px, env(safe-area-inset-top));
          padding-bottom: max(0px, env(safe-area-inset-bottom));
        }
        #topbar {
          padding-left: max(12px, env(safe-area-inset-left));
          padding-right: max(12px, env(safe-area-inset-right));
        }
      }
    `;
    if (window.innerWidth <= 480) {
      document.head.appendChild(style);
    }
  };

  setupSafeAreas();

  // Handle viewport orientation changes
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      // Recalculate layouts on orientation change
      window.dispatchEvent(new Event("resize"));
    }, 100);
  });

  // Optimize input fields on mobile
  document.addEventListener(
    "focus",
    (e) => {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "SELECT"
      ) {
        if (window.innerWidth <= 480) {
          // Scroll input into view on mobile to avoid virtual keyboard overlap
          e.target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    },
    true,
  );

  // Reduce motion for users who prefer it
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.style.setProperty(
      "--transition-duration",
      "0.01s",
    );
    // Apply reduced motion styles
    const style = document.createElement("style");
    style.textContent = `
      * {
        animation-duration: 0.01s !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01s !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Performance: Lazy load non-critical resources
  if ("IntersectionObserver" in window) {
    // Can be used for charts and heavy components
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Trigger rendering for intersecting elements
        }
      });
    });
  }

  // (device info intentionally not exposed globally in production)
})();

// ═══════════════════════════════════════════
//  ONLINE STATUS INDICATOR
// ═══════════════════════════════════════════
function updateOnlineStatus() {
  const el = document.getElementById("online-status");
  if (!el) return;
  if (navigator.onLine) {
    el.textContent = "Online";
    el.className = "is-online";
  } else {
    el.textContent = "Offline";
    el.className = "is-offline";
  }
}
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
updateOnlineStatus();
loadDailyQuote();
scheduleDailyQuoteRefresh();
