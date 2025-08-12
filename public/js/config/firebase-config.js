// ==========================================
// 🔥 FIREBASE CONFIGURATION
// ==========================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    where
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgVIz1T6qYrJe8ZnglTvdYHyV_OZJnPLw",
    authDomain: "ernahrungs-tracker.firebaseapp.com",
    projectId: "ernahrungs-tracker",
    storageBucket: "ernahrungs-tracker.firebasestorage.app",
    messagingSenderId: "613287453918",
    appId: "1:613287453918:web:f21cb2b2198805d64d4e4f",
    measurementId: "G-RBE44RZ6SY"
};

// Initialize Firebase
let app, db;
const isFirebaseConfigured = true;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('✅ Firebase successfully initialized');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}

// Export Firebase instances and modules
export {
    db,
    app,
    isFirebaseConfigured,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    where
};