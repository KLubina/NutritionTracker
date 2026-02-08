import {
  nutritionDb,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "../../../../firebase-storages/firebase-storages-access.js";
import * as AuthService from "../../auth.js";

export const HistoryCleanupHelper = {
  async cleanupOldHistory() {
    if (!nutritionDb) return;
    try {
      const userId = AuthService.getCurrentUserId();
      if (!userId) return;

      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      const cutoffTimestamp = ninetyDaysAgo.getTime();

      const oldHistoryQuery = query(
        collection(nutritionDb, "history"),
        where("userId", "==", userId),
        where("timestamp", "<", cutoffTimestamp),
      );

      const oldHistorySnapshot = await getDocs(oldHistoryQuery);

      if (oldHistorySnapshot.empty) {
        return;
      }

      const batch = writeBatch(nutritionDb);

      oldHistorySnapshot.docs.forEach((docSnapshot) => {
        batch.delete(docSnapshot.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error("Error cleaning up old history:", error);
    }
  },
};
