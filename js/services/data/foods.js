import {
  nutritionDb,
  addDoc,
  collection,
  serverTimestamp,
  writeBatch,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  orderBy,
  onSnapshot,
} from "../../../firebase-storages/firebase-storages-access.js";

// -- Module State --
let foodsData = [];
let unsubscribe = null;
let syncCallback = null;

// -- Public Functions --

export function init(callback) {
  syncCallback = callback;

  if (nutritionDb) {
    setupRealtimeListener();
    return true;
  }
  return false;
}

export function cleanup() {
  if (unsubscribe) unsubscribe();
}

export function getFoods(category = null) {
  if (category) {
    return foodsData.filter((f) => (f.category || "normal") === category);
  }
  return foodsData;
}

export function getFoodById(foodId) {
  return foodsData.find((f) => f.id === foodId);
}

export async function addFood(foodName, category = "normal") {
  if (!nutritionDb) return;
  try {
    await addDoc(collection(nutritionDb, "foods"), {
      name: foodName,
      category: category,
      grams: null,
      liters: null,
      quantity: null,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding food:", error);
  }
}

export async function updateFood(foodId, newName) {
  if (!nutritionDb) return;
  try {
    const currentFood = foodsData.find((f) => f.id === foodId);
    if (!currentFood) {
      console.error("Food not found for update");
      return;
    }

    const batch = writeBatch(nutritionDb);
    const oldName = currentFood.name;

    // Update food name
    batch.update(doc(nutritionDb, "foods", foodId), { name: newName });

    // Update history entries with this food name
    await _appendHistoryUpdatesToBatch(batch, oldName, newName);

    await batch.commit();
  } catch (error) {
    console.error("Error updating food and history:", error);
  }
}

export async function moveFoodToCategory(foodId, newCategory) {
  if (!nutritionDb) return;
  try {
    await updateDoc(doc(nutritionDb, "foods", foodId), {
      category: newCategory,
    });
  } catch (error) {
    console.error("Error moving food to category:", error);
  }
}

export async function updateFoodGrams(foodId, grams) {
  if (!nutritionDb) return;
  try {
    await updateDoc(doc(nutritionDb, "foods", foodId), {
      grams: grams,
    });
  } catch (error) {
    console.error("Error updating food grams:", error);
  }
}

export async function updateFoodLiters(foodId, liters) {
  if (!nutritionDb) return;
  try {
    await updateDoc(doc(nutritionDb, "foods", foodId), {
      liters: liters,
    });
  } catch (error) {
    console.error("Error updating food liters:", error);
  }
}

export async function updateFoodQuantity(foodId, quantity) {
  if (!nutritionDb) return;
  try {
    await updateDoc(doc(nutritionDb, "foods", foodId), {
      quantity: quantity,
    });
  } catch (error) {
    console.error("Error updating food quantity:", error);
  }
}

export async function deleteFood(foodId) {
  if (!nutritionDb) return;
  try {
    await deleteDoc(doc(nutritionDb, "foods", foodId));
  } catch (error) {
    console.error("Error deleting food:", error);
  }
}

// -- Private / Helper Functions --

function setupRealtimeListener() {
  try {
    const foodsQuery = query(
      collection(nutritionDb, "foods"),
      orderBy("createdAt", "desc"),
    );
    unsubscribe = onSnapshot(
      foodsQuery,
      (snapshot) => {
        foodsData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (syncCallback) syncCallback("foods", foodsData);
      },
      (error) => {
        console.error("Foods listener error:", error);
      },
    );
  } catch (error) {
    console.error("Error setting up foods listener:", error);
  }
}

async function _appendHistoryUpdatesToBatch(batch, oldName, newName) {
  const historyQuery = query(
    collection(nutritionDb, "history"),
    where("food", "==", oldName),
  );
  const historySnapshot = await getDocs(historyQuery);

  historySnapshot.docs.forEach((historyDoc) => {
    batch.update(historyDoc.ref, {
      food: newName,
    });
  });
}
