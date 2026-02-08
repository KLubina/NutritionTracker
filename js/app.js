import * as FoodsService from "./services/data/foods.js";
import * as HistoryService from "./services/data/history.js";
import * as PlannerService from "./services/data/planner.js";
import * as UI from "./ui/ui.js";
import * as AuthService from "./services/auth.js";
import { GoennungController } from "./services/controllers/goennung-controller.js";
import { FoodController } from "./services/controllers/food-controller.js";
import { HistoryController } from "./services/controllers/history-controller.js";
import { RenderController } from "./services/controllers/render-controller.js";
import { EventHandler } from "./services/handlers/event-handler.js";

// -- State & Modules --
let isInitialized = false;

// Controllers
const goennungController = new GoennungController();
const foodController = new FoodController();
const historyController = new HistoryController();

// Render Controller
const renderController = new RenderController(
  foodController,
  historyController,
  goennungController,
);

// Event Handler
// EventHandler erwartet als erstes Argument das "App"-Objekt,
// hauptsächlich um 'switchTab' aufzurufen.
const appInterface = { switchTab };

const eventHandler = new EventHandler(
  appInterface,
  foodController,
  historyController,
  goennungController,
);

// -- Functions --

async function init() {
  AuthService.onAuthChanged(_handleAuthChange);
  _setupLoginButton();
}

async function _handleAuthChange(user) {
  if (user) {
    _showApp();
    await _initializeAppData();
  } else {
    _showLogin();
  }
}

function _showApp() {
  _toggleView(true);
}

function _showLogin() {
  _toggleView(false);
}

function _toggleView(showApp) {
  const loginScreen = document.getElementById("loginScreen");
  const appContainer = document.getElementById("appContainer");
  if (loginScreen) loginScreen.style.display = showApp ? "none" : "flex";
  if (appContainer) appContainer.style.display = showApp ? "block" : "none";
}

async function _initializeAppData() {
  if (isInitialized) return;

  eventHandler.setupEventListeners();
  setupCleanup();
  goennungController.init();
  _initServices();

  await loadAndShowTodayPlan();
  isInitialized = true;
}

function _initServices() {
  FoodsService.init(renderController.handleDataSync.bind(renderController));
  HistoryService.init(renderController.handleDataSync.bind(renderController));
}

function _setupLoginButton() {
  const loginBtn = document.getElementById("googleLoginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", _handleLoginClick);
  }

  const demoBtn = document.getElementById("demoLoginBtn");
  if (demoBtn) {
    demoBtn.addEventListener("click", _handleDemoLoginClick);
  }
}

async function _handleLoginClick() {
  try {
    await AuthService.loginWithGoogle();
  } catch (error) {
    alert("Login fehlgeschlagen: " + error.message);
  }
}

async function _handleDemoLoginClick() {
  const demoUser = {
    uid: "demo-user",
    email: "demo@example.com",
    displayName: "Demo User",
  };

  AuthService.loginAsDemo(demoUser);
}

async function loadAndShowTodayPlan() {
  try {
    const today = new Date();
    const dateStr = _formatDate(today);

    const plan = await PlannerService.getPlannedDay(dateStr);
    if (plan && plan.name) {
      UI.showPlannedDay(plan.name, plan.color);
    }
  } catch (error) {
    console.error("Error loading today plan:", error);
  }
}

function _formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function switchTab(tabName) {
  UI.switchTab(tabName);

  if (tabName === "history") {
    UI.renderHistory(
      HistoryService.getHistory(),
      historyController.deleteHistoryItem.bind(historyController),
    );
  }
}

function setupCleanup() {
  window.addEventListener("beforeunload", () => {
    FoodsService.cleanup();
    HistoryService.cleanup();
  });
}

// -- Entry Point --
document.addEventListener("DOMContentLoaded", () => {
  init();
});

// For easier debugging or backwards compatibility if needed
window.EssenTrackerApp = { init, switchTab };
