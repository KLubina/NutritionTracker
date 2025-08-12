// ==========================================
// 🚀 MAIN APPLICATION
// ==========================================

import DatabaseService from './services/database.js';
import UIComponents from './components/ui.js';

class EssenTrackerApp {
    constructor() {
        this.database = new DatabaseService();
        this.ui = new UIComponents();
        this.isInitialized = false;
    }

    // ==========================================
    // 🚀 APP INITIALIZATION
    // ==========================================

    init() {
        console.log('🍽️ Initializing Essen Tracker App...');

        // Initialize database with sync callback
        const isFirebaseConnected = this.database.init(this.handleDataSync.bind(this));
        
        // Update connection status
        this.ui.updateConnectionStatus(isFirebaseConnected);

        // Setup event listeners
        this.setupEventListeners();

        // Setup global functions for onclick handlers
        this.setupGlobalFunctions();

        // Setup cleanup on page unload
        this.setupCleanup();

        this.isInitialized = true;
        console.log('✅ App initialized successfully!');
    }

    // ==========================================
    // 🔄 DATA SYNCHRONIZATION
    // ==========================================

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

    // ==========================================
    // 🎯 CORE FUNCTIONS
    // ==========================================

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

    // ==========================================
    // 📅 DATE NAVIGATION
    // ==========================================

    changeDate(direction) {
        this.ui.changeDate(direction);
        this.ui.renderHistory(this.database.getHistory(), this.deleteHistoryItem.bind(this));
    }

    jumpToDate(daysOffset) {
        this.ui.jumpToDate(daysOffset);
        this.ui.renderHistory(this.database.getHistory(), this.deleteHistoryItem.bind(this));
    }

    // ==========================================
    // 📑 TAB MANAGEMENT
    // ==========================================

    switchTab(tabName) {
        this.ui.switchTab(tabName);
        
        // Re-render content for specific tabs
        if (tabName === 'history') {
            this.ui.renderHistory(this.database.getHistory(), this.deleteHistoryItem.bind(this));
        } else if (tabName === 'stats') {
            this.ui.renderStats(this.database.getHistory());
        }
    }

    // ==========================================
    // 🎧 EVENT LISTENERS
    // ==========================================

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

    // ==========================================
    // 🌐 GLOBAL FUNCTIONS
    // ==========================================

    setupGlobalFunctions() {
        // Make functions available for onclick handlers
        window.switchTab = this.switchTab.bind(this);
        window.eatFood = this.eatFood.bind(this);
        window.deleteHistoryItem = this.deleteHistoryItem.bind(this);
        window.changeDate = this.changeDate.bind(this);
        window.jumpToDate = this.jumpToDate.bind(this);
    }

    // ==========================================
    // 🧹 CLEANUP
    // ==========================================

    setupCleanup() {
        window.addEventListener('beforeunload', () => {
            this.database.cleanup();
        });
    }
}

// ==========================================
// 🎬 APP STARTUP
// ==========================================

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new EssenTrackerApp();
    app.init();
});

// Make app instance available globally for debugging
window.EssenTrackerApp = EssenTrackerApp;