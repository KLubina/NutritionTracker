export const FoodRenderHelpers = {
  getContainerId(category) {
    const containers = {
      goennung: "goennungFoodsList",
      drinks: "drinksFoodsList",
    };
    return containers[category] || "foodsList";
  },

  getEmptyState(category) {
    const states = {
      goennung: { message: "Gönnungen", action: "e erste Gönnung" },
      drinks: { message: "Drinks", action: "en ersten Drink" },
    };
    return (
      states[category] || {
        message: "Gerichte",
        action: " erstes Lieblingsgericht",
      }
    );
  },

  getMoveButtons(category) {
    const configs = {
      normal: this._getNormalButtons(),
      goennung: this._getGoennungButtons(),
      drinks: this._getDrinksButtons(),
    };
    return configs[category] || this._getNormalButtons();
  },

  getDisplayName(food, category) {
    return category === "drinks"
      ? this._formatDrinkName(food)
      : this._formatFoodName(food);
  },

  getDetailsInput(food, category) {
    const quantityInput = this._getQuantityInput(food);
    const unitInput =
      category === "drinks"
        ? this._getLitersInput(food)
        : this._getGramsInput(food);

    return category === "drinks"
      ? `${unitInput}${quantityInput}`
      : `${unitInput}${quantityInput}`;
  },

  // #region Helpers

  _getNormalButtons() {
    return {
      btn1: this._createBtn(
        "goennung",
        "🎉",
        "Zu Gönnung verschieben",
        "move-to-goennung",
      ),
      btn2: this._createBtn("drinks", "🥤", "Zu Drinks verschieben", ""),
    };
  },

  _getGoennungButtons() {
    return {
      btn1: this._createBtn("normal", "🥘", "Zu Hinzufügen verschieben", ""),
      btn2: this._createBtn("drinks", "🥤", "Zu Drinks verschieben", ""),
    };
  },

  _getDrinksButtons() {
    return {
      btn1: this._createBtn("normal", "🥘", "Zu Hinzufügen verschieben", ""),
      btn2: this._createBtn(
        "goennung",
        "🎉",
        "Zu Gönnung verschieben",
        "move-to-goennung",
      ),
    };
  },

  _createBtn(category, emoji, title, className) {
    return { category, emoji, title, class: className };
  },

  _formatDrinkName(food) {
    if (food.quantity && food.liters)
      return `${food.quantity} x ${food.name} (${food.liters}L)`;
    if (food.liters) return `${food.name} (${food.liters}L)`;
    if (food.quantity) return `${food.quantity} x ${food.name}`;
    return food.name;
  },

  _formatFoodName(food) {
    if (food.quantity && food.grams)
      return `${food.quantity} x ${food.name} (${food.grams}g)`;
    if (food.grams) return `${food.name} (${food.grams}g)`;
    if (food.quantity) return `${food.quantity} x ${food.name}`;
    return food.name;
  },

  _getQuantityInput(food) {
    return this._createInputHTML(
      `quantity-${food.id}`,
      "Quantität:",
      "grams-input",
      food.quantity,
      "z.B. 4",
      "1",
      "",
      "update-quantity",
      food.id,
    );
  },

  _getLitersInput(food) {
    return this._createInputHTML(
      `liters-${food.id}`,
      "Liter:",
      "grams-input",
      food.liters,
      "z.B. 0.5",
      "0",
      "0.1",
      "update-liters",
      food.id,
      "L",
    );
  },

  _getGramsInput(food) {
    return this._createInputHTML(
      `grams-${food.id}`,
      "Gramm:",
      "grams-input",
      food.grams,
      "z.B. 250",
      "0",
      "",
      "update-grams",
      food.id,
      "g",
    );
  },

  _createInputHTML(
    id,
    label,
    className,
    value,
    placeholder,
    min,
    step,
    changeAction,
    dataId,
    unit = "",
  ) {
    const stepAttr = step ? `step="${step}"` : "";
    const unitSpan = unit ? `<span class="grams-unit">${unit}</span>` : "";

    return `
      <div class="grams-input-container">
          <label for="${id}">${label}</label>
          <input
              type="number"
              id="${id}"
              class="${className}"
              value="${value || ""}"
              placeholder="${placeholder}"
              min="${min}"
              ${stepAttr}
              data-change="${changeAction}"
              data-id="${dataId}"
          />
          ${unitSpan}
      </div>
    `;
  },
  // #endregion
};
