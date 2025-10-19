// ============================================
// STATE MANAGEMENT
// ============================================

const STATE = {
  sheetsUrl: "",
  currentExercise: 0,
  exerciseImages: [
    "exercises/exercise_1.png",
    "exercises/exercise_2.png",
    "exercises/exercise_3.png",
    "exercises/exercise_4.png",
  ],
  habits: ["carbs", "water", "walk", "exercise", "noalcohol"],
  habitNames: {
    carbs: "Carbs",
    water: "Water",
    walk: "Walk",
    exercise: "Exercise",
    noalcohol: "No Alcohol",
  },
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  loadTodayData();
  updateDate();
  initializeTabs();
  initializeExercises();
  attachEventListeners();
  generateReport();
});

// ============================================
// DATE HANDLING
// ============================================

function updateDate() {
  const dateElement = document.getElementById("currentDate");
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const today = new Date();
  dateElement.textContent = today.toLocaleDateString("en-US", options);
}

function getDateString(date) {
  return date.toISOString().split("T")[0];
}

function getTodayString() {
  return getDateString(new Date());
}

// ============================================
// TAB MANAGEMENT
// ============================================

function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");
      switchTab(targetTab);
    });
  });

  const subtabButtons = document.querySelectorAll(".subtab-button");
  subtabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetSubtab = button.getAttribute("data-subtab");
      switchSubtab(targetSubtab);
    });
  });
}

function switchTab(tabName) {
  // Update buttons
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.classList.remove("active");
  });
  document
    .querySelector(`[data-tab="${tabName}"]`)
    .classList.add("active");

  // Update content
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });
  document.getElementById(`${tabName}-tab`).classList.add("active");

  // Refresh report if switching to report tab
  if (tabName === "report") {
    generateReport();
  }
}

function switchSubtab(subtabName) {
  // Update buttons
  document.querySelectorAll(".subtab-button").forEach((btn) => {
    btn.classList.remove("active");
  });
  document
    .querySelector(`[data-subtab="${subtabName}"]`)
    .classList.add("active");

  // Update content
  document.querySelectorAll(".subtab-content").forEach((content) => {
    content.classList.remove("active");
  });
  document.getElementById(`${subtabName}-subtab`).classList.add("active");

  // Render specific content
  if (subtabName === "trends") {
    renderTrendsChart();
  } else if (subtabName === "stats") {
    renderStats();
  }
}

// ============================================
// EXERCISE MANAGEMENT
// ============================================

function initializeExercises() {
  updateExerciseDisplay();
}

function updateExerciseDisplay() {
  const img = document.getElementById("exerciseImage");
  const counter = document.getElementById("exerciseCounter");

  img.src = STATE.exerciseImages[STATE.currentExercise];
  counter.textContent = `${STATE.currentExercise + 1} / ${STATE.exerciseImages.length}`;
}

function nextExercise() {
  STATE.currentExercise =
    (STATE.currentExercise + 1) % STATE.exerciseImages.length;
  updateExerciseDisplay();
}

function prevExercise() {
  STATE.currentExercise =
    (STATE.currentExercise - 1 + STATE.exerciseImages.length) %
    STATE.exerciseImages.length;
  updateExerciseDisplay();
}

// ============================================
// LOCAL STORAGE
// ============================================

function loadSettings() {
  const savedSettings = localStorage.getItem("trackerSettings");
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    STATE.sheetsUrl = settings.sheetsUrl || "";
    STATE.currentExercise = settings.currentExercise || 0;

    // Update settings panel
    document.getElementById("sheetsUrl").value = STATE.sheetsUrl;
  }
}

function saveSettings() {
  const settings = {
    sheetsUrl: STATE.sheetsUrl,
    currentExercise: STATE.currentExercise,
  };
  localStorage.setItem("trackerSettings", JSON.stringify(settings));
}

function loadTodayData() {
  const today = getTodayString();
  const allData = getAllHabitData();

  if (allData[today]) {
    // Restore checkbox states
    STATE.habits.forEach((habit) => {
      const checkbox = document.getElementById(`habit-${habit}`);
      if (checkbox) {
        checkbox.checked = allData[today][habit] || false;
      }
    });
  }
}

function saveTodayData() {
  const today = getTodayString();
  const allData = getAllHabitData();

  const todayData = {};
  STATE.habits.forEach((habit) => {
    const checkbox = document.getElementById(`habit-${habit}`);
    todayData[habit] = checkbox ? checkbox.checked : false;
  });

  allData[today] = todayData;
  localStorage.setItem("habitData", JSON.stringify(allData));
}

function getAllHabitData() {
  const saved = localStorage.getItem("habitData");
  return saved ? JSON.parse(saved) : {};
}

// ============================================
// EVENT LISTENERS
// ============================================

function attachEventListeners() {
  // Habit checkboxes - auto-save when checked
  STATE.habits.forEach((habit) => {
    const checkbox = document.getElementById(`habit-${habit}`);
    if (checkbox) {
      checkbox.addEventListener("change", () => {
        saveTodayData();
      });
    }
  });

  // Save to Google Sheets button
  const saveButton = document.getElementById("saveButton");
  if (saveButton) {
    saveButton.addEventListener("click", saveToGoogleSheets);
  }

  // Settings toggle
  const settingsToggle = document.getElementById("settingsToggle");
  const settingsPanel = document.getElementById("settingsPanel");
  if (settingsToggle && settingsPanel) {
    settingsToggle.addEventListener("click", () => {
      settingsPanel.classList.toggle("hidden");
    });
  }

  // Save settings button
  const saveSettingsButton = document.getElementById("saveSettings");
  if (saveSettingsButton) {
    saveSettingsButton.addEventListener("click", handleSaveSettings);
  }

  // Exercise navigation
  const nextBtn = document.getElementById("nextExercise");
  const prevBtn = document.getElementById("prevExercise");
  if (nextBtn) nextBtn.addEventListener("click", nextExercise);
  if (prevBtn) prevBtn.addEventListener("click", prevExercise);
}

// ============================================
// SETTINGS MANAGEMENT
// ============================================

function handleSaveSettings() {
  // Update Google Sheets URL
  const sheetsUrlInput = document.getElementById("sheetsUrl");
  if (sheetsUrlInput) {
    STATE.sheetsUrl = sheetsUrlInput.value.trim();
  }

  saveSettings();

  // Show success message
  showStatusMessage("Settings saved successfully!", "success");

  // Hide settings panel
  const settingsPanel = document.getElementById("settingsPanel");
  if (settingsPanel) {
    setTimeout(() => {
      settingsPanel.classList.add("hidden");
    }, 500);
  }
}

// ============================================
// GOOGLE SHEETS INTEGRATION
// ============================================

async function saveToGoogleSheets() {
  if (!STATE.sheetsUrl) {
    showStatusMessage(
      "Please configure Google Sheets URL in settings",
      "error"
    );
    return;
  }

  const today = getTodayString();
  const allData = getAllHabitData();
  const todayData = allData[today] || {};

  const data = {
    date: new Date().toISOString(),
    dateFormatted: new Date().toLocaleDateString("en-US"),
    habits: STATE.habits.map((habit) => ({
      name: STATE.habitNames[habit],
      completed: todayData[habit] || false,
    })),
  };

  try {
    showStatusMessage("Saving to Google Sheets...", "success");

    const response = await fetch(STATE.sheetsUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Note: With no-cors mode, we can't read the response
    // Assume success if no error was thrown
    showStatusMessage("✓ Saved to Google Sheets!", "success");
  } catch (error) {
    console.error("Error saving to Google Sheets:", error);
    showStatusMessage(
      "Error saving to Google Sheets. Check console for details.",
      "error"
    );
  }
}

// ============================================
// REPORT GENERATION
// ============================================

function generateReport() {
  const allData = getAllHabitData();
  const today = new Date();
  const reportData = [];

  // Generate data for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = getDateString(date);
    const dayData = allData[dateStr] || {};

    reportData.push({
      date: dateStr,
      displayDate: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      data: dayData,
    });
  }

  renderReportTable(reportData);
}

function calculateStatus(habit, reportData, currentIndex) {
  const dayData = reportData[currentIndex].data;

  if (habit === "carbs" || habit === "water" || habit === "walk") {
    // Daily requirements - green if done, red if not
    return dayData[habit] ? "green" : "red";
  } else if (habit === "exercise" || habit === "noalcohol") {
    // 3 out of 7 days requirement - green if met, grey if not
    let count = 0;
    for (let i = currentIndex; i < Math.min(currentIndex + 7, reportData.length); i++) {
      if (reportData[i].data[habit]) {
        count++;
      }
    }
    return count >= 3 ? "green" : "grey";
  }
  return "grey";
}

function renderReportTable(reportData) {
  const container = document.getElementById("reportTable");

  let html = '<table><thead><tr>';
  html += '<th>Date</th>';
  STATE.habits.forEach((habit) => {
    html += `<th>${STATE.habitNames[habit]}</th>`;
  });
  html += '</tr></thead><tbody>';

  reportData.forEach((row, index) => {
    html += `<tr><td><strong>${row.displayDate}</strong></td>`;

    STATE.habits.forEach((habit) => {
      const status = calculateStatus(habit, reportData, index);
      const icon = status === "green" ? "✓" : status === "red" ? "✗" : "−";
      html += `<td><span class="status-indicator status-${status}">${icon}</span></td>`;
    });

    html += "</tr>";
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

// ============================================
// CHARTS
// ============================================

function renderTrendsChart() {
  const canvas = document.getElementById("trendsChart");
  const ctx = canvas.getContext("2d");

  const allData = getAllHabitData();
  const today = new Date();
  const labels = [];
  const datasets = {};

  // Initialize datasets for each habit
  STATE.habits.forEach((habit) => {
    datasets[habit] = [];
  });

  // Get last 7 days of data
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = getDateString(date);
    labels.push(
      date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    );

    const dayData = allData[dateStr] || {};
    STATE.habits.forEach((habit) => {
      datasets[habit].push(dayData[habit] ? 1 : 0);
    });
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Simple bar chart implementation
  const width = canvas.width;
  const height = canvas.height;
  const barWidth = width / (labels.length * (STATE.habits.length + 1));
  const maxBarHeight = height - 40;

  // Draw bars
  labels.forEach((label, dayIndex) => {
    STATE.habits.forEach((habit, habitIndex) => {
      const value = datasets[habit][dayIndex];
      const x = dayIndex * (barWidth * (STATE.habits.length + 1)) + habitIndex * barWidth + 20;
      const barHeight = value * maxBarHeight;
      const y = height - barHeight - 30;

      // Draw bar
      ctx.fillStyle = value ? "#4CAF50" : "#E0E0E0";
      ctx.fillRect(x, y, barWidth - 2, barHeight);
    });

    // Draw label
    ctx.fillStyle = "#333";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      label.split(" ")[0],
      dayIndex * (barWidth * (STATE.habits.length + 1)) + (barWidth * STATE.habits.length) / 2 + 20,
      height - 10
    );
  });

  // Draw legend
  let legendX = 10;
  STATE.habits.forEach((habit) => {
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(legendX, 5, 15, 15);
    ctx.fillStyle = "#333";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(STATE.habitNames[habit], legendX + 20, 17);
    legendX += ctx.measureText(STATE.habitNames[habit]).width + 40;
  });
}

// ============================================
// STATISTICS
// ============================================

function renderStats() {
  const container = document.getElementById("statsContent");
  const allData = getAllHabitData();
  const today = new Date();

  let html = "";

  // Calculate stats for each habit
  STATE.habits.forEach((habit) => {
    let totalDays = 0;
    let completedDays = 0;

    // Last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = getDateString(date);
      const dayData = allData[dateStr];

      if (dayData) {
        totalDays++;
        if (dayData[habit]) {
          completedDays++;
        }
      }
    }

    const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    html += `
      <div class="stat-card">
        <h3>${STATE.habitNames[habit]}</h3>
        <div class="stat-value">${percentage}%</div>
        <div class="stat-label">${completedDays} of ${totalDays} days</div>
      </div>
    `;
  });

  // Current streak
  let currentStreak = 0;
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = getDateString(date);
    const dayData = allData[dateStr];

    if (!dayData) break;

    const allComplete = STATE.habits.every((habit) => dayData[habit]);
    if (allComplete) {
      currentStreak++;
    } else {
      break;
    }
  }

  html += `
    <div class="stat-card">
      <h3>Current Streak</h3>
      <div class="stat-value">${currentStreak}</div>
      <div class="stat-label">days with all habits complete</div>
    </div>
  `;

  container.innerHTML = html;
}

// ============================================
// UI FEEDBACK
// ============================================

function showStatusMessage(message, type) {
  const statusElement = document.getElementById("statusMessage");
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.className = `status-message ${type} show`;

    setTimeout(() => {
      statusElement.classList.remove("show");
    }, 3000);
  }
}
