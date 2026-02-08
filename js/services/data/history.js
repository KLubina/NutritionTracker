import {
  nutritionDb,
  addDoc,
  collection,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
} from "../../../firebase-storages/firebase-storages-access.js";
import { HistoryCleanupHelper } from "./helpers/history-cleanup.js";

// -- Module State --
let historyData = [];
let unsubscribe = null;
let syncCallback = null;

// -- Public Functions --

export function init(callback) {
  syncCallback = callback;

  if (nutritionDb) {
    setupRealtimeListener();
    cleanupOldHistory();
    return true;
  }
  return false;
}

export function cleanup() {
  if (unsubscribe) unsubscribe();
}

export function getHistory() {
  return historyData;
}

export async function addHistory(food) {
  if (!nutritionDb) return;
  try {
    const now = new Date();
    await addDoc(collection(nutritionDb, "history"), {
      food: food.name,
      timestamp: now.getTime(),
      date: now.toDateString(),
      time: now.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      category: food.category || "normal",
      grams: food.grams || null,
      liters: food.liters || null,
      quantity: food.quantity || null,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding history:", error);
  }
}

export async function deleteHistory(historyId) {
  if (!nutritionDb) return;
  try {
    await deleteDoc(doc(nutritionDb, "history", historyId));
  } catch (error) {
    console.error("Error deleting history:", error);
  }
}

export async function updateHistory(historyId, newTimestamp) {
  if (!nutritionDb) return;
  try {
    const newDate = new Date(newTimestamp);
    const dateStr = newDate.toDateString();
    const timeStr = newDate.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    await updateDoc(doc(nutritionDb, "history", historyId), {
      timestamp: newTimestamp,
      date: dateStr,
      time: timeStr,
    });
  } catch (error) {
    console.error("Error updating history entry:", error);
  }
}

export async function updateHistoryAmount(historyId, amount, type) {
  if (!nutritionDb) return;
  try {
    const updateData = {};
    if (type === "grams") {
      updateData.grams = amount;
      updateData.liters = null;
    } else if (type === "liters") {
      updateData.liters = amount;
      updateData.grams = null;
    } else if (type === "quantity") {
      updateData.quantity = amount;
    }

    await updateDoc(doc(nutritionDb, "history", historyId), updateData);
  } catch (error) {
    console.error("Error updating history amount:", error);
  }
}

// -- Private / Helper Functions --

function setupRealtimeListener() {
  try {
    const historyQuery = query(
      collection(nutritionDb, "history"),
      orderBy("timestamp", "desc"),
    );
    unsubscribe = onSnapshot(
      historyQuery,
      (snapshot) => {
        historyData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (syncCallback) syncCallback("history", historyData);
      },
      (error) => {
        console.error("History listener error:", error);
      },
    );
  } catch (error) {
    console.error("Error setting up history listener:", error);
  }
}

async function cleanupOldHistory() {
  await HistoryCleanupHelper.cleanupOldHistory();
}
