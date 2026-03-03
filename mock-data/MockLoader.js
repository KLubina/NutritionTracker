/**
 * MockLoader.js
 *
 * Injects all static mock data into the running app's service modules,
 * making it possible to run a fully-populated demo without Firebase.
 *
 * Usage (called from app.js when the user logs in as demo):
 *
 *   import { MockLoader } from "../mock-data/MockLoader.js";
 *   MockLoader.setupMockData(renderController);
 */

import { MOCK_FOODS } from "./foods_mock.js";
import { MOCK_HISTORY } from "./history_mock.js";
import { MOCK_PLANNED_DAYS, MOCK_DAY_TEMPLATES } from "./planned_days_mock.js";

import * as FoodsService from "../js/services/data/foods.js";
import * as HistoryService from "../js/services/data/history.js";
import * as PlannerService from "../js/services/data/planner.js";

// ── Public API ─────────────────────────────────────────────────────────────

export const MockLoader = {
  /**
   * Populates the in-memory state of FoodsService, HistoryService and
   * PlannerService with static mock data and triggers a full UI re-render
   * via the provided renderController.
   *
   * @param {object} renderController - the RenderController instance
   */
  setupMockData(renderController) {
    // 1. Foods ──────────────────────────────────────────────────────────────
    FoodsService.injectMockData(MOCK_FOODS);
    renderController.handleDataSync("foods", MOCK_FOODS);

    // 2. History ────────────────────────────────────────────────────────────
    HistoryService.injectMockData(MOCK_HISTORY);
    renderController.handleDataSync("history", MOCK_HISTORY);

    // 3. Planner ────────────────────────────────────────────────────────────
    PlannerService.overrideMockData(MOCK_PLANNED_DAYS, MOCK_DAY_TEMPLATES);

    console.info(
      `[MockLoader] Demo data injected – ` +
        `${MOCK_FOODS.length} foods · ` +
        `${MOCK_HISTORY.length} history entries · ` +
        `${Object.keys(MOCK_PLANNED_DAYS).length} planned days`,
    );
  },
};
