// Adds an email to the "Zero to AI Hero" MailerLite group.
// Token comes from the Netlify env var MAILERLITE_API_TOKEN (set in Site settings → Environment).
const GROUP = "189621140255147927"; // Zero to AI Hero

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  let email = "";
  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) email = (await req.json()).email;
    else email = new URLSearchParams(await req.text()).get("email");
  } catch { /* ignore */ }
  email = (email || "").trim();
  if (!email || !email.includes("@")) return json({ ok: false, error: "email_required" }, 400);

  const TOK = process.env.MAILERLITE_API_TOKEN;
  if (!TOK) return json({ ok: false, error: "not_configured" }, 200); // never break the signup UX

  try {
    const r = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOK}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, groups: [GROUP] }),
    });
    return json({ ok: r.ok }, 200);
  } catch {
    return json({ ok: false, error: "upstream" }, 200);
  }
};

const json = (obj, status) => new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
