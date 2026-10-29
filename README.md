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
- 📝 **Error Logging** - Comprehensive API error tracking for debugging

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Frontend modules**: API handling, persistence, daily quotes, and global
  error reporting live in `modules/`; `main.js` retains the classic-script UI
  bridge for existing inline handlers
- **Storage**: Browser LocalStorage with JSON serialization
- **Deployment**: Vercel
- **Icons**: Font Awesome via the project kit
- **Performance**: Chart.js loads on demand; the service worker serves cached
  pages and static assets immediately while refreshing them in the background

## Quick Start

See [SETUP.md](SETUP.md) for detailed installation and development instructions.

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

## Development

- No build process required - pure HTML/CSS/JS
- Open `index.html` in browser or use local dev server
- Check browser console for API error logs
- LocalStorage is cleared with browser data

## Future Enhancements

See [ROADMAP.md](ROADMAP.md) for planned features and improvements.

## License

Private Project

## Support

For issues or feature requests, refer to the ROADMAP or contact the development team.
