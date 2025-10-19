# Habit Tracker

A beautiful, simple habit tracking app optimized for iPhone. Track 5 daily habits (Carbs, Water, Walk, Exercise, No Alcohol), view exercise images, and automatically sync your progress to Google Sheets for long-term storage.

## Features

- ✅ **Track 5 Daily Habits** - Carbs, Water, Walk, Exercise, No Alcohol
- 📊 **Smart Reporting** - Green/red/grey indicators with intelligent 7-day rolling window for Exercise and No Alcohol
- 🏋️ **Exercise Images** - Cycle through 4 exercise images extracted from your Excel file
- 📱 **iPhone Optimized** - Beautiful tabbed interface with Daily, Exercises, and Report views
- 💾 **Dual Storage** - Local storage for offline access + Google Sheets for cloud backup
- 📈 **Analytics** - View trends, statistics, and completion rates

## Quick Start

1. **Open the app** - Open `index.html` in Safari on your iPhone
2. **Set up Google Sheets** - Follow the instructions in [SETUP.md](SETUP.md)
3. **Configure settings** - Add your Google Sheets URL in the Daily tab settings
4. **Start tracking!** - Check off habits as you complete them

For detailed setup instructions, see [SETUP.md](SETUP.md)

## How It Works

### Daily Habits

The app tracks 5 habits:
- 🥖 **Carbs** - Must be completed every day
- 💧 **Water** - Must be completed every day  
- 🚶 **Walk** - Must be completed every day
- 🏋️ **Exercise** - Must be completed 3 out of 7 days (rolling window)
- 🚫🍺 **No Alcohol** - Must be completed 3 out of 7 days (rolling window)

### Report Logic

The report shows color-coded status for each habit:
- **Green (✓)**: Requirement met
- **Red (✗)**: Daily requirement not met (Carbs, Water, Walk)
- **Grey (−)**: 7-day requirement not met (Exercise, No Alcohol)

This means Exercise and No Alcohol will show grey (not red) when you haven't hit the 3/7 target, so you can tell at a glance which habits are truly failing vs. which just need more consistency over the week.

### Three Tabs

1. **Daily** - Check off today's habits and sync to Google Sheets
2. **Exercises** - Cycle through your 4 exercise images
3. **Report** - View your habit completion with 3 subtabs:
   - **Overview** - 30-day table with color-coded status
   - **Trends** - 7-day visual chart
   - **Stats** - Completion percentages and current streak

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Storage**: LocalStorage + Google Sheets
- **Backend**: Google Apps Script
- **Design**: Mobile-first, iOS-optimized with tab navigation

## Why This App?

Built with the philosophy of simplicity and control:
- No frameworks - pure HTML/CSS/JS for maximum simplicity
- No external dependencies or build process
- Complete control over look and feel
- Your data stays in YOUR Google Sheet
- Works offline with local storage fallback
- Can be added to iPhone home screen as a web app

## File Structure

```
tracker/
├── index.html              # Main app interface with tabbed navigation
├── styles.css             # Mobile-optimized styling with tab support
├── app.js                 # App logic with reporting and charts
├── google-apps-script.js  # Google Apps Script for backend
├── exercises/             # Exercise images extracted from Excel
│   ├── exercise_1.png
│   ├── exercise_2.png
│   ├── exercise_3.png
│   └── exercise_4.png
├── import/               # Source data
│   └── Alex Log.xlsx     # Original Excel file
├── SETUP.md              # Detailed setup instructions
└── README.md             # This file
```

## Usage

### Adding to iPhone Home Screen
1. Open `index.html` in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Name it "Habit Tracker" and tap "Add"

Now you have a native-like app on your iPhone!

### Daily Workflow

1. **Morning**: Open the app and check the Report tab to see your status
2. **Throughout the day**: Check off habits as you complete them in the Daily tab
3. **Evening**: Review the Exercises tab for tomorrow's workout
4. **Anytime**: Tap "Save to Google Sheets" to sync your data to the cloud

## Data Storage

- **Local Storage**: All data is automatically saved to your browser's local storage
- **Google Sheets**: Manually sync by tapping the "Save to Google Sheets" button
- **Note**: The Google Sheets updates/creates a single row per day, so you can save multiple times per day without creating duplicates

## Privacy

- All data is stored in YOUR Google Sheet (you control it)
- No third-party servers or services
- No tracking or analytics
- Local storage for offline access

## License

MIT License - feel free to use, modify, and share!

---

Happy habit tracking! 🎯
