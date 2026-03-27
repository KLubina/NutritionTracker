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

// Generate MOCK_PLANNED_DAYS dynamically: last 90 days + 30 future days
function dateStrFromDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function templateForWeekday(day) {
  // 0=Sun,1=Mon,...6=Sat
  switch (day) {
    case 0:
      return "tpl_rest";
    case 1:
      return "tpl_training";
    case 2:
      return "tpl_training";
    case 3:
      return "tpl_training";
    case 4:
      return "tpl_refeed";
    case 5:
      return "tpl_training";
    case 6:
      return "tpl_cheat";
    default:
      return "tpl_training";
  }
}

function generatePlannedDays(daysBack = 89, daysForward = 30) {
  const out = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = -daysBack; i <= daysForward; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const tpl = templateForWeekday(d.getDay());
    out[dateStrFromDate(d)] = { templateId: tpl };
  }

  return out;
}

export const MOCK_PLANNED_DAYS = generatePlannedDays(89, 30);
