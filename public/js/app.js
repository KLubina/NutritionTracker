import DatabaseService from './services/database.js';
import UIComponents from './components/ui.js';

class EssenTrackerApp {
    constructor() {
        this.database = new DatabaseService();
        this.ui = new UIComponents();
        this.isInitialized = false;
    }

    // #region APP INITIALIZATION
    init() {
        this.setupEventListeners();
        this.setupGlobalFunctions();
        this.setupCleanup();

        // Initialisiere Database mit Sync-Callback - WICHTIG für Navigation!
        this.database.init(this.handleDataSync.bind(this));

        this.isInitialized = true;
    }
    // #endregion

    // #region DATA SYNCHRONIZATION
    handleDataSync(dataType, data) {
        switch (dataType) {
            case 'foods':
                this.ui.renderFoods(data, this.eatFood.bind(this));
                break;
            case 'history':
                this.ui.renderHistory(data, this.deleteHistoryItem.bind(this));
                this.ui.renderStats(data);
                break;
        }
    }
    // #endregion

    //#region  Database Operations
    addFood() {
        const foodName = this.ui.getInputValue();

        if (foodName && !this.database.getFoods().find(f => f.name === foodName)) {
            this.ui.clearInput();
            this.database.addFood(foodName);
        }
    }

    eatFood(foodName) {
        this.database.addHistory(foodName);
    }

    deleteHistoryItem(historyId) {
        this.database.deleteHistory(historyId);
    }
    //#endregion

    //#region DATE NAVIGATION
    changeDate(direction) {
        this.ui.changeDate(direction);
        this.ui.renderHistory(this.database.getHistory(), this.deleteHistoryItem.bind(this));
    }

    jumpToDate(daysOffset) {
        this.ui.jumpToDate(daysOffset);
        this.ui.renderHistory(this.database.getHistory(), this.deleteHistoryItem.bind(this));
    }
    //#endregion

    //#region TAB MANAGEMENT
    switchTab(tabName) {
        this.ui.switchTab(tabName);
        
        // Re-render content for specific tabs
        if (tabName === 'history') {
            this.ui.renderHistory(this.database.getHistory(), this.deleteHistoryItem.bind(this));
        } else if (tabName === 'stats') {
            this.ui.renderStats(this.database.getHistory());
        }
    }
    //#endregion

    // #region EVENT LISTENERS
    setupEventListeners() {
        // Add button click
        document.getElementById('addBtn').addEventListener('click', () => {
            this.addFood();
        });

        // Enter key in input field
        document.getElementById('newFood').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addFood();
            }
        });

        // Focus input on page load
        setTimeout(() => {
            this.ui.focusInput();
        }, 100);
    }
    //#region

    // #region GLOBAL FUNCTIONS
    setupGlobalFunctions() {
        // Make functions available for onclick handlers
        window.switchTab = this.switchTab.bind(this);
        window.eatFood = this.eatFood.bind(this);
        window.deleteHistoryItem = this.deleteHistoryItem.bind(this);
        window.changeDate = this.changeDate.bind(this);
        window.jumpToDate = this.jumpToDate.bind(this);
        window.exportToCsv = this.exportToCsv.bind(this);
    }
    // #endregion

    // #region CLEANUP
    setupCleanup() {
        window.addEventListener('beforeunload', () => {
            this.database.cleanup();
        });
    }
    // #endregion
}

// #region APP STARTUP
// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new EssenTrackerApp();
    app.init();
});

// Make app instance available globally for debugging
window.EssenTrackerApp = EssenTrackerApp;
// #endregion
