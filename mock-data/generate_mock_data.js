/**
 * generate_mock_data.js
 *
 * Standalone Node.js script that prints freshly-generated mock-data
 * content to stdout so you can review it or redirect it into a file.
 *
 * Run with:
 *   node mock-data/generate_mock_data.js
 *
 * The script intentionally does NOT write files automatically –
 * edit the SEED or meal definitions below and redirect stdout if
 * you want to refresh the mock data.
 *
 *   node mock-data/generate_mock_data.js > mock-data/_generated_preview.txt
 *
 * The actual files consumed by the app are the hand-curated *.js files
 * in this folder. Use this script only to prototype new data sets.
 */

// ── Config ─────────────────────────────────────────────────────────────────
const SEED = 0xdeadbeef; // change to get a different dataset
const DAYS = 90; // how many days of history to generate
const TODAY = new Date(); // dynamisch: aktuelles Datum

// ── Seeded PRNG ─────────────────────────────────────────────────────────────
function makePrng(seed) {
  let s = seed >>> 0;
  return function () {
    s = Math.imul(1664525, s) + 1013904223;
    return (s >>> 0) / 0x100000000;
  };
}
const rng = makePrng(SEED);

function randInt(min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[Math.floor(rng() * arr.length)];
}
function pad2(n) {
  return String(n).padStart(2, "0");
}

// ── Food catalogue ──────────────────────────────────────────────────────────
const FOODS = {
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

const TIME_SLOTS = [
  { hour: 7, min: [0, 45] },
  { hour: 8, min: [0, 30] },
  { hour: 10, min: [0, 59] },
  { hour: 12, min: [0, 59] },
  { hour: 13, min: [0, 30] },
  { hour: 15, min: [0, 59] },
  { hour: 16, min: [0, 30] },
  { hour: 18, min: [0, 59] },
  { hour: 19, min: [0, 30] },
  { hour: 21, min: [0, 29] },
];

function pickCategory() {
  const v = rng();
  if (v < 0.55) return "normal";
  if (v < 0.85) return "drinks";
  return "goennung";
}

// ── Generate history ─────────────────────────────────────────────────────────
function generateHistory() {
  const entries = [];
  let id = 1;

  for (let offset = -(DAYS - 1); offset <= 0; offset++) {
    const date = new Date(TODAY);
    date.setDate(TODAY.getDate() + offset);

    const slots = [...TIME_SLOTS]
      .sort(() => rng() - 0.5)
      .slice(0, randInt(3, 6));
    slots.sort((a, b) => a.hour - b.hour);

    for (const slot of slots) {
      const hour = slot.hour;
      const minute = randInt(slot.min[0], slot.min[1]);
      const ts = new Date(date);
      ts.setHours(hour, minute, 0, 0);

      const cat = pickCategory();
      const food = pick(FOODS[cat]);

      entries.push({
        id: `mh${String(id++).padStart(4, "0")}`,
        food: food.name,
        timestamp: ts.getTime(),
        date: date.toDateString(),
        time: `${pad2(hour)}:${pad2(minute)}`,
        category: cat,
        grams: food.grams,
        liters: food.liters,
        quantity: food.quantity,
      });
    }
  }

  return entries;
}

// ── Output ──────────────────────────────────────────────────────────────────
const history = generateHistory();

console.log("=== GENERATED HISTORY PREVIEW ===");
console.log(`Total entries: ${history.length}`);
console.log();

// Group by date for readability
const byDate = {};
history.forEach((e) => {
  byDate[e.date] = byDate[e.date] || [];
  byDate[e.date].push(e);
});

for (const [date, entries] of Object.entries(byDate)) {
  console.log(`📅 ${date}`);
  entries.forEach((e) => {
    const amount = e.grams
      ? `${e.grams}g`
      : e.liters
        ? `${e.liters}L`
        : e.quantity
          ? `×${e.quantity}`
          : "";
    console.log(`  ${e.time}  [${e.category.padEnd(8)}]  ${e.food} ${amount}`);
  });
  console.log();
}

console.log("=== Category breakdown ===");
const counts = { normal: 0, goennung: 0, drinks: 0 };
history.forEach((e) => counts[e.category]++);
console.log(JSON.stringify(counts, null, 2));
