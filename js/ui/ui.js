// --- Re-exports: Dates ---
export {
  getMinAllowedDate,
  isDateAllowed,
  changeDate,
  jumpToDate,
  getCurrentViewDate,
  setCurrentViewDate,
} from "./dates.js";

// --- Re-exports: Inputs ---
export {
  clearInput,
  getInputValue,
  focusInput,
  clearGoennungInput,
  getGoennungInputValue,
  focusGoennungInput,
  clearDrinkInput,
  getDrinkInputValue,
  focusDrinkInput,
} from "./inputs.js";

// --- Re-exports: Foods ---
export {
  renderFoods,
  isFoodEatenInLast90Days,
  toggleFoodDetails,
  startEditFood,
} from "./foods.js";

// --- Re-exports: History ---
export {
  renderHistory,
  startEditHistoryDate,
  startEditHistoryAmount,
  renderStats,
} from "./history.js";

// --- Tab & Banner ---

export function switchTab(tabName) {
  _deactivateTabs();
  _activateTab(tabName);
}

export function showPlannedDay(templateName, templateColor) {
  _removeExistingBanner();
  _createBanner(templateName, templateColor);
}

// #region Helpers

function _deactivateTabs() {
  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));
}

function _activateTab(tabName) {
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");
  document.getElementById(`${tabName}-tab`).classList.add("active");
}

function _removeExistingBanner() {
  const existingBanner = document.getElementById("plannedDayBanner");
  if (existingBanner) existingBanner.remove();
}

function _createBanner(templateName, templateColor) {
  const header = document.querySelector(".header");
  if (!header) return;

  const banner = document.createElement("div");
  banner.id = "plannedDayBanner";
  banner.textContent = `📋 Heute: ${templateName}`;

  _styleBanner(banner, templateColor);
  header.insertAdjacentElement("afterend", banner);
}

function _styleBanner(banner, templateColor) {
  const backgroundColor = templateColor || "#48bb78";
  banner.style.cssText = `
    background: ${backgroundColor};
    color: white;
    padding: 12px 20px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  `;
}
// #endregion
