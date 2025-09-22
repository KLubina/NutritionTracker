class UIComponents {
  constructor() {
    this.currentViewDate = new Date();
  }

  //#region 📑 TAB MANAGEMENT
  switchTab(tabName) {
    document
      .querySelectorAll(".tab")
      .forEach((tab) => tab.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((content) => content.classList.remove("active"));

    document
      .querySelector(`[onclick="switchTab('${tabName}')"]`)
      .classList.add("active");
    document.getElementById(`${tabName}-tab`).classList.add("active");

    // Trigger specific renders for certain tabs
    if (tabName === "history") {
      // History will be re-rendered by the data callback
    } else if (tabName === "stats") {
      // Stats will be re-rendered by the data callback
    }
  }
  //#endregion

  //#region 🥘 FOODS RENDERING
  renderFoods(foods, eatFoodCallback) {
    const container = document.getElementById("foodsList");

    if (foods.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <p>Noch keine Gerichte hinzugefügt.<br>Füge dein erstes Lieblingsgericht hinzu! 😊</p>
                </div>
            `;
      return;
    }

    container.innerHTML = foods
      .map(
        (food) => `
            <div class="food-item">
                <span class="food-name">${food.name}</span>
                <button class="eaten-btn" onclick="window.eatFood('${food.name}')">
                    Gegessen ✓
                </button>
            </div>
        `
      )
      .join("");
  }
  //#endregion

  //#region  📅 HISTORY RENDERING
  renderHistory(history, deleteCallback) {
    const container = document.getElementById("historyList");
    const dateDisplay = document.getElementById("currentDate");
    const nextBtn = document.getElementById("nextBtn");

    const today = new Date();
    const viewDate = this.currentViewDate.toDateString();
    const todayString = today.toDateString();

    // Update date display
    let dateLabel;
    if (viewDate === todayString) {
      dateLabel = "Heute";
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (viewDate === yesterday.toDateString()) {
        dateLabel = "Gestern";
      } else {
        dateLabel = this.currentViewDate.toLocaleDateString("de-DE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    }

    dateDisplay.textContent = dateLabel;
    nextBtn.disabled = viewDate === todayString;

    // Filter history for current view date
    const viewDateString = this.currentViewDate.toDateString();
    const dayHistory = history.filter((item) => {
      const itemDate = new Date(item.timestamp).toDateString();
      return itemDate === viewDateString;
    });

    if (dayHistory.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <p>An diesem Tag nichts gegessen geloggt 🤔</p>
                </div>
            `;
      return;
    }

    // Sort by timestamp (newest first)
    dayHistory.sort((a, b) => b.timestamp - a.timestamp);

    container.innerHTML = dayHistory
      .map(
        (item) => `
            <div class="history-item">
                <div class="history-content">
                    <div class="history-food">${item.food}</div>
                    <div class="history-time">${item.time}</div>
                </div>
                <button class="delete-btn" onclick="window.deleteHistoryItem('${item.id}')">
                    🗑️
                </button>
            </div>
        `
      )
      .join("");
  }
  //#endregion

  // #region 📊 STATISTICS RENDERING
  renderStats(history) {

    // Unique days tracked
    const uniqueDays = new Set(
      history.map((item) => new Date(item.timestamp).toDateString())
    );
    document.getElementById("daysTracked").textContent = uniqueDays.size;

    // Top foods
    const foodCounts = {};
    history.forEach((item) => {
      foodCounts[item.food] = (foodCounts[item.food] || 0) + 1;
    });

    const sortedFoods = Object.entries(foodCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const topFoodsContainer = document.getElementById("topFoods");

    if (sortedFoods.length === 0) {
      topFoodsContainer.innerHTML = `
                <div class="empty-state">
                    <p>Noch keine Daten vorhanden</p>
                </div>
            `;
      return;
    }

    topFoodsContainer.innerHTML = sortedFoods
      .map(
        ([food, count], index) => `
            <div class="history-item">
                <div class="history-content">
                    <div class="history-food">${index + 1}. ${food}</div>
                    <div class="history-time">${count}x gegessen</div>
                </div>
            </div>
        `
      )
      .join("");
  }
  //#endregion

  //#region DATE NAVIGATION
  changeDate(direction) {
    const newDate = new Date(this.currentViewDate);
    newDate.setDate(newDate.getDate() + direction);
    this.currentViewDate = newDate;
    return this.currentViewDate;
  }

  jumpToDate(daysOffset) {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysOffset);
    this.currentViewDate = newDate;
    return this.currentViewDate;
  }

  getCurrentViewDate() {
    return this.currentViewDate;
  }
  //#endregion

  // #region 🔧 UTILITY METHODS
  clearInput() {
    const input = document.getElementById("newFood");
    input.value = "";
  }

  getInputValue() {
    const input = document.getElementById("newFood");
    return input.value.trim();
  }

  focusInput() {
    const input = document.getElementById("newFood");
    input.focus();
  }
}
//#endregion

export default UIComponents;
