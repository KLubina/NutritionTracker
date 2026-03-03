/**
 * Mock history data for demo mode.
 *
 * Generates ~360 log entries spread across the last 90 days
 * deterministically using a seeded LCG random number generator –
 * the data is always identical every time the module is loaded.
 *
 * Each entry mirrors a Firestore "history" document:
 *   id        – stable fake ID
 *   food      – food name (must match a name in foods_mock.js)
 *   timestamp – Unix ms
 *   date      – Date.toDateString()
 *   time      – "HH:MM" (de-DE)
 *   category  – "normal" | "goennung" | "drinks"
 *   grams / liters / quantity – portion data
 */

// ── Seeded LCG (Linear Congruential Generator) ─────────────────────────────
// Parameters from Numerical Recipes. Produces [0, 1).
function makePrng(seed) {
  let s = seed >>> 0;
  return function () {
    s = Math.imul(1664525, s) + 1013904223;
    return (s >>> 0) / 0x100000000;
  };
}
const rng = makePrng(0xdeadbeef);

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}
function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

// ── Food palette (name, category, grams, liters, quantity) ─────────────────
const FOOD_PALETTE = {
  normal: [
    { name: "Haferflocken", grams: 80, liters: null, quantity: null },
    { name: "Banane", grams: null, liters: null, quantity: 1 },
    { name: "Apfel", grams: null, liters: null, quantity: 1 },
    { name: "Vollkornbrot", grams: 60, liters: null, quantity: null },
    { name: "Hühnchenbrust", grams: 150, liters: null, quantity: null },
    { name: "Lachs", grams: 200, liters: null, quantity: null },
    { name: "Rührei", grams: null, liters: null, quantity: 2 },
    { name: "Magerquark", grams: 250, liters: null, quantity: null },
    { name: "Pasta", grams: 100, liters: null, quantity: null },
    { name: "Brauner Reis", grams: 150, liters: null, quantity: null },
    { name: "Brokkoli", grams: 200, liters: null, quantity: null },
    { name: "Thunfisch", grams: 140, liters: null, quantity: null },
    { name: "Griechischer Joghurt", grams: 200, liters: null, quantity: null },
    { name: "Süßkartoffel", grams: 200, liters: null, quantity: null },
    { name: "Proteinriegel", grams: 65, liters: null, quantity: null },
    { name: "Magertopfen", grams: 200, liters: null, quantity: null },
    { name: "Hüttenkäse", grams: 150, liters: null, quantity: null },
    { name: "Linsensuppe", grams: 300, liters: null, quantity: null },
  ],
  goennung: [
    { name: "Schokolade", grams: 30, liters: null, quantity: null },
    { name: "Chips", grams: 50, liters: null, quantity: null },
    { name: "Eis", grams: null, liters: null, quantity: 1 },
    { name: "Kuchen", grams: 120, liters: null, quantity: null },
    { name: "Pizza", grams: 350, liters: null, quantity: null },
    { name: "Burger", grams: null, liters: null, quantity: 1 },
    { name: "Gummibärchen", grams: 40, liters: null, quantity: null },
    { name: "Pommes", grams: 150, liters: null, quantity: null },
  ],
  drinks: [
    { name: "Wasser", grams: null, liters: 0.5, quantity: null },
    { name: "Kaffee", grams: null, liters: 0.3, quantity: null },
    { name: "Tee", grams: null, liters: 0.3, quantity: null },
    { name: "Proteinshake", grams: null, liters: 0.4, quantity: null },
    { name: "Orangensaft", grams: null, liters: 0.25, quantity: null },
    { name: "Mineralwasser", grams: null, liters: 0.75, quantity: null },
  ],
};

// Weighted category selector: normal 55 %, drinks 30 %, goennung 15 %
function pickCategory(rng) {
  const v = rng();
  if (v < 0.55) return "normal";
  if (v < 0.85) return "drinks";
  return "goennung";
}

// Meal time slots with realistic hour/minute distributions
const TIME_SLOTS = [
  { hour: 7, minuteRange: [0, 45] }, // breakfast
  { hour: 8, minuteRange: [0, 30] }, // late breakfast
  { hour: 10, minuteRange: [0, 59] }, // morning snack
  { hour: 12, minuteRange: [0, 59] }, // lunch
  { hour: 13, minuteRange: [0, 30] }, // late lunch
  { hour: 15, minuteRange: [0, 59] }, // afternoon snack
  { hour: 16, minuteRange: [0, 30] }, // coffee break
  { hour: 18, minuteRange: [0, 59] }, // dinner
  { hour: 19, minuteRange: [0, 30] }, // late dinner
  { hour: 21, minuteRange: [0, 29] }, // evening snack
];

function pad2(n) {
  return String(n).padStart(2, "0");
}

// ── Generator ──────────────────────────────────────────────────────────────
function generateHistory() {
  // Anchor: March 3 2026 (the demo "today")
  const TODAY = new Date(2026, 2, 3); // month is 0-indexed

  const entries = [];
  let idCounter = 1;

  for (let dayOffset = -89; dayOffset <= 0; dayOffset++) {
    const date = new Date(TODAY);
    date.setDate(TODAY.getDate() + dayOffset);

    const dateStr = date.toDateString();

    // How many entries today? 3–6
    const count = randInt(rng, 3, 6);

    // Pick `count` different time slots (shuffle then take first `count`)
    const slots = [...TIME_SLOTS].sort(() => rng() - 0.5).slice(0, count);
    slots.sort((a, b) => a.hour - b.hour);

    for (const slot of slots) {
      const hour = slot.hour;
      const minute = randInt(rng, slot.minuteRange[0], slot.minuteRange[1]);

      const ts = new Date(date);
      ts.setHours(hour, minute, 0, 0);

      const category = pickCategory(rng);
      const food = pick(rng, FOOD_PALETTE[category]);

      entries.push({
        id: `mh${String(idCounter++).padStart(4, "0")}`,
        food: food.name,
        timestamp: ts.getTime(),
        date: dateStr,
        time: `${pad2(hour)}:${pad2(minute)}`,
        category,
        grams: food.grams,
        liters: food.liters,
        quantity: food.quantity,
      });
    }
  }

  return entries;
}

export const MOCK_HISTORY = generateHistory();
