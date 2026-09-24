// Stores answers submitted from client review forms (e.g. /client/au-proofread-desk-questions/).
// POST  { form, name, answers, text }  -> saves one submission to Netlify Blobs.
// GET   ?form=<id>&key=<read key>      -> returns every submission for that form (Meegrow only).
// The read key is never stored here, only its SHA-256.
import { getStore } from "@netlify/blobs";
import { createHash, randomUUID } from "node:crypto";

const FORMS = new Set(["au-proofread-desk-questions"]);
const READ_KEY_SHA256 = "f2204ed56f0bf9f8110d99df13791d411388718ece05de3b0a398f00db8e1de3";
const MAX_BYTES = 64 * 1024;

export default async (req) => {
  const store = getStore({ name: "client-answers", consistency: "strong" });
  const url = new URL(req.url);

  if (req.method === "GET") {
    const form = url.searchParams.get("form") || "";
    const key = url.searchParams.get("key") || "";
    if (createHash("sha256").update(key).digest("hex") !== READ_KEY_SHA256) return json({ ok: false }, 403);
    if (!FORMS.has(form)) return json({ ok: false, error: "unknown_form" }, 400);
    const { blobs } = await store.list({ prefix: `${form}/` });
    const items = [];
    for (const b of blobs) items.push(await store.get(b.key, { type: "json" }));
    items.sort((a, b) => (a.at < b.at ? -1 : 1));
    return json({ ok: true, count: items.length, items }, 200);
  }

  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const raw = await req.text();
  if (raw.length > MAX_BYTES) return json({ ok: false, error: "too_large" }, 413);
  let body;
  try { body = JSON.parse(raw); } catch { return json({ ok: false, error: "bad_json" }, 400); }
  const form = String(body.form || "");
  const name = String(body.name || "").trim().slice(0, 120);
  if (!FORMS.has(form)) return json({ ok: false, error: "unknown_form" }, 400);
  if (!name) return json({ ok: false, error: "name_required" }, 400);

  const at = new Date().toISOString();
  await store.setJSON(`${form}/${at}-${randomUUID().slice(0, 8)}`, {
    form, name, at,
    answers: body.answers && typeof body.answers === "object" ? body.answers : {},
    text: String(body.text || "").slice(0, 20000),
  });
  return json({ ok: true, at }, 200);
};

const json = (obj, status) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
