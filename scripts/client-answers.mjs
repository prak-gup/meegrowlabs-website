// Pull answers submitted from a client review form.
//   node scripts/client-answers.mjs au-proofread-desk-questions          -> latest answer per person + all remarks
//   node scripts/client-answers.mjs au-proofread-desk-questions --json   -> raw submissions
// Read key: ~/.config/meegrow/client-answers.key (its SHA-256 lives in netlify/functions/client-answers.mjs).
import { readFileSync } from "node:fs";
import { homedir } from "node:os";

const [form, flag] = process.argv.slice(2);
if (!form) { console.error("usage: node scripts/client-answers.mjs <form> [--json] [--all]"); process.exit(1); }
const key = readFileSync(`${homedir()}/.config/meegrow/client-answers.key`, "utf8").trim();
const r = await fetch(`https://meegrowlabs.com/.netlify/functions/client-answers?form=${form}&key=${encodeURIComponent(key)}`);
const d = await r.json();
if (!d.ok) { console.error("fetch failed", r.status, d); process.exit(1); }

// Test submissions are named TEST-*; hidden unless --all.
const items = d.items.filter((i) => flag === "--all" || flag === "--json" || !i.name.startsWith("TEST-"));
if (flag === "--json") { console.log(JSON.stringify(items, null, 2)); process.exit(0); }

const latest = new Map(); // one row per person, newest submission wins
for (const i of items) latest.set(i.name.trim(), i);
console.log(`${items.length} submissions, ${latest.size} people\n`);
for (const [name, i] of latest) {
  console.log(`=== ${name} · ${i.at}\n${i.text}\n`);
}
