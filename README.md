# Cashero AI Project

A modern web application for tracking and managing personal finances with intelligent expense categorization and analysis.

## Features

- 📊 **Expense Tracking** - Record and categorize transactions instantly
- 🏷️ **Smart Categories** - Pre-configured categories including Food & Dining, Transport, Software, Entertainment, Health, Housing, Shopping, and Education
- 🔐 **Secure Storage** - Local browser storage with PIN protection
- 📈 **Financial Analytics** - Visualize spending patterns and trends
- 🔎 **Spending Insights** - Flag unusually large transactions, compare category
  spending with the same point last month, identify likely recurring charges,
  and get a daily spending target for the rest of the month
- 🧠 **Spending Behavior Learning** - Learn category preferences from repeated
  expense descriptions and reveal personal spending patterns from recent
  transactions; all learning runs locally on the device
- ✨ **AI-Assisted Categorization** - Classify expenses from natural-language
  quick entries and suggest categories learned from your local history
- 🔍 **Natural-Language Transaction Search** - Search notes and categories with
  plain-language filters such as "food last month" or "coffee over $5"
- ⚠️ **Duplicate Detection** - Flag same-day expenses with matching amounts,
  categories, and descriptions for review
- 🌙 **Dark Mode Support** - Comfortable viewing in any lighting condition
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🔄 **Recovery Phrases** - Secure account recovery mechanism
- 💾 **JSON Backup & Restore** - Download and restore expenses, income, goals,
  recurring items, and preferences
- 📤 **CSV and Excel Export** - Export transactions by date range, with
  spreadsheet-safe CSV or Excel-compatible workbook files
- 📥 **CSV Import** - Import common bank/app exports with duplicate detection
  and row validation
- 🏷️ **Transaction Tags & Filters** - Tag expenses and filter history by tag,
  category, date, and amount
- 🔎 **Advanced Transaction Search** - Combine structured filters with natural
  language queries
- 📄 **PDF Reports** - Print the yearly report or save it as PDF from the
  browser print dialog
- 📝 **Error Logging** - Comprehensive API error tracking for debugging

## Technology Stack

- **Frontend**: HTML5, CSS3, and vanilla JavaScript (ES modules)
- **Frontend modules**: DOM-based UI components live in `modules/components/`;
  feature modules handle API access, persistence, daily quotes, and error
  reporting. JSON requests share the logged API client.
- **Android packaging**: Capacitor uses the production web build in `dist/`.
- **Storage**: Browser LocalStorage with JSON serialization
- **Deployment**: Vercel
- **Icons**: Font Awesome via the project kit
- **Performance**: Chart.js loads on demand; the service worker serves cached
  pages and static assets immediately while refreshing them in the background

## Quick Start

See [SETUP.md](SETUP.md) for detailed installation and development instructions.

### Android shell

Use Node.js 22 or newer for Capacitor 8. The `android/` platform project is
scaffolded; run `npm run android:sync` after web changes. Open the project in
Android Studio with `npm run android:open`. See the
[Android APK guide](./ANDROID_APP_ROADMAP.md) for prerequisites and debug/release
build steps.

## API Error Logging

The API module includes an error logging system (`APILogger`) that:

- Tracks all API calls with timing information
- Captures HTTP errors and network failures
- Stores up to 50 log entries
- Provides real-time console logging for debugging
- Exposes logs via `window.APILogger` for inspection

**Access logs in browser console:**

```javascript
console.log(window.APILogger.getLogs());
console.log(window.APILogger.getLastError());
console.log(window.APILogger.exportLogs());
```

Unexpected runtime errors and unhandled promise rejections are logged and shown
in a dismissible on-page alert. Storage restore failures are reported without
discarding the rest of the application defaults.

## Usage

1. Open the application in your browser
2. Set up a PIN for security
3. Start adding transactions with categories
4. View analytics and spending patterns
5. Use recovery phrase backup for account recovery
6. Use **Backup JSON** and **Restore JSON** in the sidebar to save or restore
   your data; restoring replaces current app data and does not restore PIN
   security credentials
7. Add comma-separated tags when creating an expense, then combine category,
   date, amount, tag, and natural-language search in **History**
8. Use **Import CSV** for bank/app transaction files. CSVs need a date and
   amount (or debit/withdrawal) column; common date, description, category,
   and tag headers are detected automatically. Credit/deposit/refund/income
   rows are ignored, malformed rows are reported, and matching existing
   transactions are skipped. A single `Amount` column is treated as expenses.
9. Choose **Export CSV / Excel** to export a date range. Excel output is an
   Excel-compatible SpreadsheetML `.xls` workbook; CSV output includes UTF-8
   encoding and spreadsheet formula-injection protection.
10. Open **Yearly Report → Download PDF** and choose **Save as PDF** in the
    browser's print dialog.

## Development

Install dependencies and run the Vite development server:

```sh
npm install
npm run dev
```

Create and preview a production build with `npm run build` and
`npm run preview`. Run browser end-to-end tests with:

```sh
npx playwright install chromium
npm run test:e2e
```

Check the browser console for API error logs. LocalStorage is cleared with
browser data.

## Future Enhancements

See [ROADMAP.md](ROADMAP.md) for planned features and improvements.

## License

Private Project

## Support

For issues or feature requests, refer to the ROADMAP or contact the development team.
