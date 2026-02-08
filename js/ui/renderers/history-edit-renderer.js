export const HistoryEditHelpers = {
  startEditHistoryDate(historyId, currentTimestamp, isDateAllowedCallback) {
    const timeElement = document.getElementById(`history-time-${historyId}`);
    if (!timeElement) return;

    const originalText = timeElement.textContent;
    const input = this._createDateInput(currentTimestamp);

    this._setupEditListeners(
      input,
      timeElement,
      originalText,
      () => {
        this._handleDateSave(input, historyId, isDateAllowedCallback, () =>
          this._cancelEdit(timeElement, originalText, input),
        );
      },
      () => this._cancelEdit(timeElement, originalText, input),
    );

    this._replaceElementWithInput(timeElement, input);
  },

  startEditHistoryAmount(historyId, currentAmount, type) {
    const amountElement = document.getElementById(
      `history-amount-${type}-${historyId}`,
    );
    if (!amountElement) return;

    const originalText = amountElement.textContent;
    const input = this._createAmountInput(currentAmount, type);

    this._setupEditListeners(
      input,
      amountElement,
      originalText,
      () => {
        this._handleAmountSave(input, historyId, type, currentAmount, () =>
          this._cancelEdit(amountElement, originalText, input),
        );
      },
      () => this._cancelEdit(amountElement, originalText, input),
    );

    this._replaceElementWithInput(amountElement, input);
  },

  // #region Helpers

  _createDateInput(timestamp) {
    const input = document.createElement("input");
    input.type = "datetime-local";
    input.className = "history-date-input";
    input.value = this._formatForDatetimeLocal(new Date(timestamp));
    return input;
  },

  _formatForDatetimeLocal(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d}T${hh}:${mm}`;
  },

  _createAmountInput(currentAmount, type) {
    const input = document.createElement("input");
    input.type = "number";
    input.className = "history-amount-input";
    input.value = currentAmount || "";

    const config = this._getAmountInputConfig(type);
    input.placeholder = config.placeholder;
    input.step = config.step;
    input.min = config.min;

    return input;
  },

  _getAmountInputConfig(type) {
    if (type === "liters")
      return { placeholder: "z.B. 0.5", step: "0.1", min: "0" };
    if (type === "quantity")
      return { placeholder: "z.B. 4", step: "1", min: "1" };
    return { placeholder: "z.B. 250", step: "1", min: "0" };
  },

  _setupEditListeners(input, originalElement, originalText, onSave, onCancel) {
    const onBlur = () => onSave();
    const onKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onSave();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };

    input.addEventListener("blur", onBlur);
    input.addEventListener("keydown", onKeyDown);

    // Store cleanup function on input for easy access if needed (optional pattern)
    input.cleanup = () => {
      input.removeEventListener("blur", onBlur);
      input.removeEventListener("keydown", onKeyDown);
      input.remove();
    };
  },

  _handleDateSave(input, historyId, isDateAllowedCallback, onFail) {
    const selected = input.value;
    if (!selected) return onFail();

    const newDate = new Date(selected);
    if (isDateAllowedCallback && !isDateAllowedCallback(newDate)) {
      alert("Datum liegt außerhalb des erlaubten Bereichs (letzte 90 Tage).");
      return onFail();
    }

    if (window.editHistoryDate)
      window.editHistoryDate(historyId, newDate.getTime());
    input.cleanup();
  },

  _handleAmountSave(input, historyId, type, currentAmount, onFail) {
    const newAmount = input.value.trim();
    if (newAmount && parseFloat(newAmount) !== currentAmount) {
      if (window.updateHistoryAmount)
        window.updateHistoryAmount(historyId, newAmount, type);
    } else {
      return onFail();
    }
    input.cleanup();
  },

  _cancelEdit(element, originalText, input) {
    element.textContent = originalText;
    element.style.display = "inline";
    if (input.cleanup) input.cleanup();
    else input.remove();
  },

  _replaceElementWithInput(element, input) {
    element.style.display = "none";
    element.parentNode.insertBefore(input, element);
    input.focus();
    if (input.type === "number") input.select();
  },
  // #endregion
};
