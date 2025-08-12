// ==========================================
// 💾 DATABASE SERVICE
// ==========================================

import {
    db,
    isFirebaseConfigured,
    collection,
    addDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from '../config/firebase-config.js';

class DatabaseService {
    constructor() {
        this.foods = [];
        this.history = [];
        this.unsubscribeFoods = null;
        this.unsubscribeHistory = null;
        this.syncCallback = null;
    }

    // ==========================================
    // 🔧 INITIALIZATION
    // ==========================================

    init(syncCallback) {
        this.syncCallback = syncCallback;
        
        if (isFirebaseConfigured && db) {
            this.setupRealtimeListeners();
            return true;
        } else {
            this.loadFromLocalStorage();
            return false;
        }
    }

    // ==========================================
    // 🔄 REAL-TIME LISTENERS
    // ==========================================

    setupRealtimeListeners() {
        try {
            // Listen to foods collection
            const foodsQuery = query(collection(db, 'foods'), orderBy('createdAt', 'desc'));
            this.unsubscribeFoods = onSnapshot(foodsQuery, (snapshot) => {
                this.foods = [];
                snapshot.forEach((doc) => {
                    this.foods.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                this.syncCallback('foods', this.foods);
                this.setSyncIndicator('✅');
            }, (error) => {
                console.error('Error listening to foods:', error);
                this.setSyncIndicator('❌');
            });

            // Listen to history collection  
            const historyQuery = query(collection(db, 'history'), orderBy('timestamp', 'desc'));
            this.unsubscribeHistory = onSnapshot(historyQuery, (snapshot) => {
                this.history = [];
                snapshot.forEach((doc) => {
                    this.history.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                this.syncCallback('history', this.history);
                this.setSyncIndicator('✅');
            }, (error) => {
                console.error('Error listening to history:', error);
                this.setSyncIndicator('❌');
            });

        } catch (error) {
            console.error('Error setting up listeners:', error);
            this.setSyncIndicator('❌');
        }
    }

    // ==========================================
    // 🔥 FIREBASE OPERATIONS
    // ==========================================

    async addFood(foodName) {
        if (!db) return this.addFoodToLocalStorage(foodName);

        try {
            this.setSyncIndicator('🔄', true);
            await addDoc(collection(db, 'foods'), {
                name: foodName,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error adding food:', error);
            this.setSyncIndicator('❌');
            this.addFoodToLocalStorage(foodName);
        }
    }

    async addHistory(foodName) {
        if (!db) return this.addHistoryToLocalStorage(foodName);

        try {
            this.setSyncIndicator('🔄', true);
            const now = new Date();
            await addDoc(collection(db, 'history'), {
                food: foodName,
                timestamp: now.getTime(),
                date: now.toDateString(),
                time: now.toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error adding history:', error);
            this.setSyncIndicator('❌');
            this.addHistoryToLocalStorage(foodName);
        }
    }

    async deleteHistory(historyId) {
        if (!db) return this.deleteHistoryFromLocalStorage(historyId);

        try {
            this.setSyncIndicator('🔄', true);
            await deleteDoc(doc(db, 'history', historyId));
        } catch (error) {
            console.error('Error deleting history:', error);
            this.setSyncIndicator('❌');
        }
    }

    // ==========================================
    // 💾 LOCAL STORAGE FALLBACK
    // ==========================================

    loadFromLocalStorage() {
        const savedFoods = JSON.parse(localStorage.getItem('favoriteFoods') || '[]');
        const savedHistory = JSON.parse(localStorage.getItem('foodHistory') || '[]');

        this.foods = savedFoods.map(name => ({ name, id: Math.random().toString() }));
        this.history = savedHistory.map(item => ({
            ...item,
            id: item.id || Math.random().toString(),
            timestamp: item.timestamp || Date.now()
        }));

        this.syncCallback('foods', this.foods);
        this.syncCallback('history', this.history);
    }

    saveToLocalStorage() {
        localStorage.setItem('favoriteFoods', JSON.stringify(this.foods.map(f => f.name)));
        localStorage.setItem('foodHistory', JSON.stringify(this.history));
    }

    addFoodToLocalStorage(foodName) {
        if (!this.foods.find(f => f.name === foodName)) {
            this.foods.unshift({
                id: Math.random().toString(),
                name: foodName
            });
            this.saveToLocalStorage();
            this.syncCallback('foods', this.foods);
        }
    }

    addHistoryToLocalStorage(foodName) {
        const now = new Date();
        this.history.unshift({
            id: Math.random().toString(),
            food: foodName,
            time: now.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            timestamp: now.getTime(),
            date: now.toDateString()
        });
        this.saveToLocalStorage();
        this.syncCallback('history', this.history);
    }

    deleteHistoryFromLocalStorage(historyId) {
        const index = this.history.findIndex(item => item.id === historyId);
        if (index > -1) {
            this.history.splice(index, 1);
            this.saveToLocalStorage();
            this.syncCallback('history', this.history);
        }
    }

    // ==========================================
    // 🔧 UTILITY METHODS
    // ==========================================

    setSyncIndicator(icon, spinning = false) {
        const indicator = document.getElementById('syncIndicator');
        if (indicator) {
            indicator.textContent = icon;
            indicator.className = `sync-indicator ${spinning ? 'spinning' : ''}`;
        }
    }

    getFoods() {
        return this.foods;
    }

    getHistory() {
        return this.history;
    }

    // ==========================================
    // 🧹 CLEANUP
    // ==========================================

    cleanup() {
        if (this.unsubscribeFoods) this.unsubscribeFoods();
        if (this.unsubscribeHistory) this.unsubscribeHistory();
    }
}

export default DatabaseService;