export class GoennungController {
  constructor() {
    // Bind methods to ensure 'this' context is preserved
    this.toggleGoennung = this.toggleGoennung.bind(this);
  }

  init() {
    this._setupToggleListener();
    this._applyInitialState();
    this.updateMoveButtonsVisibility();
  }

  toggleGoennung(e) {
    const isChecked = this._getCheckboxState();
    this._setGoennungVisibility(isChecked);
    localStorage.setItem("goennungVisible", isChecked.toString());
  }

  showGoennung() {
    this._setGoennungVisibility(true);
  }

  hideGoennung() {
    this._setGoennungVisibility(false);
  }

  updateMoveButtonsVisibility() {
    const isVisible = localStorage.getItem("goennungVisible") === "true";
    this._toggleMoveButtons(isVisible);
  }

  // #region Helpers

  _setupToggleListener() {
    const checkbox = document.getElementById("goennungToggle");
    if (checkbox) {
      checkbox.addEventListener("change", this.toggleGoennung);
    }
  }

  _applyInitialState() {
    const isVisible = localStorage.getItem("goennungVisible") === "true";
    const checkbox = document.getElementById("goennungToggle");

    if (checkbox) checkbox.checked = isVisible;
    this._setGoennungVisibility(isVisible);
  }

  _getCheckboxState() {
    const checkbox = document.getElementById("goennungToggle");
    return checkbox ? checkbox.checked : false;
  }

  _setGoennungVisibility(isVisible) {
    this._toggleTabVisibility(isVisible);
    this._toggleMoveButtons(isVisible);
  }

  _toggleTabVisibility(isVisible) {
    const goennungTab = document.querySelector('.tab[data-tab="goennung"]');
    const goennungContent = document.getElementById("goennung-tab");

    if (isVisible) {
      if (goennungTab) goennungTab.classList.remove("goennung-hidden");
      if (goennungContent) goennungContent.classList.remove("goennung-hidden");
    } else {
      if (goennungTab) goennungTab.classList.add("goennung-hidden");
      if (goennungContent) goennungContent.classList.add("goennung-hidden");
    }
  }

  _toggleMoveButtons(isVisible) {
    const moveButtons = document.querySelectorAll(".move-to-goennung");
    moveButtons.forEach((btn) => {
      isVisible
        ? btn.classList.remove("move-btn-hidden")
        : btn.classList.add("move-btn-hidden");
    });
  }
  // #endregion
}
