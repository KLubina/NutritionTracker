import {
  toggleFoodDetails,
  startEditFood,
  startEditHistoryDate,
  startEditHistoryAmount,
  focusInput,
} from "../../ui/ui.js";

export class EventHandler {
  constructor(app, foodController, historyController, goennungController) {
    this.app = app;
    this.foodController = foodController;
    this.historyController = historyController;
    this.goennungController = goennungController;
  }

  setupEventListeners() {
    this.setupKeyboardListeners();
    this.setupEventDelegation();
  }

  setupKeyboardListeners() {
    this._setupAddButtons();
    this._setupInputListeners();
    setTimeout(() => focusInput(), 100);
  }

  setupEventDelegation() {
    const appContainer = document.getElementById("appContainer");
    if (!appContainer) return;

    appContainer.addEventListener("click", (e) => this.handleClick(e));
    appContainer.addEventListener("dblclick", (e) => this.handleDblClick(e));
    appContainer.addEventListener("change", (e) => this.handleChange(e));

    this._exposeGlobals();
  }

  handleClick(e) {
    const target = e.target.closest("[data-action]");
    if (!target) return;
    this._processAction(target.dataset.action, target);
  }

  handleDblClick(e) {
    const target = e.target.closest("[data-dblclick]");
    if (!target) return;
    this._processDblClick(target.dataset.dblclick, target);
  }

  handleChange(e) {
    const target = e.target.closest("[data-change]");
    if (!target) return;
    this._processChange(target.dataset.change, target);
  }

  // --- Helpers ---

  _setupAddButtons() {
    this._bindClick("addBtn", () => this.foodController.addFood());
    this._bindClick("addGoennungBtn", () =>
      this.foodController.addGoennungFood(),
    );
    this._bindClick("addDrinkBtn", () => this.foodController.addDrinkFood());
  }

  _setupInputListeners() {
    this.setupEnterKey("newFood", () => this.foodController.addFood());
    this.setupEnterKey("newGoennungFood", () =>
      this.foodController.addGoennungFood(),
    );
    this.setupEnterKey("newDrinkFood", () =>
      this.foodController.addDrinkFood(),
    );
  }

  setupEnterKey(elementId, callback) {
    document.getElementById(elementId)?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") callback();
    });
  }

  _bindClick(id, handler) {
    document.getElementById(id)?.addEventListener("click", handler);
  }

  _exposeGlobals() {
    window.exportToCsv = () => this.historyController.exportToCsv();
    window.editHistoryDate = (historyId, newTimestamp) =>
      this.historyController.editHistoryDate(historyId, newTimestamp);
    window.updateHistoryAmount = (historyId, amount, type) =>
      this.historyController.updateHistoryAmount(historyId, amount, type);
  }

  _processAction(action, target) {
    const id = target.dataset.id;
    const actions = {
      "switch-tab": () => this.app.switchTab(target.dataset.tab),
      "toggle-details": () => toggleFoodDetails(id),
      "eat-food": () => this.foodController.eatFood(id),
      "move-food": () =>
        this.foodController.moveFoodToCategory(
          id,
          target.dataset.targetCategory,
        ),
      "delete-history": () => this.historyController.deleteHistoryItem(id),
      "change-date": () =>
        this.historyController.changeDate(parseInt(target.dataset.direction)),
      "jump-to-date": () =>
        this.historyController.jumpToDate(parseInt(target.dataset.offset)),
      "export-csv": () => this.historyController.exportToCsv(),
      "delete-food": () => this.foodController.deleteFood(id),
    };

    if (actions[action]) actions[action]();
  }

  _processDblClick(action, target) {
    const id = target.dataset.id;
    const actions = {
      "edit-food-name": () =>
        startEditFood(id, target.dataset.name, (newId, newName) =>
          this.foodController.editFood(newId, newName),
        ),
      "edit-history-date": () =>
        startEditHistoryDate(id, parseInt(target.dataset.timestamp)),
      "edit-history-amount": () =>
        startEditHistoryAmount(
          id,
          parseFloat(target.dataset.amount),
          target.dataset.type,
        ),
    };

    if (actions[action]) actions[action]();
  }

  _processChange(action, target) {
    const id = target.dataset.id;
    const value = target.value;
    const actions = {
      "update-quantity": () =>
        this.foodController.updateFoodQuantity(id, value),
      "update-grams": () => this.foodController.updateFoodGrams(id, value),
      "update-liters": () => this.foodController.updateFoodLiters(id, value),
    };

    if (actions[action]) actions[action]();
  }
}
