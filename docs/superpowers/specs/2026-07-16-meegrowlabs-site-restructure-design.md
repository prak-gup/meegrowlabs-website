# Design: meegrowlabs.com site restructure

**Date:** 2026-07-16
**Status:** Approved (design), pending implementation plan

Turn meegrowlabs.com from a single-course landing page into the Meegrow Labs
company site: a company home that routes to one service, three products, and the
free course.

---

## 1. Context

### What exists today

| Surface | Built with | Design system |
|---|---|---|
| `/`, `/app`, `/login` | React + Vite + Tailwind, prerendered via `scripts/prerender.tsx` | DM Sans, cream `#f9f7f4`, green `#16a34a` |
| `/learn/` + 154 lesson pages | Static HTML from `scripts/build-learn-pages.mjs` | Archivo Black, cream `#F7F3E9`, green `#13703A` |
| `/privacy/`, `/terms/`, `/data-deletion/`, `/social/` | Hand-authored static HTML in `public/` | Same as `/learn/` |
| `/client/<slug>/` (32) | Generated client shares | — |

Two design systems have drifted apart: **159 files under `public/`** use Archivo
Black / `#F7F3E9` / `#13703A` / neo-brutalist 4px borders + hard offset shadows
(the course pages plus `/privacy/`, `/terms/`, `/data-deletion/`, `/social/`,
`/404.html`), while **3 React routes** use DM Sans / `#f9f7f4` / `#16a34a`. The
static system is the current format by volume and is the one being adopted.

Deployment: Netlify, on push to `main`. Static files are matched before
`_redirects` rules; unknown URLs now serve a real 404 (`public/404.html`).

### Prior art

`/Users/prakhar/Desktop/Meegrow/meegrowlabs-cinematic` contains a locked brand
(`docs/BRAND.md`), a voice guide (`docs/VOICE.md`), a design system
(`DESIGN.md`), and four prototype pages in a dark "Bioluminescent Dark" visual
system.

**Decision:** keep the brand positioning and voice; **retire the dark visual
system**. Voice is visual-independent and represents the bulk of the thinking.

Carried forward from `VOICE.md`:
- Tagline **"Growth, engineered."**; promise **"We make brands impossible to ignore."**
- Thesis: *Search didn't die — it moved. Your customers now ask machines.*
- Outcome-first, second person, active voice, no hedging.
- **Never invent a stat.** "Honest wins, then specific."
- Banned words: *seamless, revolutionary, cutting-edge, leverage, supercharge,
  elevate, unlock, world-class, game-changing, delve, robust, synergy.*

### Product truth (from source, not marketing)

Established by reading the actual repos. This governs page copy.

| Property | What it actually is | Evidence |
|---|---|---|
| **Antidote** | "An AI-powered marketing automation bot that runs as a single Python process. It handles content generation, social media posting, blog publishing, competitor monitoring, and daily intelligence briefings — all orchestrated by an LLM agent that thinks through tools." Telegram interface. Approval gates / HITL. | `antidote-spine-m0-1/README.md` |
| **Antidote Research** | A functional replica of datawiseseo.com — a multi-module AI SEO research suite over the DataForSEO API, plus a "+ Task" work-spine board. Separate repo (`datawise-replica`), deployed 30 Jun. 17 modules. | `datawise-replica/BUILD_BRIEF.md`, `RESEARCH_SUITE_V2.md` |
| **Meegrow Social** | Social media management: schedule, publish, analytics across Facebook Pages, Instagram Business, Google Business Profiles, LinkedIn, YouTube. In active Meta App Review. | `public/social/`, `public/privacy/` |
| **SEO/GEO service** | Done-for-you: SEO · GEO · GBP · AI citability · backlinking. | `BRAND.md` §1 |
| **Learn** | Zero to AI Hero — 150+ free 2-minute lessons, हिंदी & English. | `public/learn/` |

**Honesty constraints — these are hard requirements, not preferences:**

1. Antidote's **AI Visibility and Keywords modules show synthetic data** —
   `NORTH_STAR.md`: *"Honestly Preview-badged (synthetic): AI Visibility,
   Keywords."* These MUST NOT appear in marketing copy.
2. Antidote is **not "autonomous."** Its own docs describe approval gates and
   HITL. Copy says *you approve, it ships*.
3. The research-as-hub / antidote-as-PWA consolidation is a **plan, not shipped**
   (`CONSOLIDATION_PLAN.md`, `STATE.md`). Do not market it as unified.
4. **No self-serve signup exists** anywhere — Clerk sign-in over manually
   provisioned accounts. No pricing, trial, or signup may be implied.

---

## 2. Decisions

| # | Decision | Rationale |
|---|---|---|
| D1 | Cream / neo-brutalist visual system; retire Bioluminescent Dark | 159 pages already use it vs 3; user directive to continue current format |
| D2 | `/` becomes the company home; course consolidates to `/learn/` | `/learn/` already is a "Zero to AI Hero — Free Course" landing; `/` vs `/learn/` currently cannibalize |
| D3 | IA = Services / Products / Learn | Buyer-legible: "hire us" vs "buy the tool" vs "teach me" |
| D4 | New pages = static HTML in `public/`; home stays React | `/` is the SPA shell — `/app` and `/login` fall back to `index.html`, so `/` cannot become a hand-written file |
| D5 | All business CTAs → Tally lead-gen; no pricing/signup | No signup exists in any product |
| D6 | Antidote = the engine; Social = the standalone publishing tool | They overlap on social posting; Social is separately in Meta App Review |
| D7 | Tailwind tokens retuned **site-wide** (incl. `/app`, `/login`) | Ends the two-system drift permanently |

---

## 3. Architecture

### URL map

```
/                 Company home           React, prerendered      REPLACE
/seo-geo/         Service · SEO/GEO      static                  NEW
/antidote/        Product · engine       static                  NEW
/research/        Product · SEO suite    static                  NEW
/social/          Product · publishing   static                  UPGRADE (additive)
/learn/           Course landing         static, generated       UNCHANGED
/privacy/ /terms/ /data-deletion/        static                  UNCHANGED
/404.html                                static                  UNCHANGED
```

No `_redirects` changes needed: every new page is a real static file, and
Netlify matches real files before redirect rules.

### Navigation

`Meegrow Labs · SEO/GEO · Products ▾ · Learn · Blog · [Talk to us →]`

- `Products ▾` uses native `<details>/<summary>` — no JS, keyboard-accessible,
  works on mobile tap. Contains Antidote, Research, Social.
- Research is in the dropdown, not top-level: it is Clerk-gated and invite-only.
- `Blog` → `blog.meegrowlabs.com` (live; already in the current nav).
- Nav and footer markup is duplicated across the static pages. Accepted at this
  page count (D4); revisit with a generator at ~10 pages.

### Design tokens — single source of truth

Extracted to **`public/assets/site.css`**, linked by every static page,
replacing the per-file `<style>` blocks currently duplicated across
`/privacy/`, `/terms/`, `/data-deletion/`, `/social/`.

```
fonts   Archivo Black (display) · Space Grotesk (body) · JetBrains Mono (labels)
color   --bg #F7F3E9 · --bg2 #EFE9D9 · --ink #0F0F0F · --muted #5b5749
        --green #13703A · --accent #D97757 · --line #e4ddc9
form    4px ink borders · hard offset shadows 4/5/10/12px · pills for actions
```

`tailwind.config.js` is retuned to the same values (D7) so the React home and
course app render in one system:

```
display   DM Sans   → Archivo Black
body      DM Sans   → Space Grotesk
cream-100 #f9f7f4   → #F7F3E9
green-600 #16a34a   → #13703A
+ ink #0F0F0F, accent #D97757, line #e4ddc9
```

This restyles `/app` and `/login`. Functionally identical; requires a visual
check before merge.

### Page skeleton (all static pages)

```
nav → hero (mono kicker · outcome-first H1 · lede · CTA)
    → what it does (cards)
    → how it works (steps)
    → CTA band → Tally
    → footer (Services · Products · Learn · Company/Legal)
```

### Homepage structure

```
nav
hero        kicker THE GROWTH LAB FOR THE AI ERA
            h1    We make brands impossible to ignore.
            lede  Search didn't die — it moved. Your customers
                  now ask machines. We make sure you're the answer.
            cta   [Talk to us →] [Take the free course]
router      Services (SEO/GEO) · Products (Antidote, Research, Social) · Learn
course      free-course block — retains course intent on /
cta band    → Tally
footer
```

---

## 4. Page content

Copy is written in the `VOICE.md` voice and grounded in §1 product truth.

**`/seo-geo/`** — SEO · GEO · GBP · AI citability · backlinking. Authoritative,
data-led. Names the engines (ChatGPT, Perplexity, Google AI Overviews). No
invented numbers; claims stay qualitative where we lack data.

**`/antidote/`** — From the README feature set only: content generation, blog
publishing, social posting, competitor monitoring, daily intelligence briefings,
Telegram interface. Framed **"you approve, it ships."** **Omits AI Visibility and
Keywords entirely** (synthetic). Invite-only; CTA → Tally.

**`/research/`** — DataForSEO-backed SEO research suite. Real modules only:
keywords, backlinks, site audit, rank tracking, local SEO, schema, SXO. The
"+ Task" work-spine board is the differentiator. Invite-only; CTA → Tally.

**`/social/`** — Upgraded to the full page skeleton. **Additive only:** the Meta
and YouTube sections, and the links to `/privacy/`, `/terms/`, `/data-deletion/`,
are preserved verbatim. This page is live evidence in an active Meta App Review.

**`/learn/`** — Unchanged. Receives the course intent from `/`.

---

## 5. SEO / GEO

- Unique `<title>`, meta description, and canonical per page.
- Schema (JSON-LD): `Organization` + `sameAs` on `/`; `Service` on `/seo-geo/`;
  `SoftwareApplication` on `/antidote/`, `/research/`, `/social/`.
- `public/sitemap.xml`: `/` and `/learn/` are already listed. **Add** `/seo-geo/`,
  `/antidote/`, `/research/`, `/social/`. Legal pages stay out, matching the
  existing convention (`/privacy/` and `/social/` are absent today).
- `public/llms.txt`: update to list the new pages. This is the GEO play and is
  on-thesis for what the site sells.
- Internal links: home → every page; every page → related + Learn.
- All pages static or prerendered — no JS dependency for crawlers.
- `robots.txt` needs no change (`Disallow: /client/` stays).

**Accepted risk:** `/` stops targeting "Zero to AI Hero" and `/learn/` inherits
it. Expect a ranking shuffle for a few weeks. Mitigated because `/learn/` already
exists and already targets those terms — this resolves an existing
cannibalization rather than creating a new risk. Watch Search Console after
deploy.

---

## 6. Out of scope

- Per-page OG images (`/og-image.png` is reused; follow-up).
- Converting `/learn/`'s 159 pages to the shared `site.css`.
- A nav/footer generator (revisit at ~10 pages).
- Any change to `/privacy/`, `/terms/`, `/data-deletion/`.
- Reviving the dark visual system, `blog.meegrowlabs.com`, or the
  research/antidote consolidation.

---

## 7. Verification

1. `npm run build` succeeds; `/assets/site.css` is emitted to `dist/`.
2. `netlify dev --dir dist` — full route matrix: the 5 new/changed pages 200 and
   serve distinct bodies (md5); `/app`, `/app/*`, `/login` still serve the SPA
   shell; unknown URLs still 404; `/postiz/*` still 301; the subscribe function
   still responds.
3. `/social/` still contains the Meta section, the seven permission strings, the
   YouTube section, and links to all three legal pages.
4. `/privacy/`, `/terms/`, `/data-deletion/` are byte-identical to before.
5. Visual check of `/app` and `/login` after the token retune.
6. Copy audit against `VOICE.md` §10: no banned words, no invented stats, no
   synthetic Antidote features, "autonomous" absent.
