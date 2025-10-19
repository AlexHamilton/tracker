/**
 * Google Apps Script for Habit Tracker
 *
 * This script receives data from your habit tracking app and logs it to a Google Sheet.
 *
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click "Deploy" > "New deployment"
 * 5. Select type: "Web app"
 * 6. Set "Execute as": "Me"
 * 7. Set "Who has access": "Anyone"
 * 8. Click "Deploy"
 * 9. Copy the web app URL and paste it into your tracker app settings
 */

// Main function that handles POST requests from your app
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Prepare row data
    const row = [
      data.dateFormatted || new Date().toLocaleDateString(),
      data.habits[0]?.completed ? "✓" : "✗", // Carbs
      data.habits[1]?.completed ? "✓" : "✗", // Water
      data.habits[2]?.completed ? "✓" : "✗", // Walk
      data.habits[3]?.completed ? "✓" : "✗", // Exercise
      data.habits[4]?.completed ? "✓" : "✗", // No Alcohol
      new Date().toLocaleTimeString(), // Timestamp
    ];

    // Check if headers exist, if not create them
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Date",
        "Carbs",
        "Water",
        "Walk",
        "Exercise",
        "No Alcohol",
        "Time Saved",
      ]);

      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4CAF50");
      headerRange.setFontColor("#FFFFFF");
    }

    // Check if today's date already exists
    const dateColumn = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    let rowIndex = -1;
    
    for (let i = 0; i < dateColumn.length; i++) {
      if (dateColumn[i][0] === row[0]) {
        rowIndex = i + 2; // +2 because arrays are 0-indexed and we skip header
        break;
      }
    }

    if (rowIndex > 0) {
      // Update existing row
      sheet.getRange(rowIndex, 1, 1, 7).setValues([row]);
    } else {
      // Add new row
      sheet.appendRow(row);
    }

    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, 7);

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Data saved successfully",
        timestamp: new Date().toISOString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Function to handle GET requests (for testing)
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "success",
      message: "Habit Tracker API is running",
      instructions: "Use POST request to submit habit data",
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

// Optional: Helper function to get data from the sheet
function getHabitData(days = 30) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return [];
  }

  const startRow = Math.max(2, lastRow - days + 1);
  const numRows = lastRow - startRow + 1;
  const data = sheet.getRange(startRow, 1, numRows, 7).getValues();

  return data;
}

// Optional: Helper function to calculate habit completion rates
function getHabitStats() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = getHabitData(30);

  if (data.length === 0) {
    return null;
  }

  const habits = ["Carbs", "Water", "Walk", "Exercise", "No Alcohol"];
  const stats = {
    totalDays: data.length,
    habits: [],
  };

  // Calculate completion rate for each habit (columns 2-6)
  for (let col = 1; col <= 5; col++) {
    let completed = 0;
    data.forEach((row) => {
      if (row[col] === "✓") {
        completed++;
      }
    });

    stats.habits.push({
      name: habits[col - 1],
      completionRate: ((completed / data.length) * 100).toFixed(1) + "%",
      completedDays: completed,
      totalDays: data.length,
    });
  }

  return stats;
}

// Optional: Function to generate a summary report
function generateSummaryReport() {
  const stats = getHabitStats();
  
  if (!stats) {
    Logger.log("No data available");
    return;
  }
  
  Logger.log("=== HABIT TRACKER SUMMARY (Last 30 Days) ===");
  Logger.log(`Total days tracked: ${stats.totalDays}`);
  Logger.log("");
  
  stats.habits.forEach(habit => {
    Logger.log(`${habit.name}: ${habit.completionRate} (${habit.completedDays}/${habit.totalDays} days)`);
  });
}
