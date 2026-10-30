export const CSV_HEADERS = [
  "Date",
  "Category",
  "Note",
  "Amount",
  "Recurring",
  "Tags",
];

export function normalizeTags(value) {
  const values = Array.isArray(value) ? value : String(value || "").split(/[,;|]/);
  const tags = [];
  const seen = new Set();

  for (const value of values) {
    const tag = String(value).trim().replace(/\s+/g, " ").slice(0, 32);
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
    if (tags.length === 20) break;
  }

  return tags;
}

function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/, 1)[0];
  const counts = { ",": 0, ";": 0, "\t": 0 };
  let quoted = false;

  for (let i = 0; i < firstLine.length; i++) {
    if (firstLine[i] === '"') {
      if (quoted && firstLine[i + 1] === '"') i++;
      else quoted = !quoted;
    } else if (!quoted && Object.hasOwn(counts, firstLine[i])) {
      counts[firstLine[i]]++;
    }
  }

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function parseRows(text, delimiter) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (!quoted && char === delimiter) {
      row.push(cell);
      cell = "";
    } else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (quoted) throw new Error("CSV contains an unclosed quoted field.");
  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

function normalizeHeader(value) {
  return value
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function findColumn(headers, candidates) {
  return headers.findIndex((header) => candidates.includes(header));
}

function parseImportDate(value) {
  const input = value.trim();
  let match = input.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (match) {
    const [, year, month, day] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (
      date.getFullYear() === Number(year) &&
      date.getMonth() === Number(month) - 1 &&
      date.getDate() === Number(day)
    ) {
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return null;
  }

  match = input.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{2}|\d{4})$/);
  if (!match) return null;
  let [, month, day, year] = match;
  if (Number(month) > 12) [month, day] = [day, month];
  let numericYear = Number(year);
  if (year.length === 2) numericYear += numericYear >= 70 ? 1900 : 2000;
  const date = new Date(numericYear, Number(month) - 1, Number(day));
  if (
    date.getFullYear() !== numericYear ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }
  return `${numericYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function parseImportAmount(value) {
  const input = value.trim();
  if (!input) return null;
  const parenthesized = input.startsWith("(") && input.endsWith(")");
  let cleaned = input.replace(/[^\d.,+-]/g, "");
  const lastComma = cleaned.lastIndexOf(",");
  const lastPeriod = cleaned.lastIndexOf(".");
  if (lastComma > lastPeriod) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (lastComma >= 0 && lastPeriod < 0 && /,\d{1,2}$/.test(cleaned)) {
    cleaned = cleaned.replace(",", ".");
  } else {
    cleaned = cleaned.replace(/,/g, "");
  }
  if (!/^[+-]?\d+(?:\.\d{1,2})?$/.test(cleaned)) return null;
  const amount = Number(cleaned);
  return Number.isFinite(amount) && amount !== 0
    ? Math.abs(parenthesized ? -amount : amount)
    : null;
}

export function parseTransactionCSV(text) {
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("The selected CSV file is empty.");
  }

  const rows = parseRows(text.replace(/^\uFEFF/, ""), detectDelimiter(text));
  if (rows.length < 2) {
    throw new Error("CSV must include a header row and at least one transaction.");
  }

  const headers = rows[0].map(normalizeHeader);
  const dateIndex = findColumn(headers, [
    "date",
    "transactiondate",
    "posteddate",
    "valuedate",
    "bookingdate",
  ]);
  const amountIndex = findColumn(headers, ["amount", "transactionamount"]);
  const debitIndex = findColumn(headers, ["debit", "withdrawal", "withdrawals"]);
  const creditIndex = findColumn(headers, ["credit", "deposit", "deposits"]);
  if (dateIndex < 0 || (amountIndex < 0 && debitIndex < 0)) {
    throw new Error(
      "CSV needs a date column and an amount, debit, or withdrawal column.",
    );
  }

  const categoryIndex = findColumn(headers, ["category", "transactioncategory"]);
  const noteIndex = findColumn(headers, [
    "note",
    "description",
    "memo",
    "details",
    "merchant",
    "name",
    "transactiondescription",
  ]);
  const tagsIndex = findColumn(headers, ["tags", "tag", "labels"]);
  const typeIndex = findColumn(headers, ["type", "transactiontype"]);
  const transactions = [];
  const errors = [];
  let ignored = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const date = parseImportDate(row[dateIndex] || "");
    const note = noteIndex < 0 ? "" : (row[noteIndex] || "").trim();
    let rawAmount = "";

    if (debitIndex >= 0) {
      rawAmount = row[debitIndex] || "";
      if (!rawAmount.trim() && creditIndex >= 0 && row[creditIndex]?.trim()) {
        ignored++;
        continue;
      }
      if (!rawAmount.trim() && amountIndex >= 0) rawAmount = row[amountIndex] || "";
    } else {
      rawAmount = row[amountIndex] || "";
    }

    const type =
      typeIndex < 0 ? "" : (row[typeIndex] || "").trim().toLowerCase();
    if (
      /^(credit|deposit|refund|income|credit transaction|deposit transaction)$/.test(
        type,
      )
    ) {
      ignored++;
      continue;
    }

    const amount = parseImportAmount(rawAmount);
    if (!date || amount === null) {
      errors.push(`Row ${i + 1}: invalid date or amount.`);
      continue;
    }

    transactions.push({
      amount,
      category:
        categoryIndex < 0 || !row[categoryIndex]?.trim()
          ? "Other"
          : row[categoryIndex].trim().slice(0, 80),
      date,
      note: note.slice(0, 500),
      tags: tagsIndex < 0 ? [] : normalizeTags(row[tagsIndex] || ""),
    });
  }

  if (transactions.length === 0 && errors.length) {
    throw new Error(`No valid transactions found. ${errors[0]}`);
  }
  return { transactions, errors, ignored };
}

function protectSpreadsheetText(value) {
  const text = String(value ?? "");
  return /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
}

function csvCell(value) {
  const text = protectSpreadsheetText(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function transactionsToCSV(transactions, includeAllColumns = true) {
  const headers = includeAllColumns
    ? CSV_HEADERS
    : ["Date", "Category", "Amount"];
  const rows = [headers.map(csvCell).join(",")];
  for (const expense of transactions) {
    const values = includeAllColumns
      ? [
          expense.date,
          expense.category,
          expense.note || "",
          expense.amount,
          expense.recurringId ? "Yes" : "No",
          normalizeTags(expense.tags).join("; "),
        ]
      : [expense.date, expense.category, expense.amount];
    rows.push(values.map(csvCell).join(","));
  }
  return `\uFEFF${rows.join("\r\n")}`;
}

function xmlCell(value, type = "String") {
  let text;
  if (type === "Number") {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      throw new Error("Cannot export a transaction with an invalid amount.");
    }
    text = String(number);
  } else {
    text = protectSpreadsheetText(value);
  }
  const escaped = text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
  return `<Cell><Data ss:Type="${type}">${escaped}</Data></Cell>`;
}

export function transactionsToExcelXML(transactions, includeAllColumns = true) {
  const headers = includeAllColumns
    ? CSV_HEADERS
    : ["Date", "Category", "Amount"];
  const rows = [
    `<Row>${headers.map((header) => xmlCell(header)).join("")}</Row>`,
  ];

  for (const expense of transactions) {
    const values = includeAllColumns
      ? [
          [expense.date, "String"],
          [expense.category, "String"],
          [expense.note || "", "String"],
          [expense.amount, "Number"],
          [expense.recurringId ? "Yes" : "No", "String"],
          [normalizeTags(expense.tags).join("; "), "String"],
        ]
      : [
          [expense.date, "String"],
          [expense.category, "String"],
          [expense.amount, "Number"],
        ];
    rows.push(
      `<Row>${values.map(([value, type]) => xmlCell(value, type)).join("")}</Row>`,
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="Transactions"><Table>${rows.join("")}</Table></Worksheet>
</Workbook>`;
}

function toBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

async function deriveEncryptionKey(passphrase, salt, iterations) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptBackup(data, passphrase) {
  if (typeof passphrase !== "string" || passphrase.length < 12) {
    throw new Error("Use a backup passphrase with at least 12 characters.");
  }

  const iterations = 310000;
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveEncryptionKey(passphrase, salt, iterations);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(data)),
  );
  return {
    version: 1,
    kdf: "PBKDF2-SHA-256",
    iterations,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(new Uint8Array(ciphertext)),
  };
}

export async function decryptBackup(envelope, passphrase) {
  if (
    !envelope ||
    envelope.version !== 1 ||
    envelope.kdf !== "PBKDF2-SHA-256" ||
    envelope.iterations !== 310000 ||
    typeof envelope.salt !== "string" ||
    typeof envelope.iv !== "string" ||
    typeof envelope.ciphertext !== "string"
  ) {
    throw new Error("Cloud backup has an unsupported or invalid format.");
  }

  const key = await deriveEncryptionKey(
    passphrase,
    fromBase64(envelope.salt),
    envelope.iterations,
  );
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(envelope.iv) },
    key,
    fromBase64(envelope.ciphertext),
  );
  return JSON.parse(new TextDecoder().decode(plaintext));
}

export function filterTransactions(expenses, filters = {}) {
  const tags = normalizeTags(filters.tags).map((tag) => tag.toLowerCase());
  const minimum =
    filters.minimumAmount == null || filters.minimumAmount === ""
      ? null
      : Number(filters.minimumAmount);
  const maximum =
    filters.maximumAmount == null || filters.maximumAmount === ""
      ? null
      : Number(filters.maximumAmount);
  if (
    (filters.startDate && filters.endDate && filters.startDate > filters.endDate) ||
    (minimum !== null && (!Number.isFinite(minimum) || minimum < 0)) ||
    (maximum !== null && (!Number.isFinite(maximum) || maximum < 0)) ||
    (minimum !== null && maximum !== null && minimum > maximum)
  ) {
    throw new Error("Transaction filters contain an invalid date or amount range.");
  }

  return expenses.filter((expense) => {
    if (filters.category && expense.category !== filters.category) return false;
    if (filters.startDate && expense.date < filters.startDate) return false;
    if (filters.endDate && expense.date > filters.endDate) return false;
    if (minimum !== null && expense.amount < minimum) return false;
    if (maximum !== null && expense.amount > maximum) return false;
    const expenseTags = normalizeTags(expense.tags).map((tag) =>
      tag.toLowerCase(),
    );
    return tags.every((tag) =>
      expenseTags.some((expenseTag) => expenseTag.includes(tag)),
    );
  });
}
