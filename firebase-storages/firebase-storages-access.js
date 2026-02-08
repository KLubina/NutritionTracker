import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { nutritionConfig, nutritionPlannerConfig } from "./firebase-configs.js";

// Initialize Apps
const nutritionApp = initializeApp(nutritionConfig, "nutrition");
const nutritionPlannerApp = initializeApp(
  nutritionPlannerConfig,
  "nutritionPlanner"
);

// Initialize Services
export const nutritionDb = getFirestore(nutritionApp);
export const nutritionPlannerDb = getFirestore(nutritionPlannerApp);
export const auth = getAuth(nutritionApp);

// Export app instances
export { nutritionApp, nutritionPlannerApp };

// Export Firebase modules for use in other files
export {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  orderBy,
  query,
  where,
  serverTimestamp,
  getDoc,
  updateDoc,
  onSnapshot,
  writeBatch,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
