import {
  nutritionPlannerDb,
  doc,
  getDoc,
} from "../../../firebase-storages/firebase-storages-access.js";

export async function getPlannedDay(dateStr) {
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
