export const HistoryRenderHelpers = {
  getDateLabel(viewDate, today) {
    const viewDateStr = viewDate.toDateString();

    if (viewDateStr === today.toDateString()) return "Heute";
    if (viewDateStr === this._getYesterday(today).toDateString())
      return "Gestern";

    return this._formatDate(viewDate);
  },

  getDisplayName(item, category) {
    return category === "drinks"
      ? this._formatDrinkName(item)
      : this._formatFoodName(item);
  },

  getAmountDisplay(item, category) {
    return category === "drinks"
      ? this._getDrinksAmountDisplay(item)
      : this._getFoodAmountDisplay(item);
  },

  // #region Helpers

  _getYesterday(today) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  },

  _formatDate(date) {
    return date.toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  _formatDrinkName(item) {
    if (item.quantity && item.liters)
      return `${item.quantity} x ${item.food} (${item.liters}L)`;
    if (item.liters) return `${item.food} (${item.liters}L)`;
    if (item.quantity) return `${item.quantity} x ${item.food}`;
    return item.food;
  },

  _formatFoodName(item) {
    if (item.quantity && item.grams)
      return `${item.quantity} x ${item.food} (${item.grams}g)`;
    if (item.grams) return `${item.food} (${item.grams}g)`;
    if (item.quantity) return `${item.quantity} x ${item.food}`;
    return item.food;
  },

  _getDrinksAmountDisplay(item) {
    return `
      ${this._createAmountHtml(item.id, item.liters, "liters", "L")}
      ${this._createAmountHtml(item.id, item.quantity, "quantity", "x")}
    `;
  },

  _getFoodAmountDisplay(item) {
    return `
      ${this._createAmountHtml(item.id, item.grams, "grams", "g")}
      ${this._createAmountHtml(item.id, item.quantity, "quantity", "x")}
    `;
  },

  _createAmountHtml(id, amount, type, unit) {
    return `
      <div class="history-amount" 
           id="history-amount-${type}-${id}" 
           data-dblclick="edit-history-amount" 
           data-id="${id}" 
           data-amount="${amount || 0}" 
           data-type="${type}"
           title="Doppelklick zum Bearbeiten">${amount || 0}${unit}</div>
    `;
  },
  // #endregion
};
