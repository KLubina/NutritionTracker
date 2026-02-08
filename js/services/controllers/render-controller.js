import * as FoodsService from "../data/foods.js";
import * as HistoryService from "../data/history.js";
import { renderHistory, renderFoods } from "../../ui/ui.js";

export class RenderController {
  constructor(foodController, historyController, goennungController) {
    this.foodController = foodController;
    this.historyController = historyController;
    this.goennungController = goennungController;
  }

  handleDataSync(dataType, data) {
    if (dataType === "foods") {
      this._handleFoodSync();
    } else if (dataType === "history") {
      this._handleHistorySync(data);
    }
    this.goennungController.updateMoveButtonsVisibility();
  }

  renderAllFoods(historyData = null) {
    const history = historyData || HistoryService.getHistory();
    this._renderCategories(history);
  }

  // #region Helpers

  _handleFoodSync() {
    this.renderAllFoods();
  }

  _handleHistorySync(data) {
    renderHistory(
      data,
      this.historyController.deleteHistoryItem.bind(this.historyController),
    );
    this.renderAllFoods(data);
  }

  _renderCategories(history) {
    const categories = ["normal", "goennung", "drinks"];
    categories.forEach((category) => {
      this._renderCategory(category, history);
    });
  }

  _renderCategory(category, history) {
    const foods = FoodsService.getFoods(category);
    renderFoods(
      foods,
      history,
      this.foodController.eatFood.bind(this.foodController),
      category,
    );
  }
  // #endregion
}
