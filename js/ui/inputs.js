export function clearInput() {
  _setInput("newFood", "");
}

export function getInputValue() {
  return _getInput("newFood");
}

export function focusInput() {
  _focusInput("newFood");
}

export function clearGoennungInput() {
  _setInput("newGoennungFood", "");
}

export function getGoennungInputValue() {
  return _getInput("newGoennungFood");
}

export function focusGoennungInput() {
  _focusInput("newGoennungFood");
}

export function clearDrinkInput() {
  _setInput("newDrinkFood", "");
}

export function getDrinkInputValue() {
  return _getInput("newDrinkFood");
}

export function focusDrinkInput() {
  _focusInput("newDrinkFood");
}

// #region Helpers

function _setInput(id, value) {
  const input = document.getElementById(id);
  if (input) input.value = value;
}

function _getInput(id) {
  const input = document.getElementById(id);
  return input ? input.value.trim() : "";
}

function _focusInput(id) {
  const input = document.getElementById(id);
  if (input) input.focus();
}
// #endregion
