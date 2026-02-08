import * as HistoryService from "../data/history.js";
import { ExportService } from "../export-service.js";
import {
  changeDate as uiChangeDate,
  jumpToDate as uiJumpToDate,
  isDateAllowed,
  getMinAllowedDate,
  setCurrentViewDate,
  renderHistory,
} from "../../ui/ui.js";

export class HistoryController {
  deleteHistoryItem(historyId) {
    HistoryService.deleteHistory(historyId);
  }

  editHistoryDate(historyId, newTimestamp) {
    if (!this._validateDate(newTimestamp)) return;
    HistoryService.updateHistory(historyId, newTimestamp);
  }

  updateHistoryAmount(historyId, amount, type) {
    const amountValue = this._parseAmount(amount, type);
    HistoryService.updateHistoryAmount(historyId, amountValue, type);
  }

  changeDate(direction) {
    uiChangeDate(direction);
    this._renderHistory();
  }

  jumpToDate(daysOffset) {
    const targetDate = this._calculateTargetDate(daysOffset);
    this._handleDateSelection(targetDate, daysOffset);
    this._renderHistory();
  }

  exportToCsv() {
    ExportService.exportHistoryToCsv(HistoryService.getHistory());
  }

  // #region Helpers

  _validateDate(timestamp) {
    if (isDateAllowed(new Date(timestamp))) return true;
    alert("Datum liegt außerhalb des erlaubten Bereichs (letzte 90 Tage).");
    return false;
  }

  _parseAmount(amount, type) {
    if (!amount) return null;
    return type === "grams" ? parseInt(amount, 10) : parseFloat(amount);
  }

  _renderHistory() {
    renderHistory(
      HistoryService.getHistory(),
      this.deleteHistoryItem.bind(this),
    );
  }

  _calculateTargetDate(offset) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date;
  }

  _handleDateSelection(targetDate, offset) {
    if (!isDateAllowed(targetDate)) {
      setCurrentViewDate(getMinAllowedDate());
    } else {
      uiJumpToDate(offset);
    }
  }
  // #endregion
}
