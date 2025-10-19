# Habit Tracker Setup Guide

A simple, beautiful habit tracking app for iPhone with three tabs: Daily tracking, Exercise images, and comprehensive Reports.

## Features

- ✅ Track 5 daily habits: Carbs, Water, Walk, Exercise, No Alcohol
- 📊 Smart reporting with green/red/grey indicators
- 🏋️ Display 4 exercise images with cycling functionality
- 📱 Optimized for iPhone with tabbed interface
- 💾 Local + cloud storage (Google Sheets)
- 📈 Analytics with trends and statistics

## Quick Start

### 1. Set Up Google Sheets Integration

#### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Habit Tracker Data"

#### Step 2: Set Up Apps Script

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of `google-apps-script.js` from this repository
4. Paste it into the Apps Script editor
5. Click the **Save** icon (💾) and give your project a name

#### Step 3: Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: "Habit Tracker API" (or any name)
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
5. Click **Deploy**
6. You may need to authorize the script:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** (if you see a warning)
   - Click **Go to [your project name] (unsafe)**
   - Click **Allow**
7. **Copy the Web app URL** - you'll need this!

### 2. Configure Your Tracker App

#### Step 1: Open the App

1. Open `index.html` in your browser
2. For iPhone: Add to Home Screen for app-like experience
   - Open in Safari
   - Tap the Share button
   - Scroll down and tap **Add to Home Screen**
   - Name it "Habit Tracker"

#### Step 2: Configure Settings

1. Go to the **Daily** tab
2. Tap the **⚙️ Settings** button
3. Paste the Web app URL you copied from Apps Script deployment into the **Google Sheets URL** field
4. Tap **Save Settings**

That's it! You're ready to start tracking.

### 3. Using the App

#### Daily Tab

This is your main tracking interface:

1. Check off habits as you complete them throughout the day
2. Changes are automatically saved locally (no internet required)
3. Data automatically syncs with Google Sheets when you check habits
4. Data persists even if you close the browser
5. The app syncs on load, every 5 minutes, and whenever you change a habit

**The 5 Habits:**
- 🥖 **Carbs** - Track your carb intake
- 💧 **Water** - Stay hydrated
- 🚶 **Walk** - Get your steps in
- 🏋️ **Exercise** - Complete your workout
- 🚫🍺 **No Alcohol** - Track alcohol-free days

#### Exercises Tab

View your workout routine:

1. See one exercise image at a time
2. Use **← Previous** and **Next →** buttons to cycle through all 4 exercises
3. Exercise images are extracted from your Excel file

#### Report Tab

Comprehensive analytics with three subtabs:

**Overview Subtab:**
- Shows last 30 days in a table format
- Color-coded status indicators:
  - **Green (✓)**: Requirement met
  - **Red (✗)**: Daily requirement not met (for Carbs, Water, Walk)
  - **Grey (−)**: 7-day requirement not met (for Exercise, No Alcohol)

**Trends Subtab:**
- Visual bar chart showing last 7 days
- See patterns across all 5 habits at once

**Stats Subtab:**
- Completion percentages for each habit (last 30 days)
- Current streak counter (days with all habits complete)

#### Understanding the Report Logic

The app uses two different evaluation methods:

1. **Daily Requirements** (Carbs, Water, Walk):
   - Must be completed every single day
   - Shows **green** if done, **red** if not done

2. **7-Day Rolling Window** (Exercise, No Alcohol):
   - Must be completed 3 out of the last 7 days
   - Shows **green** if 3+ completions in last 7 days
   - Shows **grey** (not red) if less than 3 completions
   - This allows flexibility while maintaining consistency

Example: If you exercised Monday, Wednesday, and Friday, then on Saturday you'll see green for Exercise because you hit 3 out of the last 7 days.

## File Structure

```
tracker/
├── index.html              # Main app with tabbed interface
├── styles.css             # Mobile-optimized styling
├── app.js                 # App logic and reporting
├── google-apps-script.js  # Google Apps Script for Sheets
├── exercises/             # Exercise images (4 PNGs)
├── import/               # Original Excel file
├── SETUP.md              # This file
└── README.md             # Project overview
```

## Troubleshooting

### Google Sheets not saving

- Make sure you copied the correct Web app URL
- Check that the Apps Script is deployed as "Anyone" can access
- Try redeploying the Apps Script
- Check browser console (F12) for error messages

### Exercise images not loading

- Make sure the `exercises` folder contains the 4 PNG files
- Check browser console for 404 errors
- Images are relative paths, so the HTML file must be served from the project root

### App not working on iPhone

- Use Safari browser (best compatibility)
- Make sure JavaScript is enabled
- Try clearing Safari cache and reloading
- Add to Home Screen for best experience

### Settings not saving

- Check browser local storage is enabled
- Don't use Private/Incognito mode (storage is cleared on exit)
- Try a different browser if issues persist

### Report not showing data

- Make sure you've checked off at least one habit
- Data is stored locally in your browser
- Try refreshing the page
- Check the Daily tab to verify data was saved

## Advanced Tips

### Viewing Your Data in Google Sheets

After syncing, your Google Sheet will have:
- Column A: Date
- Columns B-F: Carbs, Water, Walk, Exercise, No Alcohol (✓ or ✗)
- Column G: Timestamp of when data was saved

The script automatically updates existing rows (by date), so saving multiple times per day won't create duplicates.

### Smart Data Merging

The app intelligently merges data from Google Sheets and local storage:

- When syncing, it compares both sources for each day
- If **either** source shows a habit was completed, it marks it as completed
- This means you can update directly in Google Sheets if you forget to track a day
- The next time you open the app, it will merge the Sheets data with your local data

### Using Apps Script Functions

The `google-apps-script.js` file includes helper functions you can run:

- `getHabitStats()` - Get completion percentages
- `generateSummaryReport()` - Log summary to console
- Run these from Apps Script editor: **Run** button

### Customizing Exercise Images

Replace the files in the `exercises/` folder:
- Keep the names: `exercise_1.png`, `exercise_2.png`, etc.
- Use PNG or JPG format
- Recommended size: 400-800px width for best display

## Date Filtering

The app only tracks and displays data from **October 19, 2025 onwards**. This means:

- The report will only show dates from this date forward
- Any data before this date is automatically filtered out
- This keeps your tracking focused on the current tracking period

## Data Export

Your data is stored in two places:

1. **Browser Local Storage** (JSON format)
   - Accessible via browser developer tools
   - Keys: `trackerSettings`, `habitData`

2. **Google Sheets** (spreadsheet format)
   - Download as CSV or Excel from Google Sheets
   - Use File > Download in Google Sheets

## Privacy & Data

- All habit data is stored in YOUR Google Sheet (you own it)
- Local browser storage keeps recent data for offline access
- No third-party servers involved
- No tracking or analytics
- All processing happens on your device or your Google account

## Support

For issues or questions, check:

1. Browser console for error messages (F12 > Console)
2. Apps Script execution logs (Apps Script > Executions)
3. Verify all URLs and settings are correct
4. Make sure you're using Safari on iPhone for best experience

---

**Enjoy tracking your habits! 🎯**
