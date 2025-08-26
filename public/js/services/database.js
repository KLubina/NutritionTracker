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

    init(syncCallback) {
        this.syncCallback = syncCallback;

        if (isFirebaseConfigured && db) {
            this.setupRealtimeListeners();
            return true;
        } else {
            console.error('Firebase ist nicht konfiguriert oder db ist nicht verfügbar.');
            this.setSyncIndicator('❌');
            return false;
        }
    }


    // #region Loading the nutrition history
    setupRealtimeListeners() {
        try {
            const foodsQuery = query(collection(db, 'foods'), orderBy('createdAt', 'desc'));
            this.unsubscribeFoods = onSnapshot(
                foodsQuery,
                (snapshot) => {
                    this.foods = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                    this.syncCallback?.('foods', this.foods);
                    this.setSyncIndicator('✅');
                },
                (error) => {
                    console.error('Error listening to foods:', error);
                    this.setSyncIndicator('❌');
                }
            );

            const historyQuery = query(collection(db, 'history'), orderBy('timestamp', 'desc'));
            this.unsubscribeHistory = onSnapshot(
                historyQuery,
                (snapshot) => {
                    this.history = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                    this.syncCallback?.('history', this.history);
                    this.setSyncIndicator('✅');
                },
                (error) => {
                    console.error('Error listening to history:', error);
                    this.setSyncIndicator('❌');
                }
            );
        } catch (error) {
            console.error('Error setting up listeners:', error);
            this.setSyncIndicator('❌');
        }
    }
    // #endregion

    // #region CRUD-Operations to the database
    async addFood(foodName) {
        if (!db) return;
        try {
            this.setSyncIndicator('🔄', true);
            await addDoc(collection(db, 'foods'), {
                name: foodName,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error adding food:', error);
            this.setSyncIndicator('❌');
        }
    }

    async addHistory(foodName) {
        if (!db) return;
        try {
            this.setSyncIndicator('🔄', true);
            const now = new Date();
            await addDoc(collection(db, 'history'), {
                food: foodName,
                timestamp: now.getTime(),
                date: now.toDateString(),
                time: now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error adding history:', error);
            this.setSyncIndicator('❌');
        }
    }

    async deleteHistory(historyId) {
        if (!db) return;
        try {
            this.setSyncIndicator('🔄', true);
            await deleteDoc(doc(db, 'history', historyId));
        } catch (error) {
            console.error('Error deleting history:', error);
            this.setSyncIndicator('❌');
        }
    }
    // #endregion

    // #region Utility methods
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

    cleanup() {
        if (this.unsubscribeFoods) this.unsubscribeFoods();
        if (this.unsubscribeHistory) this.unsubscribeHistory();
    }
    // #endregion
}

export default DatabaseService;
