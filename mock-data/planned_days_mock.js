/**
 * Mock planner data for demo mode.
 *
 * MOCK_DAY_TEMPLATES – map of templateId → { name, color }
 *   matches Firestore "dayTemplates" collection documents.
 *
 * MOCK_PLANNED_DAYS  – map of "YYYY-MM-DD" → { templateId }
 *   matches Firestore "plannedDays" collection documents.
 *
 * Anchor: demo "today" is 2026-03-03.
 */

export const MOCK_DAY_TEMPLATES = {
  tpl_training: {
    name: "Trainingstag",
    color: "#3b82f6", // blue
  },
  tpl_rest: {
    name: "Ruhetag",
    color: "#22c55e", // green
  },
  tpl_refeed: {
    name: "Refeed",
    color: "#f97316", // orange
  },
  tpl_cheat: {
    name: "Cheat-Day",
    color: "#ec4899", // pink
  },
};

// Helper: offset from today (dynamisch)
function dateStr(offsetDays) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Assign templates to the next 14 days and several past days
export const MOCK_PLANNED_DAYS = {
  // ── Past planned days ───────────────────────────────────────────────────
  [dateStr(-21)]: { templateId: "tpl_training" },
  [dateStr(-20)]: { templateId: "tpl_rest" },
  [dateStr(-19)]: { templateId: "tpl_training" },
  [dateStr(-18)]: { templateId: "tpl_training" },
  [dateStr(-17)]: { templateId: "tpl_rest" },
  [dateStr(-16)]: { templateId: "tpl_refeed" },
  [dateStr(-15)]: { templateId: "tpl_cheat" },
  [dateStr(-14)]: { templateId: "tpl_training" },
  [dateStr(-13)]: { templateId: "tpl_rest" },
  [dateStr(-12)]: { templateId: "tpl_training" },
  [dateStr(-11)]: { templateId: "tpl_training" },
  [dateStr(-10)]: { templateId: "tpl_rest" },
  [dateStr(-9)]: { templateId: "tpl_training" },
  [dateStr(-8)]: { templateId: "tpl_refeed" },
  [dateStr(-7)]: { templateId: "tpl_training" },
  [dateStr(-6)]: { templateId: "tpl_rest" },
  [dateStr(-5)]: { templateId: "tpl_training" },
  [dateStr(-4)]: { templateId: "tpl_training" },
  [dateStr(-3)]: { templateId: "tpl_rest" },
  [dateStr(-2)]: { templateId: "tpl_training" },
  [dateStr(-1)]: { templateId: "tpl_refeed" },

  // ── Today ───────────────────────────────────────────────────────────────
  [dateStr(0)]: { templateId: "tpl_training" },

  // ── Future planned days ─────────────────────────────────────────────────
  [dateStr(1)]: { templateId: "tpl_rest" },
  [dateStr(2)]: { templateId: "tpl_training" },
  [dateStr(3)]: { templateId: "tpl_training" },
  [dateStr(4)]: { templateId: "tpl_rest" },
  [dateStr(5)]: { templateId: "tpl_refeed" },
  [dateStr(6)]: { templateId: "tpl_cheat" },
  [dateStr(7)]: { templateId: "tpl_training" },
  [dateStr(8)]: { templateId: "tpl_rest" },
  [dateStr(9)]: { templateId: "tpl_training" },
  [dateStr(10)]: { templateId: "tpl_training" },
  [dateStr(11)]: { templateId: "tpl_rest" },
  [dateStr(12)]: { templateId: "tpl_training" },
  [dateStr(13)]: { templateId: "tpl_refeed" },
  [dateStr(14)]: { templateId: "tpl_training" },
};
