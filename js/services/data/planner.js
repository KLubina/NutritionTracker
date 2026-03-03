import {
  nutritionPlannerDb,
  doc,
  getDoc,
} from "../../../firebase-storages/firebase-storages-access.js";

// -- Mock override state (demo mode) --
let _mockPlannedDays = null;
let _mockTemplates = null;

/** Demo mode: override Firestore lookups with static mock planner data. */
export function overrideMockData(plannedDays, templates) {
  _mockPlannedDays = plannedDays;
  _mockTemplates = templates;
}

export async function getPlannedDay(dateStr) {
  // Demo mode: return from static mock data
  if (_mockPlannedDays) {
    const planned = _mockPlannedDays[dateStr];
    if (!planned) return null;
    const template = _mockTemplates[planned.templateId];
    if (!template) return null;
    return { templateId: planned.templateId, ...template };
  }

  try {
    const plannedRef = doc(nutritionPlannerDb, "plannedDays", dateStr);
    const plannedSnap = await getDoc(plannedRef);

    if (!plannedSnap.exists()) return null;

    const plannedData = plannedSnap.data();

    const templateRef = doc(
      nutritionPlannerDb,
      "dayTemplates",
      plannedData.templateId,
    );
    const templateSnap = await getDoc(templateRef);

    if (!templateSnap.exists()) return null;

    return {
      templateId: plannedData.templateId,
      ...templateSnap.data(),
    };
  } catch (error) {
    console.error("Error getting planned day:", error);
    return null;
  }
}
