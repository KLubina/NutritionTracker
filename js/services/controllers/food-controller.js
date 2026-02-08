import * as FoodsService from "../data/foods.js";
import * as HistoryService from "../data/history.js";
import {
  getInputValue,
  clearInput,
  getGoennungInputValue,
  clearGoennungInput,
  getDrinkInputValue,
  clearDrinkInput,
} from "../../ui/ui.js";

export class FoodController {
  addFood() {
    this._addFoodItem(getInputValue, clearInput, "normal");
  }

  addGoennungFood() {
    this._addFoodItem(getGoennungInputValue, clearGoennungInput, "goennung");
  }

  addDrinkFood() {
    this._addFoodItem(getDrinkInputValue, clearDrinkInput, "drinks");
  }

  editFood(foodId, newName) {
    FoodsService.updateFood(foodId, newName);
  }

  deleteFood(foodId) {
    FoodsService.deleteFood(foodId);
  }

  moveFoodToCategory(foodId, newCategory) {
    FoodsService.moveFoodToCategory(foodId, newCategory);
  }

  updateFoodGrams(foodId, grams) {
    const gramsValue = this._parseValue(grams, true);
    FoodsService.updateFoodGrams(foodId, gramsValue);
  }

  updateFoodLiters(foodId, liters) {
    const litersValue = this._parseValue(liters, false);
    FoodsService.updateFoodLiters(foodId, litersValue);
  }

  updateFoodQuantity(foodId, quantity) {
    const quantityValue = this._parseValue(quantity, true);
    FoodsService.updateFoodQuantity(foodId, quantityValue);
  }

  eatFood(foodId) {
    const food = FoodsService.getFoodById(foodId);
    if (!food) return;
    HistoryService.addHistory(food);
  }

  // #region Helpers

  _addFoodItem(getValueFn, clearFn, type) {
    const foodName = getValueFn();
    if (foodName) {
      clearFn();
      FoodsService.addFood(foodName, type);
    }
  }

  _parseValue(value, isInt) {
    if (!value) return null;
    return isInt ? parseInt(value, 10) : parseFloat(value);
  }
  // #endregion
}
