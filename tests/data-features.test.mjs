import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import test from "node:test";
import {
  decryptBackup,
  encryptBackup,
  filterTransactions,
  normalizeTags,
  parseTransactionCSV,
  transactionsToCSV,
  transactionsToExcelXML,
} from "../modules/data-features.mjs";

globalThis.crypto ??= webcrypto;

test("imports quoted CSV fields, common dates, and tags", () => {
  const result = parseTransactionCSV(
    'Transaction Date,Description,Amount,Category,Tags\r\n' +
      '10/30/2026,"Cafe, downtown",12.5,Food & Dining,"work; coffee"\r\n' +
      '2026-10-29,"Line one\nLine two",4,Other,',
  );
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.transactions, [
    {
      amount: 12.5,
      category: "Food & Dining",
      date: "2026-10-30",
      note: "Cafe, downtown",
      tags: ["work", "coffee"],
    },
    {
      amount: 4,
      category: "Other",
      date: "2026-10-29",
      note: "Line one\nLine two",
      tags: [],
    },
  ]);
});

test("imports debit columns and ignores deposits", () => {
  const result = parseTransactionCSV(
    "Date,Description,Debit,Credit\n" +
      "2026-01-03,Groceries,25.99,\n" +
      "2026-01-04,Paycheck,,1200.00\n",
  );
  assert.equal(result.transactions.length, 1);
  assert.equal(result.transactions[0].amount, 25.99);
  assert.equal(result.transactions[0].note, "Groceries");
  assert.equal(result.ignored, 1);
});

test("keeps credit-card purchases while ignoring income transaction types", () => {
  const result = parseTransactionCSV(
    "Date,Description,Amount,Type\n" +
      "2026-01-03,Shop purchase,25.99,Credit Card\n" +
      "2026-01-04,Paycheck,1200.00,Income",
  );
  assert.equal(result.transactions.length, 1);
  assert.equal(result.transactions[0].note, "Shop purchase");
  assert.equal(result.ignored, 1);
});

test("imports semicolon-delimited European dates and decimal amounts", () => {
  const result = parseTransactionCSV(
    "Date;Description;Amount\n31.10.2026;Cafe;12,50",
  );
  assert.deepEqual(result.errors, []);
  assert.equal(result.transactions[0].date, "2026-10-31");
  assert.equal(result.transactions[0].amount, 12.5);
});

test("reports invalid rows and rejects files without required columns", () => {
  const result = parseTransactionCSV(
    "Date,Amount\n2026-02-01,10\n2026-02-31,not-money",
  );
  assert.equal(result.transactions.length, 1);
  assert.deepEqual(result.errors, ["Row 3: invalid date or amount."]);
  assert.throws(() => parseTransactionCSV("Description,Category\nLunch,Food"));
  assert.throws(() => parseTransactionCSV('Date,Amount\n2026-01-01,"10'));
});

test("normalizes tags and applies structured transaction filters", () => {
  assert.deepEqual(normalizeTags([" Work ", "work", "Trip"]), ["Work", "Trip"]);
  const expenses = [
    { date: "2026-01-01", amount: 8, category: "Food", tags: ["Work"] },
    { date: "2026-01-02", amount: 18, category: "Food", tags: ["Personal"] },
    { date: "2026-02-01", amount: 18, category: "Travel", tags: ["Work"] },
  ];
  assert.deepEqual(
    filterTransactions(expenses, {
      category: "Food",
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      minimumAmount: "10",
      maximumAmount: "20",
      tags: "work",
    }),
    [],
  );
  assert.deepEqual(
    filterTransactions(expenses, {
      category: "Travel",
      tags: "work",
      minimumAmount: "10",
    }),
    [expenses[2]],
  );
  assert.throws(
    () => filterTransactions(expenses, { minimumAmount: "not-an-amount" }),
    /invalid date or amount range/,
  );
});

test("exports Excel-safe CSV and a spreadsheet workbook", () => {
  const expense = {
    date: "2026-03-01",
    category: "Food",
    note: '=HYPERLINK("https://example.com","click")',
    amount: 2.5,
    tags: ["lunch"],
  };
  const csv = transactionsToCSV([expense]);
  assert.match(csv, /"'\=HYPERLINK/);
  assert.match(csv, /"lunch"/);
  assert.match(csv, /"Food"/);

  const workbook = transactionsToExcelXML([expense]);
  assert.match(workbook, /Workbook/);
  assert.match(workbook, /ss:Type="Number">2\.5/);
  assert.match(workbook, /&quot;https:\/\/example\.com/);
  assert.equal(
    transactionsToCSV([expense], false).split("\r\n")[0],
    '\uFEFF"Date","Category","Amount"',
  );
});

test("encrypts backup data and rejects incorrect passphrases", async () => {
  const original = { expenses: [{ amount: 5, tags: ["work"] }], currency: "USD" };
  const encrypted = await encryptBackup(original, "correct horse battery");
  assert.deepEqual(
    await decryptBackup(encrypted, "correct horse battery"),
    original,
  );
  await assert.rejects(decryptBackup(encrypted, "wrong passphrase value"));
  await assert.rejects(encryptBackup(original, "short"), /at least 12/);
});
