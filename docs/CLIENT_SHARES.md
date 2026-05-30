# Client Shares — the standard

Password-protected, single-page client deliverables (review docs, decks-as-HTML,
guidelines) live under a predictable, encrypted URL:

```
https://meegrowlabs.com/client/<code>/
```

- `<code>` is a short lowercase slug, usually the client/initiative (e.g. `au`).
- The page is **AES-256 encrypted** (PBKDF2 + AES-GCM, Web Crypto). The content
  is **not readable from page source** — only the access code decrypts it,
  client-side in the browser.
- `robots.txt` disallows `/client/`, and each page is `noindex, nofollow`.

This is a static-site gate (the site is React/Vite on Netlify). It is genuinely
strong — content is unrecoverable without the code — but the access code is a
shared secret: anyone with the code (and the file) can decrypt it, and there is
no server-side revocation or access logging. For revocable/logged access you'd
need Netlify's paid password protection or a backend. For client review shares,
the encrypted gate is the right tradeoff.

## Create a new share

```bash
# via npm alias (note the `--` before args):
npm run client-share -- <slug> <source.html> <password|--open> ["Title"] ["Badge"]
# or directly:
node scripts/new-client-share.mjs <slug> <source.html> <password|--open> ["Title"] ["Badge"]
```

Password-protected (encrypted):

```bash
node scripts/new-client-share.mjs au ~/Downloads/Tejas_Review.html AU2026 \
  "Tejas — Editorial Guidelines · Client Review" "Client AU · Confidential"
```

Open (no access code — still `noindex` + robots-disallowed, but anyone with the
link can read it):

```bash
node scripts/new-client-share.mjs au ~/Downloads/Tejas_Review.html --open
```

This writes `public/client/<code>/index.html`. Then ship it (Netlify auto-deploys
on push to `main`):

```bash
git add public/client/<code>/
git commit -m "Add client <code> share"
git push
```

Live within ~1–2 min at `https://meegrowlabs.com/client/<code>/`.

> Note: the site canonicalizes `www` → apex. Share the apex URL
> (`https://meegrowlabs.com/...`); the `www` form 301-redirects to it.

## Update an existing share

Re-run the same command with the new source HTML (same `<code>`), then commit + push.

## How it works

- `scripts/lib/encrypt-page.mjs` — `buildEncryptedPage({plaintext, password, title, badge})`
  returns the self-contained gated HTML (shared by both scripts).
- `scripts/new-client-share.mjs` — canonical command; places the page under
  `public/client/<code>/` and prints the live URL.
- `scripts/encrypt-client-page.mjs` — low-level: encrypt to an explicit output path.

Static files in `public/` are served directly by Netlify at their path (the SPA
`/* /index.html 200` fallback only applies to paths with no real file), which is
why `public/client/<code>/index.html` resolves at `/client/<code>/`.
