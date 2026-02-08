import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "../../firebase-storages/firebase-storages-access.js";

// -- Module State --
let currentUser = null;
let onAuthCallback = null;

// -- Public Functions --

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export function loginAsDemo(user) {
  currentUser = user;
  if (onAuthCallback) {
    onAuthCallback(user);
  }
}

export function onAuthChanged(callback) {
  onAuthCallback = callback;
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (callback) {
      callback(user);
    }
  });
}

export function getCurrentUser() {
  return currentUser;
}

export function getCurrentUserId() {
  return currentUser ? currentUser.uid : null;
}

export function isAuthenticated() {
  return currentUser !== null;
}
