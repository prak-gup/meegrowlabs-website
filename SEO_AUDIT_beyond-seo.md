# Meegrowlabs.com — SEO + AEO/GEO Audit (re-run + fixes applied)

Run via the **Beyond SEO** skill · Apify-first, Apify Intelligence Mode attempted · Date: 2026-06-10 (re-run)
Evidence: live HTTPS fetches (homepage, `/learn/`, lesson page, robots, sitemap, redirect behavior) + local source review (`/Meegrowlabs Website`). Items marked **FIXED** were changed in source during this run.

---

## Run conditions

- **Apify MCP is connected and authenticated** (free Store search confirmed live). However, **paid/pay-per-event actors are currently blocked** — the account returns `Too many outstanding invoices`. So the Lighthouse / Core Web Vitals actor could not run. Resolve the Apify billing issue to unlock real CWV, SERP-position, backlink, and competitor data on the next run.
- Direct HTTPS fetches worked this time (the prior run was sandbox-blocked), so all findings below are **observed live**, not estimated.

---

## What changed since the last audit (already in good shape)

- **Sitemap is fully live** — `https://meegrowlabs.com/sitemap.xml` now serves all lessons (was a concern last time).
- **Lesson pages already carry `VideoObject` + `BreadcrumbList` JSON-LD** — the biggest AEO lever from the previous audit is implemented.
- Homepage still prerendered with a real `<h1>`, valid `Organization`/`ProfessionalService` schema, complete OG/Twitter cards, GA4, clean robots.

---

## Fixes applied this run

### 1. Standardized on the non-www host  ✅ FIXED  (was HIGH)
Server canonicalizes on **non-www** (`www` → 301 → `meegrowlabs.com`, confirmed live), but the page signals pointed at `www` — i.e. canonical/OG/JSON-LD were pointing at a URL that redirects, splitting ranking signals and confusing AI crawlers. Changed to non-www in:
- `index.html`: canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD `url`, JSON-LD `logo` (6 refs).
- `public/robots.txt`: `Sitemap:` line.
- `public/sitemap.xml`: homepage `<loc>`, plus **removed a duplicate `/learn` entry** that used `www` *and* the no-trailing-slash form (which itself 301s to `/learn/`). Sitemap is now **154 URLs, 100% non-www, zero duplicates** (validated XML).

### 2. Replaced the favicon & OG image  ✅ FIXED  (was MEDIUM — and worse than reported)
Both `favicon.png` and `og-image.png` were **the same 3024×4968 portrait screenshot of a Dribbble page** (2.4 MB each) — so social shares and the JSON-LD `logo` showed an unrelated designer's mockup, and the favicon was an unreadable scaled-down screenshot. Replaced with purpose-built, on-brand assets in the Zero-to-AI-Hero visual system (cream/ink/green, `>_ MEEGROW LABS` wordmark):
- `og-image.png` → **1200×630, 59.6 KB** (was 2.4 MB).
- `favicon.png` → **512×512, 11.7 KB**, transparent corners (was 2.4 MB).
- ~99.5% lighter on a key LCP/social asset.

### 3. Added a real `llms.txt`  ✅ FIXED  (AEO)
`/llms.txt` previously returned **200 but was the SPA catch-all (`index.html`)** — i.e. it didn't really exist. Added `public/llms.txt` (proper llms.txt markdown: title, summary, curated links to the homepage, the Zero-to-AI-Hero course hub, bilingual playlists, and the blog). Vite copies `public/` to the dist root and Netlify serves real files before the SPA fallback, so this resolves as a true file after deploy.

---

## /learn — completed this run  ✅ FIXED

### 4. Answer-first paragraphs on all 152 lessons  ✅ FIXED  (AEO — top lever)
Lessons were video-only (no prose for AI engines to lift). Added a unique, factually-checked **answer-first paragraph** to every one of the 152 lessons — each opens by directly answering/explaining the lesson topic (e.g. "A file is a named collection of data stored on disk…"; "You move into a folder with the cd command…"). The same text now powers each page's **unique meta description** (previously identical boilerplate on every lesson). Answers live in `public/learn/lesson-answers.json` and are rendered by `scripts/build-learn-pages.mjs`.

### 5. Lesson + course schema  ✅ FIXED
- **`LearningResource`** JSON-LD on all 152 lessons (name, answer as `description`, `inLanguage`, `educationalLevel`, `teaches`, `isPartOf` → the Course). On top of the existing `VideoObject` + `BreadcrumbList`.
- **`FAQPage`** JSON-LD on the **34 question-titled lessons** only (honest Q&A pairs; non-question lessons skip it).
- **`/learn/` hub**: added the missing self-referencing **canonical**, `og:image` + Twitter card, and a **`Course`** JSON-LD (free, bilingual, beginner). All blocks validated as parseable JSON-LD.

---

## Remaining (needs external access / your input)

- **Re-run with Apify billing fixed** to layer in real Core Web Vitals/Lighthouse, SERP positions, backlink/authority, and competitor gap — none of which are guessed here.
- Optional: spot-review a few of the 152 generated answers for tone/voice; they're factually correct but you may want to tweak phrasing on a handful.

---

## Deploy

Changes are in source only (`dist/` is not committed; Netlify builds fresh on push). Deploy via the normal push to `prak-gup/meegrowlabs-website`. After deploy, verify: `curl -sI https://meegrowlabs.com/llms.txt` returns a text/plain file (not HTML), and re-share the homepage to refresh the OG card cache.
