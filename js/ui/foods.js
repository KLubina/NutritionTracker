import { FoodRenderHelpers } from "./renderers/food-renderer.js";

export function renderFoods(
  foods,
  history,
  eatFoodCallback,
  category = "normal",
) {
  const container = _getContainer(category);
  if (!container) return;

  if (foods.length === 0) {
    _renderEmptyState(container, category);
    return;
  }

  _renderFoodList(container, foods, category, history);
}

export function isFoodEatenInLast90Days(foodName, history) {
  const cutoff = _getCutoffTimestamp();
  return history.some(
    (item) => item.food === foodName && item.timestamp >= cutoff,
  );
}

export function toggleFoodDetails(foodId) {
  const { details, btn } = _getDetailsElements(foodId);
  if (!details || !btn) return;
  _toggleDetailsDisplay(details, btn);
}

export function startEditFood(foodId, currentName, onSaveCallback) {
  const foodElement = _getFoodNameElement(foodId);
  if (!foodElement) return;

  const input = _createEditInput(currentName);
  _setupEditListeners(input, foodElement, currentName, onSaveCallback, foodId);
  _replaceWithInput(foodElement, input);
}

// --- Helpers ---

function _getContainer(category) {
  const id = FoodRenderHelpers.getContainerId(category);
  return document.getElementById(id);
}

function _renderEmptyState(container, category) {
  const { message, action } = FoodRenderHelpers.getEmptyState(category);
  container.innerHTML = `
    <div class="empty-state">
        <p>Noch keine ${message} hinzugefügt.<br>Füge dein${action} hinzu! 😊</p>
    </div>`;
}

function _renderFoodList(container, foods, category, history) {
  container.innerHTML = foods
    .map((food) => _createFoodItemHTML(food, category, history))
    .join("");
}

function _createFoodItemHTML(food, category, history) {
  const canDelete = !isFoodEatenInLast90Days(food.name, history);
  const buttons = FoodRenderHelpers.getMoveButtons(category);
  const displayName = FoodRenderHelpers.getDisplayName(food, category);
  const detailsInput = FoodRenderHelpers.getDetailsInput(food, category);

  return `
    <div class="food-item-wrapper">
        <div class="food-item">
            ${_renderExpandBtn(food.id)}
            ${_renderName(food, displayName)}
            ${_renderActions(food, buttons, canDelete)}
        </div>
        <div class="food-details" id="food-details-${food.id}" style="display: none;">
            ${detailsInput}
        </div>
    </div>`;
}

function _renderExpandBtn(id) {
  return `<button class="expand-btn" data-action="toggle-details" data-id="${id}" title="Details anzeigen/verbergen">▶</button>`;
}

function _renderName(food, displayName) {
  return `<span class="food-name" data-dblclick="edit-food-name" data-id="${food.id}" data-name="${food.name.replace(/"/g, "&quot;")}" title="Doppelklick zum Bearbeiten">${displayName}</span>`;
}

function _renderActions(food, buttons, canDelete) {
  return `
    <div class="food-actions">
        <button class="eaten-btn" data-action="eat-food" data-id="${food.id}">Gegessen ✓</button>
        <button class="move-btn ${buttons.btn1.class}" data-action="move-food" data-id="${food.id}" data-target-category="${buttons.btn1.category}" title="${buttons.btn1.title}">${buttons.btn1.emoji}</button>
        <button class="move-btn ${buttons.btn2.class}" data-action="move-food" data-id="${food.id}" data-target-category="${buttons.btn2.category}" title="${buttons.btn2.title}">${buttons.btn2.emoji}</button>
        <button class="delete-btn" data-action="delete-food" data-id="${food.id}" ${canDelete ? "" : "disabled"} title="${canDelete ? "Löschen" : "In den letzten 90 Tagen gegessen"}">🗑️</button>
    </div>`;
}

function _getCutoffTimestamp() {
  const d = new Date();
  d.setDate(d.getDate() - 90);
  return d.getTime();
}

function _getDetailsElements(foodId) {
  return {
    details: document.getElementById(`food-details-${foodId}`),
    btn: document.querySelector(
      `button[data-action="toggle-details"][data-id="${foodId}"]`,
    ),
  };
}

function _toggleDetailsDisplay(details, btn) {
  const isHidden = details.style.display === "none";
  details.style.display = isHidden ? "block" : "none";
  btn.textContent = isHidden ? "▼" : "▶";
}

function _getFoodNameElement(foodId) {
  return (
    document.querySelector(`[ondblclick*="${foodId}"]`) ||
    document.querySelector(
      `span[data-id="${foodId}"][data-dblclick="edit-food-name"]`,
    )
  );
}

function _createEditInput(value) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  input.className = "food-edit-input";
  return input;
}

function _setupEditListeners(input, originalEl, originalText, callback, id) {
  const restore = () => {
    originalEl.textContent = originalText;
    originalEl.style.display = "inline";
    input.remove();
  };

  const save = () => {
    const val = input.value.trim();
    if (val && val !== originalText) {
      if (callback) callback(id, val);
      else if (window.editFood) window.editFood(id, val);
    } else {
      restore();
    }
    if (val && val !== originalText) input.remove();
  };

  input.addEventListener("blur", save);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      restore();
    }
  });
}

function _replaceWithInput(original, input) {
  original.style.display = "none";
  original.parentNode.insertBefore(input, original);
  input.focus();
  input.select();
}
