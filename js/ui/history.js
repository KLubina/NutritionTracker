import { HistoryRenderHelpers } from './renderers/history-renderer.js';
import { HistoryEditHelpers } from './renderers/history-edit-renderer.js';
import { StatsRenderHelpers } from './renderers/stats-renderer.js';
import { getCurrentViewDate, isDateAllowed } from './dates.js';

export function renderHistory(history, deleteCallback) {
  _updateHistoryHeader();
  _updateNavigationButtons();

  const container = document.getElementById("historyList");
  if (!container) return;

  const dayHistory = _getDayHistory(history);
  if (dayHistory.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>An diesem Tag nichts gegessen geloggt 🤔</p></div>`;
    return;
  }

  container.innerHTML = dayHistory
    .map((item) => _createHistoryItemHTML(item))
    .join("");
}

export function startEditHistoryDate(historyId, currentTimestamp) {
  HistoryEditHelpers.startEditHistoryDate(historyId, currentTimestamp, (date) => isDateAllowed(date));
}

export function startEditHistoryAmount(historyId, currentAmount, type) {
  HistoryEditHelpers.startEditHistoryAmount(historyId, currentAmount, type);
}

export function renderStats(history) {
  StatsRenderHelpers.renderStats(history);
}

// #region Helpers

function _updateHistoryHeader() {
  const dateDisplay = document.getElementById("currentDate");
  const today = new Date();
  if (dateDisplay) {
    dateDisplay.textContent = HistoryRenderHelpers.getDateLabel(getCurrentViewDate(), today);
  }
}

function _updateNavigationButtons() {
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const today = new Date();
  const viewDate = getCurrentViewDate();

  if (nextBtn) {
    nextBtn.disabled = viewDate.toDateString() === today.toDateString();
  }

  const oneDayBack = new Date(viewDate);
  oneDayBack.setDate(oneDayBack.getDate() - 1);

  if (prevBtn) {
    prevBtn.disabled = !isDateAllowed(oneDayBack);
  }
}

function _getDayHistory(history) {
  const viewDateString = getCurrentViewDate().toDateString();
  return history
    .filter((item) => new Date(item.timestamp).toDateString() === viewDateString)
    .sort((a, b) => b.timestamp - a.timestamp);
}

function _createHistoryItemHTML(item) {
  const category = item.category || 'normal';
  const displayName = HistoryRenderHelpers.getDisplayName(item, category);
  const amountDisplay = HistoryRenderHelpers.getAmountDisplay(item, category);

  return `
    <div class="history-item" data-history-id="${item.id}">
        <div class="history-content">
            <div class="history-food">${displayName}</div>
            <div class="history-meta">
                ${amountDisplay}
                <div class="history-time"
                     id="history-time-${item.id}"
                     data-dblclick="edit-history-date"
                     data-id="${item.id}"
                     data-timestamp="${item.timestamp}">${item.time}</div>
            </div>
        </div>
        <button class="delete-btn" data-action="delete-history" data-id="${item.id}">
            🗑️
        </button>
    </div>
  `;
}
// #endregion