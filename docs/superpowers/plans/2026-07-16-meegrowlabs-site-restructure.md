# Meegrow Labs Site Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn meegrowlabs.com from a single-course landing page into the Meegrow Labs company site — a company home routing to one service, three products, and the free course — in one unified design system.

**Architecture:** New service/product pages are hand-authored static HTML in `public/`, sharing one `public/assets/site.css`. The homepage stays React + prerendered (it cannot become a static file — `/` is the SPA shell that `/app` and `/login` fall back to via `_redirects`). `tailwind.config.js` is retuned so the React surfaces render in the same Archivo Black / cream system as the 159 existing static pages.

**Tech Stack:** Vite 5, React 18, TypeScript, Tailwind 3, static HTML, Netlify (deploy on push to `main`), `netlify dev` for local route verification.

**Spec:** `docs/superpowers/specs/2026-07-16-meegrowlabs-site-restructure-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

**Copy / honesty (from `meegrowlabs-cinematic/docs/VOICE.md` and product source):**
- Tagline **"Growth, engineered."** Promise: **"We make brands impossible to ignore."**
- Thesis: *Search didn't die — it moved. Your customers now ask machines.*
- Outcome-first, second person, active voice, no hedging. Sentence case except mono kickers (UPPERCASE, wide-tracked).
- **Never invent a stat.** If we don't have the number, make the claim qualitative and true. "Honest wins, then specific."
- **Banned words:** seamless, revolutionary, cutting-edge, leverage, synergy, robust, world-class, game-changing, unlock, supercharge, elevate, delve, holistic, best-in-class, next-gen, disrupt.
- **The word "autonomous" must not appear** anywhere describing Antidote. Its docs describe approval gates / HITL. Frame as *"you approve, it ships."*
- **Antidote's "AI Visibility" and "Keywords" modules must not appear in any copy.** `NORTH_STAR.md`: *"Honestly Preview-badged (synthetic): AI Visibility, Keywords."*
- **No pricing, no trial, no self-serve signup may be implied** anywhere. No signup exists — Clerk sign-in over manually provisioned accounts.
- Do not claim the research/antidote consolidation is shipped. It is a plan.
- All business CTAs → `https://tally.so/r/444qZ5`.

**Design tokens (canonical — the existing static system):**
```
fonts   Archivo Black (display) · Space Grotesk (body) · JetBrains Mono (labels)
color   --bg #F7F3E9 · --bg2 #EFE9D9 · --ink #0F0F0F · --muted #5b5749
        --green #13703A · --accent #D97757 · --line #e4ddc9
form    4px ink borders · hard offset shadows 4/5/10/12px · pills for actions
```

**Must not break:**
- `/privacy/`, `/terms/`, `/data-deletion/` must remain **byte-identical**. Live evidence in an active Meta App Review.
- `/social/` changes are **additive only**: the Meta section (all seven permission strings), the YouTube section, and links to all three legal pages must survive verbatim.
- `/app`, `/app/*`, `/login` must keep serving the SPA shell (`index.html`).
- Unknown URLs must keep returning 404; `/postiz/*` must keep returning 301; `/.netlify/functions/subscribe` must keep responding.

**Archivo Black is a single-weight (400) family.** Applying `font-bold` to it triggers synthetic faux-bold, which smears an already-heavy face. `font-display` and `font-bold` must never co-occur after Task 1.

---

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `tailwind.config.js` | Canonical palette + font stacks for all React surfaces | 1 |
| `index.html` | Font loading, home `<title>`/meta/canonical/OG, Organization schema | 1, 3 |
| `src/**/*.tsx` (30 sites) | Strip `font-bold` beside `font-display` | 1 |
| `public/assets/site.css` | Shared tokens + components for new static pages | 2 |
| `src/components/SiteNav.tsx` | Company nav (Products `<details>` dropdown) | 3 |
| `src/components/SiteFooter.tsx` | Company footer (4 columns) | 3 |
| `src/components/CompanyHome.tsx` | Hero + router + course block + CTA | 3 |
| `src/App.tsx` | Route `/` → `CompanyHome` | 3 |
| `public/seo-geo/index.html` | Service page | 4 |
| `public/antidote/index.html` | Product page | 5 |
| `public/research/index.html` | Product page | 6 |
| `public/social/index.html` | Product page (upgrade, additive) | 7 |
| `public/sitemap.xml`, `public/llms.txt` | Discovery for search + AI engines | 8 |

---

## Task 1: Retune tokens and fonts site-wide

Ends the two-system drift. After this, React surfaces render in the same system as the 159 static pages.

**Files:**
- Modify: `tailwind.config.js`
- Modify: `index.html:43-53` (font links)
- Modify: 30 sites across `src/**/*.tsx` (`font-display font-bold` → `font-display`)

**Interfaces:**
- Produces: Tailwind classes `font-display` (Archivo Black), `font-body`/`font-mono`, `cream-{50,100,200,300}`, `green-{50,100,600,700,800}`, `slate-{200,400,500,600,700,800,900}`, `mustard-{400,500}`, `accent-500`. Tasks 3+ consume these.

- [ ] **Step 1: Capture a visual baseline of `/app` before the retune**

```bash
cd "/Users/prakhar/Desktop/Meegrow/Meegrowlabs Website"
npm run build
(netlify dev --dir dist --port 8888 --offline > /tmp/ntl.log 2>&1 &)
sleep 6
curl -s http://localhost:8888/login | grep -o 'assets/index-[A-Za-z0-9_-]*\.css'
```
Expected: prints the CSS bundle name. Note it — the name must CHANGE after the retune (proves tokens rebuilt).

- [ ] **Step 2: Rewrite the Tailwind theme**

Replace the `theme.extend` block in `tailwind.config.js` with:

```js
    extend: {
      fontFamily: {
        display: ['Archivo Black', 'system-ui', 'sans-serif'],
        body: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Canonical static-system palette. Keep in sync with public/assets/site.css.
        cream: {
          50:  '#FDFCF8',
          100: '#F7F3E9', // --bg
          200: '#EFE9D9', // --bg2
          300: '#e4ddc9', // --line
        },
        green: {
          50:  '#E8F3EC',
          100: '#C9E3D3',
          600: '#13703A', // --green
          700: '#0E5429', // darker than 600 — hover states depend on this
          800: '#0A3D1E',
        },
        slate: {
          200: '#e4ddc9', // --line (borders)
          400: '#8a8577',
          500: '#6f6a5c',
          600: '#5b5749', // --muted
          700: '#3a372f',
          800: '#23211c',
          900: '#0F0F0F', // --ink
        },
        sage: {
          200: '#e4ddc9',
          400: '#7aab96',
          500: '#5a9178',
        },
        mustard: {
          400: '#F5C518',
          500: '#D9A400',
        },
        accent: {
          500: '#D97757', // --accent
        },
      },
      animation: { 'fade-in': 'fadeIn 0.6s ease-out' },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
```

Why `green-700` is defined: it is used 25 times (mostly `hover:bg-green-700`) but was previously Tailwind's default `#15803d`, which is **lighter** than the new `green-600` `#13703A`. Without this, every button would brighten on hover.

- [ ] **Step 3: Swap the font loading in `index.html`**

Replace lines 45-53 (the two DM Sans `<link>` tags) with:

```html
    <link
      rel="preload"
      as="style"
      href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
```

This matches the font URL the static pages already use, so the browser reuses the cached stylesheet across the site.

- [ ] **Step 4: Strip faux-bold — remove `font-bold` wherever it sits beside `font-display`**

```bash
cd "/Users/prakhar/Desktop/Meegrow/Meegrowlabs Website"
grep -rl "font-display font-bold\|font-bold font-display" src/ \
  | xargs sed -i '' -e 's/font-display font-bold/font-display/g' -e 's/font-bold font-display/font-display/g'
grep -rn "font-display font-bold\|font-bold font-display" src/ | wc -l | tr -d ' '
```
Expected: `0`

- [ ] **Step 5: Verify the CSS bundle changed and nothing broke**

```bash
pkill -f "netlify dev"; npm run build 2>&1 | tail -3
```
Expected: build succeeds, `✅ Injected prerendered landing page HTML`.

```bash
grep -c "Archivo Black" dist/assets/index-*.css
```
Expected: `1` or more (the font stack is compiled in).

- [ ] **Step 6: Visually check `/app` and `/login` — the retune restyles them**

```bash
(netlify dev --dir dist --port 8888 --offline > /tmp/ntl.log 2>&1 &)
sleep 6
for p in / /login /app; do printf "%-8s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8888$p)"; done
```
Expected: all `200`.

Then open `http://localhost:8888/login` in a browser and confirm: headings render in Archivo Black (heavy, not smeared), background is warm cream `#F7F3E9`, the Sign in button is dark green `#13703A` and gets **darker** (not lighter) on hover. `/app` requires auth; checking `/login` is sufficient for the token verification.

- [ ] **Step 7: Commit**

```bash
pkill -f "netlify dev"
git add tailwind.config.js index.html src/
git commit -m "Retune design tokens to the static system site-wide

The React surfaces (/, /app, /login) used DM Sans / #f9f7f4 / #16a34a while
the 159 static pages used Archivo Black / #F7F3E9 / #13703A. Adopt the
static system as canonical so the whole site is one design.

Define green-700 explicitly: it is used 25 times as a hover state but
resolved to Tailwind's default #15803d, which is lighter than the new
green-600 #13703A — every button would have brightened on hover.

Archivo Black ships a single 400 weight, so drop font-bold wherever it sat
beside font-display (30 sites) to avoid synthetic faux-bold."
```

---

## Task 2: Extract the shared stylesheet

**Files:**
- Create: `public/assets/site.css`

**Interfaces:**
- Produces: CSS custom properties `--bg --bg2 --ink --muted --accent --green --line`, and classes `.wrap .site-nav .kicker .btn .btn-primary .btn-ghost .card .grid .cta .site-footer`. Tasks 4-7 consume these via `<link rel="stylesheet" href="/assets/site.css">`.

**Note:** `/privacy/`, `/terms/`, `/data-deletion/` keep their inline styles and are NOT migrated — they must stay byte-identical (see Global Constraints).

- [ ] **Step 1: Create `public/assets/site.css`**

```css
/* Meegrow Labs — shared site styles.
   Canonical tokens; keep in sync with tailwind.config.js.
   Used by /seo-geo/, /antidote/, /research/, /social/.
   NOT used by /privacy/, /terms/, /data-deletion/ — those keep inline
   styles because they are live evidence in an active Meta App Review. */
:root{
  --bg:#F7F3E9; --bg2:#EFE9D9; --ink:#0F0F0F; --muted:#5b5749;
  --accent:#D97757; --green:#13703A; --line:#e4ddc9; --yellow:#F5C518;
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);
  font-family:'Space Grotesk',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  line-height:1.65;-webkit-font-smoothing:antialiased}
.wrap{max-width:1100px;margin:0 auto;padding:0 22px}

/* Nav */
.site-nav{border-bottom:4px solid var(--ink);background:var(--bg);position:sticky;top:0;z-index:50}
.site-nav .inner{max-width:1100px;margin:0 auto;padding:14px 22px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.site-nav a{color:var(--ink);text-decoration:none}
.site-nav .logo{font-family:'Archivo Black',sans-serif;font-size:19px;letter-spacing:-.5px}
.site-nav .links{display:flex;align-items:center;gap:20px;font-weight:600;font-size:15px}
.site-nav .links a:hover{color:var(--green)}
.site-nav details{position:relative}
.site-nav summary{cursor:pointer;list-style:none;font-weight:600}
.site-nav summary::-webkit-details-marker{display:none}
.site-nav details[open] summary{color:var(--green)}
.site-nav .menu{position:absolute;top:30px;left:-14px;background:var(--bg);
  border:3px solid var(--ink);border-radius:12px;box-shadow:5px 5px 0 var(--ink);
  padding:8px;min-width:190px;display:flex;flex-direction:column;gap:2px}
.site-nav .menu a{padding:8px 12px;border-radius:8px;font-size:15px}
.site-nav .menu a:hover{background:var(--bg2)}
@media(max-width:860px){.site-nav .links{gap:12px;font-size:14px}.site-nav .hide-sm{display:none}}

/* Type */
.kicker{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;
  text-transform:uppercase;letter-spacing:.22em;color:var(--green);margin:0 0 14px}
h1{font-family:'Archivo Black',sans-serif;font-size:clamp(38px,7vw,76px);line-height:.95;
  letter-spacing:-1.5px;margin:0 0 18px}
h2{font-family:'Archivo Black',sans-serif;font-size:clamp(26px,3.6vw,40px);line-height:1.05;
  letter-spacing:-1px;margin:0 0 14px}
h3{font-size:18px;margin:0 0 6px;font-weight:700}
p,li{font-size:16.5px;color:#23211c}
.lede{font-size:clamp(17px,1.6vw,20px);max-width:600px}
section{padding:clamp(48px,7vw,86px) 0}
a{color:var(--accent);text-underline-offset:2px}

/* Buttons */
.btn{display:inline-block;font-weight:700;font-size:16px;padding:14px 26px;border-radius:10px;
  border:3px solid var(--ink);text-decoration:none;transition:transform .12s,box-shadow .12s}
.btn-primary{background:var(--green);color:#fff;box-shadow:5px 5px 0 var(--ink)}
.btn-ghost{background:var(--bg);color:var(--ink);box-shadow:5px 5px 0 var(--ink)}
.btn:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 var(--ink)}
.btn:active{transform:translate(2px,2px);box-shadow:2px 2px 0 var(--ink)}

/* Surfaces */
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}
.card{background:var(--bg2);border:3px solid var(--ink);border-radius:14px;padding:20px 22px;
  box-shadow:5px 5px 0 var(--ink)}
.card p{margin:0;font-size:15px;color:var(--muted)}
.badge{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;
  text-transform:uppercase;letter-spacing:.1em;padding:3px 9px;border-radius:999px;
  border:2px solid var(--ink);background:var(--yellow)}
.steps{counter-reset:s;list-style:none;padding:0}
.steps li{counter-increment:s;position:relative;padding-left:46px;margin-bottom:16px}
.steps li::before{content:counter(s,decimal-leading-zero);position:absolute;left:0;top:0;
  font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--green);
  border:2px solid var(--ink);border-radius:50%;width:30px;height:30px;
  display:flex;align-items:center;justify-content:center;font-size:12px;background:var(--bg)}
.cta{background:var(--ink);color:var(--bg);border-radius:20px;padding:clamp(32px,5vw,56px);text-align:center}
.cta h2{color:var(--bg)}
.cta p{color:#c9c4b6}

/* Footer */
.site-footer{border-top:4px solid var(--ink);background:var(--bg2);margin-top:40px}
.site-footer .inner{max-width:1100px;margin:0 auto;padding:44px 22px;
  display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:28px}
.site-footer h4{font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;
  letter-spacing:.18em;color:var(--muted);margin:0 0 10px}
.site-footer a{display:block;color:var(--ink);text-decoration:none;font-size:15px;padding:3px 0}
.site-footer a:hover{color:var(--green)}
.site-footer .base{border-top:2px solid var(--line);padding:16px 22px;max-width:1100px;margin:0 auto;
  font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--muted)}
```

- [ ] **Step 2: Verify it ships to `dist/`**

```bash
cd "/Users/prakhar/Desktop/Meegrow/Meegrowlabs Website"
npm run build 2>&1 | tail -2 && ls -l dist/assets/site.css
```
Expected: the file exists in `dist/assets/`.

- [ ] **Step 3: Commit**

```bash
git add public/assets/site.css
git commit -m "Add shared site.css for the new static marketing pages

One stylesheet for /seo-geo/, /antidote/, /research/ and /social/ instead
of duplicating a <style> block per page. The legal pages keep their inline
styles — they must stay byte-identical during Meta App Review."
```

---

## Task 3: Company home

Replaces the course landing at `/`. The course keeps a nav slot, a homepage block, and `/learn/`.

**Files:**
- Create: `src/components/SiteNav.tsx`
- Create: `src/components/SiteFooter.tsx`
- Create: `src/components/CompanyHome.tsx`
- Modify: `src/App.tsx`
- Modify: `index.html` (title, description, OG, schema)

**Interfaces:**
- Consumes: Tailwind tokens from Task 1.
- Produces: `<SiteNav />`, `<SiteFooter />` (default exports, no props) — reused if the home is ever split further.

- [ ] **Step 1: Create `src/components/SiteNav.tsx`**

```tsx
const TALLY = 'https://tally.so/r/444qZ5'

export default function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b-4 border-slate-900 bg-cream-100">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
        <a href="/" className="font-display text-lg text-slate-900">Meegrow Labs</a>
        <div className="flex items-center gap-5 text-[15px] font-semibold">
          <a href="/seo-geo/" className="hidden sm:inline text-slate-900 hover:text-green-600">SEO/GEO</a>
          <details className="relative group">
            <summary className="cursor-pointer list-none text-slate-900 hover:text-green-600 marker:hidden">
              Products
            </summary>
            <div className="absolute top-8 -left-3 flex flex-col gap-0.5 min-w-[190px] rounded-xl border-[3px] border-slate-900 bg-cream-100 p-2 shadow-[5px_5px_0_#0F0F0F]">
              <a href="/antidote/" className="rounded-lg px-3 py-2 text-slate-900 hover:bg-cream-200">Antidote</a>
              <a href="/research/" className="rounded-lg px-3 py-2 text-slate-900 hover:bg-cream-200">Research</a>
              <a href="/social/" className="rounded-lg px-3 py-2 text-slate-900 hover:bg-cream-200">Social</a>
            </div>
          </details>
          <a href="/learn/" className="text-slate-900 hover:text-green-600">Learn</a>
          <a href="https://blog.meegrowlabs.com" className="hidden sm:inline text-slate-900 hover:text-green-600">Blog</a>
          <a href={TALLY} target="_blank" rel="noopener noreferrer"
             className="rounded-lg border-[3px] border-slate-900 bg-green-600 px-4 py-2 text-white shadow-[4px_4px_0_#0F0F0F] hover:bg-green-700">
            Talk to us
          </a>
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Create `src/components/SiteFooter.tsx`**

```tsx
const TALLY = 'https://tally.so/r/444qZ5'

const COLS = [
  { head: 'Services', links: [['SEO / GEO', '/seo-geo/']] },
  { head: 'Products', links: [['Antidote', '/antidote/'], ['Antidote Research', '/research/'], ['Meegrow Social', '/social/']] },
  { head: 'Learn', links: [['Zero to AI Hero', '/learn/'], ['Blog', 'https://blog.meegrowlabs.com']] },
  { head: 'Company', links: [['Talk to us', TALLY], ['Privacy Policy', '/privacy/'], ['Terms of Service', '/terms/'], ['Data Deletion', '/data-deletion/']] },
]

export default function SiteFooter() {
  return (
    <footer className="mt-10 border-t-4 border-slate-900 bg-cream-200">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-7 px-5 py-11">
        {COLS.map((c) => (
          <div key={c.head}>
            <h4 className="font-mono text-[11px] uppercase tracking-[.18em] text-slate-600 mb-2.5">{c.head}</h4>
            {c.links.map(([label, href]) => (
              <a key={label} href={href} className="block py-0.5 text-[15px] text-slate-900 hover:text-green-600">{label}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t-2 border-cream-300">
        <div className="max-w-6xl mx-auto px-5 py-4 font-mono text-xs text-slate-600">
          © 2026 Meegrow Labs · Growth, engineered. · prakhar@meegrowlabs.com
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Create `src/components/CompanyHome.tsx`**

Copy is grounded in the spec's product-truth table. Note what is absent: no "autonomous", no Antidote AI-Visibility/Keywords, no stats, no pricing.

```tsx
import SiteNav from './SiteNav'
import SiteFooter from './SiteFooter'

const TALLY = 'https://tally.so/r/444qZ5'

const ROUTES = [
  {
    head: 'Services', tag: 'WE DO IT FOR YOU',
    items: [{
      name: 'SEO / GEO', href: '/seo-geo/',
      blurb: 'Search moved to the machines. We make sure ChatGPT, Perplexity, and Google cite you — not your competitor. SEO, GEO, Google Business Profile, AI citability, backlinks.',
    }],
  },
  {
    head: 'Products', tag: 'SOFTWARE WE BUILT',
    items: [
      { name: 'Antidote', href: '/antidote/', blurb: 'The marketing engine. It drafts content, publishes blogs and social posts, watches competitors, and briefs you every morning. You approve, it ships.' },
      { name: 'Antidote Research', href: '/research/', blurb: 'The SEO research suite. Keywords, backlinks, site audits, rank tracking, local SEO, schema — every result turns into a task on your board.' },
      { name: 'Meegrow Social', href: '/social/', blurb: 'Plan, schedule, publish, and measure — across Facebook, Instagram, Google Business Profiles, LinkedIn, and YouTube, from one calendar.' },
    ],
  },
  {
    head: 'Learn', tag: 'FREE, FOREVER',
    items: [{
      name: 'Zero to AI Hero', href: '/learn/',
      blurb: '150+ free 2-minute lessons in हिंदी & English. From "what’s a file?" to Claude Code and AI agents. No degree. No jargon.',
    }],
  },
]

export default function CompanyHome() {
  return (
    <div className="min-h-screen bg-cream-100">
      <SiteNav />

      {/* Hero */}
      <section className="px-5 pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs font-bold uppercase tracking-[.22em] text-green-600">
            The growth lab for the AI era
          </p>
          <h1 className="mt-3.5 font-display text-[clamp(38px,7vw,76px)] leading-[.95] tracking-[-1.5px] text-slate-900 max-w-4xl">
            We make brands impossible to ignore.
          </h1>
          <p className="mt-5 max-w-2xl text-lg md:text-xl text-slate-700">
            Search didn’t die — it moved. Your customers now ask machines.
            We make sure you’re the answer they get.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a href={TALLY} target="_blank" rel="noopener noreferrer"
               className="rounded-lg border-[3px] border-slate-900 bg-green-600 px-7 py-3.5 text-center font-bold text-white shadow-[5px_5px_0_#0F0F0F] hover:bg-green-700">
              Talk to us →
            </a>
            <a href="/learn/"
               className="rounded-lg border-[3px] border-slate-900 bg-cream-100 px-7 py-3.5 text-center font-bold text-slate-900 shadow-[5px_5px_0_#0F0F0F] hover:bg-cream-200">
              Take the free course
            </a>
          </div>
        </div>
      </section>

      {/* Router */}
      <section className="px-5 pb-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {ROUTES.map((group) => (
            <div key={group.head}>
              <div className="flex items-baseline gap-3 border-b-[3px] border-slate-900 pb-2.5">
                <h2 className="font-display text-2xl text-slate-900">{group.head}</h2>
                <span className="font-mono text-[11px] uppercase tracking-[.18em] text-slate-600">{group.tag}</span>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {group.items.map((it) => (
                  <a key={it.name} href={it.href}
                     className="block rounded-2xl border-[3px] border-slate-900 bg-cream-200 p-5 shadow-[5px_5px_0_#0F0F0F] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#0F0F0F]">
                    <div className="font-display text-lg text-slate-900">{it.name}</div>
                    <p className="mt-2 text-[15px] text-slate-600">{it.blurb}</p>
                    <span className="mt-3 inline-block font-semibold text-green-600">Learn more →</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16">
        <div className="max-w-6xl mx-auto rounded-3xl bg-slate-900 px-6 py-14 text-center md:py-16">
          <h2 className="font-display text-[clamp(26px,3.6vw,40px)] leading-tight text-cream-100">
            Let’s make you impossible to ignore.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-cream-300">
            Tell us what you sell and who you sell it to. We’ll tell you where you’re invisible.
          </p>
          <a href={TALLY} target="_blank" rel="noopener noreferrer"
             className="mt-7 inline-block rounded-lg border-[3px] border-cream-100 bg-green-600 px-8 py-3.5 font-bold text-white hover:bg-green-700">
            Talk to us →
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
```

- [ ] **Step 4: Route `/` to it in `src/App.tsx`**

Replace the landing branch. The final file:

```tsx
import { Suspense, lazy } from 'react'

import CompanyHome from './components/CompanyHome'

// Gated course platform (client-only; landing stays prerendered for SEO).
const CourseApp = lazy(() => import('./app/CourseApp'))
const Login = lazy(() => import('./pages/Login'))

function App() {
  const raw = typeof window !== 'undefined' ? window.location.pathname : '/'
  // /login/ and /app/ are routed to index.html too — treat them as /login and /app.
  const path = raw.length > 1 ? raw.replace(/\/+$/, '') : raw
  if (path === '/login') {
    return <Suspense fallback={null}><Login /></Suspense>
  }
  if (path.startsWith('/app')) {
    return <Suspense fallback={null}><CourseApp /></Suspense>
  }
  return <CompanyHome />
}

export default App
```

Note: `Navigation`, `Hero`, `CourseSections`, `FAQ`, `FinalCTA` are no longer imported by `App`. Leave the files in place — `/learn/` and the course pages are unaffected and the components may be reused. Do not delete them in this task.

- [ ] **Step 5: Update `index.html` head for the company home**

Replace the `<title>` (line 42) and the description/OG block (lines 9-30ish) so `/` no longer targets the course. Set:

```html
    <title>Meegrow Labs — Growth, engineered.</title>
```

Description, OG and Twitter copy (replace the existing "Zero to AI Hero" values):
```
description   Search didn't die — it moved. Meegrow Labs makes sure ChatGPT, Perplexity and Google cite you. SEO/GEO services, Antidote, Antidote Research, Meegrow Social, and a free AI course.
og:title      Meegrow Labs — Growth, engineered.
og:description  We make brands impossible to ignore. SEO/GEO, marketing automation, and a free AI course in हिंदी & English.
twitter:title   Meegrow Labs — Growth, engineered.
twitter:description  We make brands impossible to ignore.
```
Leave `og:url`, `og:image`, `canonical`, and the gtag block exactly as they are.

- [ ] **Step 6: Refresh the Organization schema in `index.html`**

The existing block says `"serviceType": "AI workflow automation studio"`, which no longer matches the positioning. Replace the JSON-LD block (lines 54-77) with:

```html
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": ["Organization", "ProfessionalService"],
        "name": "Meegrow Labs",
        "url": "https://meegrowlabs.com/",
        "logo": "https://meegrowlabs.com/og-image.png",
        "slogan": "Growth, engineered.",
        "description": "Meegrow Labs is an AI growth company: SEO/GEO services, marketing automation software, and a free AI course.",
        "sameAs": ["https://www.linkedin.com/company/meegrowlabs/"],
        "areaServed": "Global",
        "email": "prakhar@meegrowlabs.com",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "sales",
          "email": "prakhar@meegrowlabs.com",
          "url": "https://tally.so/r/444qZ5"
        }
      }
    </script>
```

- [ ] **Step 7: Build and verify the home prerenders**

```bash
cd "/Users/prakhar/Desktop/Meegrow/Meegrowlabs Website"
npm run build 2>&1 | tail -2
grep -c "impossible to ignore" dist/index.html
```
Expected: build succeeds; grep returns `1` or more — proving the home is in the **prerendered** HTML, not JS-only.

- [ ] **Step 8: Verify SPA routes still work**

```bash
(netlify dev --dir dist --port 8888 --offline > /tmp/ntl.log 2>&1 &)
sleep 6
for p in / /app /app/ /login /login/ /learn/ /privacy/ /terms/ /data-deletion/; do
  printf "  %-16s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8888$p)"; done
printf "  %-16s %s\n" "/unknown-xyz/" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8888/unknown-xyz/)"
```
Expected: all listed paths `200`; `/unknown-xyz/` is `404`.

- [ ] **Step 9: Confirm the legal pages are untouched**

```bash
git status --short public/privacy/ public/terms/ public/data-deletion/
```
Expected: **no output** (byte-identical, unmodified).

- [ ] **Step 10: Commit**

```bash
pkill -f "netlify dev"
git add src/ index.html
git commit -m "Make / the company home; course consolidates to /learn/

/ was a second 'Zero to AI Hero' landing page competing with /learn/, which
already targets those keywords. / now routes to the company: SEO/GEO
service, Antidote, Antidote Research, Meegrow Social, and the free course.

Copy follows VOICE.md and is grounded in what the product repos actually
say: Antidote is 'you approve, it ships' (its docs describe approval
gates), and its synthetic AI Visibility/Keywords modules are omitted.

Also refresh the Organization schema, which still described the company as
an 'AI workflow automation studio'."
```

---

## Task 4: `/seo-geo/` — the service page

**Files:**
- Create: `public/seo-geo/index.html`

**Interfaces:**
- Consumes: `/assets/site.css` from Task 2 (`.wrap .site-nav .kicker .btn .card .steps .cta .site-footer`).
- Produces: the nav + footer markup that Tasks 5-7 copy verbatim.

- [ ] **Step 1: Create `public/seo-geo/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-PCZK96MECF"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-PCZK96MECF');
</script>
<title>SEO &amp; GEO — Be the answer the machines give | Meegrow Labs</title>
<meta name="description" content="Search moved to the machines. We make sure ChatGPT, Perplexity and Google AI Overviews cite you — not your competitor. SEO, GEO, Google Business Profile, AI citability and backlinks.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://meegrowlabs.com/seo-geo/">
<link rel="icon" href="/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Service","name":"SEO & GEO","serviceType":"Search and Generative Engine Optimization","provider":{"@type":"Organization","name":"Meegrow Labs","url":"https://meegrowlabs.com/"},"areaServed":"Global","url":"https://meegrowlabs.com/seo-geo/","description":"SEO, GEO, Google Business Profile, AI citability and backlinks — so AI engines cite you."}
</script>
</head>
<body>

<nav class="site-nav">
  <div class="inner">
    <a href="/" class="logo">Meegrow&nbsp;Labs</a>
    <div class="links">
      <a href="/seo-geo/" class="hide-sm">SEO/GEO</a>
      <details>
        <summary>Products</summary>
        <div class="menu">
          <a href="/antidote/">Antidote</a>
          <a href="/research/">Research</a>
          <a href="/social/">Social</a>
        </div>
      </details>
      <a href="/learn/">Learn</a>
      <a href="https://blog.meegrowlabs.com" class="hide-sm">Blog</a>
      <a href="https://tally.so/r/444qZ5" class="btn btn-primary" style="padding:9px 16px;font-size:15px">Talk to us</a>
    </div>
  </div>
</nav>

<section>
  <div class="wrap">
    <p class="kicker">Service · SEO · GEO · GBP</p>
    <h1>Be the answer the machines give.</h1>
    <p class="lede">Search didn’t die — it moved. Your customers ask ChatGPT, Perplexity and Google AI Overviews now. We make sure those answers name you.</p>
    <p style="margin-top:26px"><a href="https://tally.so/r/444qZ5" class="btn btn-primary">Talk to us →</a></p>
  </div>
</section>

<section style="background:var(--bg2);border-top:4px solid var(--ink);border-bottom:4px solid var(--ink)">
  <div class="wrap">
    <h2>What we do</h2>
    <div class="grid" style="margin-top:22px">
      <div class="card" style="background:var(--bg)"><h3>SEO</h3><p>The classic engine. Technical health, content that deserves to rank, and the internal structure that makes it legible.</p></div>
      <div class="card" style="background:var(--bg)"><h3>GEO</h3><p>Generative Engine Optimization. We shape your content so AI engines can quote it — structure, claims, and citability.</p></div>
      <div class="card" style="background:var(--bg)"><h3>Google Business Profile</h3><p>For businesses with a map pin. Categories, posts, reviews and the local signals that decide who shows up.</p></div>
      <div class="card" style="background:var(--bg)"><h3>AI citability</h3><p>We check what ChatGPT and Perplexity actually say about you today, then close the gap between that and the truth.</p></div>
      <div class="card" style="background:var(--bg)"><h3>Backlinks</h3><p>Earned links from places that matter. No link farms, no schemes — the kind that survive an algorithm update.</p></div>
      <div class="card" style="background:var(--bg)"><h3>Schema &amp; structure</h3><p>Structured data that tells engines exactly what you are, so they don’t have to guess.</p></div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <h2>How we work</h2>
    <ol class="steps" style="margin-top:22px;max-width:620px">
      <li><strong>We read the scoreboard.</strong> Where do you rank, what do the AI engines say about you, and who are they citing instead?</li>
      <li><strong>We name the gap.</strong> You get the specific pages, claims and signals that are costing you the answer.</li>
      <li><strong>We fix it.</strong> Content, structure, schema, profile, links — in the order that moves the needle first.</li>
      <li><strong>We show the before and after.</strong> You see what changed, on the engines that matter.</li>
    </ol>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="cta">
      <h2>Find out where you’re invisible.</h2>
      <p>Tell us what you sell and who you sell it to. We’ll show you what the machines say about you today.</p>
      <p style="margin-top:22px"><a href="https://tally.so/r/444qZ5" class="btn btn-primary">Talk to us →</a></p>
    </div>
  </div>
</section>

<footer class="site-footer">
  <div class="inner">
    <div><h4>Services</h4><a href="/seo-geo/">SEO / GEO</a></div>
    <div><h4>Products</h4><a href="/antidote/">Antidote</a><a href="/research/">Antidote Research</a><a href="/social/">Meegrow Social</a></div>
    <div><h4>Learn</h4><a href="/learn/">Zero to AI Hero</a><a href="https://blog.meegrowlabs.com">Blog</a></div>
    <div><h4>Company</h4><a href="https://tally.so/r/444qZ5">Talk to us</a><a href="/privacy/">Privacy Policy</a><a href="/terms/">Terms of Service</a><a href="/data-deletion/">Data Deletion</a></div>
  </div>
  <div class="base">© 2026 Meegrow Labs · Growth, engineered. · prakhar@meegrowlabs.com</div>
</footer>
</body>
</html>
```

- [ ] **Step 2: Verify it builds, routes, and is distinct from the home**

```bash
cd "/Users/prakhar/Desktop/Meegrow/Meegrowlabs Website"
npm run build 2>&1 | tail -2
pkill -f "netlify dev"; (netlify dev --dir dist --port 8888 --offline > /tmp/ntl.log 2>&1 &)
sleep 6
echo "seo-geo: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8888/seo-geo/)"
echo "  md5 home:    $(curl -s http://localhost:8888/ | md5)"
echo "  md5 seo-geo: $(curl -s http://localhost:8888/seo-geo/ | md5)"
```
Expected: `200`, and the two md5s **differ**.

- [ ] **Step 3: Copy audit against VOICE.md**

```bash
for w in seamless revolutionary cutting-edge leverage supercharge elevate world-class game-changing delve synergy robust holistic autonomous; do
  grep -qi "$w" public/seo-geo/index.html && echo "  BANNED WORD: $w"; done; echo "  audit done"
```
Expected: only `audit done`.

- [ ] **Step 4: Commit**

```bash
pkill -f "netlify dev"
git add public/seo-geo/index.html
git commit -m "Add /seo-geo/ service page"
```

---

## Task 5: `/antidote/` — the marketing engine

**Files:**
- Create: `public/antidote/index.html`

**Interfaces:**
- Consumes: `/assets/site.css`; the nav/footer markup from Task 4 (copy verbatim, changing only the page-specific parts).

**Copy constraint — read before writing:** source is `antidote-spine-m0-1/README.md`. Permitted claims: content generation, social posting, blog publishing, competitor monitoring, daily intelligence briefings, Telegram interface, per-client cost tracking, publishes to WordPress/X/Instagram/Facebook/LinkedIn/Threads/Reddit. **Forbidden:** the word "autonomous"; the AI Visibility module; the Keywords module; any pricing/signup; any claim that research + antidote are unified.

- [ ] **Step 1: Create `public/antidote/index.html`**

Use the Task 4 file as the template. Copy the `<nav>` and `<footer>` blocks **verbatim**. Replace the head and the body sections with:

```html
<title>Antidote — Your marketing runs itself. You approve. | Meegrow Labs</title>
<meta name="description" content="Antidote is a marketing engine: it drafts content, publishes blogs and social posts, watches competitors, and briefs you every morning. You approve, it ships. By Meegrow Labs.">
<link rel="canonical" href="https://meegrowlabs.com/antidote/">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Antidote","applicationCategory":"BusinessApplication","operatingSystem":"Web, Telegram","url":"https://meegrowlabs.com/antidote/","publisher":{"@type":"Organization","name":"Meegrow Labs","url":"https://meegrowlabs.com/"},"description":"A marketing automation engine that drafts content, publishes blogs and social posts, monitors competitors, and sends daily intelligence briefings."}
</script>
```

Body sections:

```html
<section>
  <div class="wrap">
    <p class="kicker">Product · Marketing engine</p>
    <h1>Your marketing runs itself. You approve.</h1>
    <p class="lede">Antidote drafts the content, publishes the blogs and the posts, watches your competitors, and briefs you every morning. It works the queue. You keep the last word.</p>
    <p style="margin-top:16px"><span class="badge">Invite only</span></p>
    <p style="margin-top:26px"><a href="https://tally.so/r/444qZ5" class="btn btn-primary">Talk to us →</a></p>
  </div>
</section>

<section style="background:var(--bg2);border-top:4px solid var(--ink);border-bottom:4px solid var(--ink)">
  <div class="wrap">
    <h2>What it does</h2>
    <div class="grid" style="margin-top:22px">
      <div class="card" style="background:var(--bg)"><h3>Drafts your content</h3><p>An LLM agent writes the blog, the caption, the image brief — in your brand’s voice, from your brief.</p></div>
      <div class="card" style="background:var(--bg)"><h3>Publishes it</h3><p>WordPress, X, Instagram, Facebook, LinkedIn, Threads, Reddit. Scheduled, or on your word.</p></div>
      <div class="card" style="background:var(--bg)"><h3>Watches the competition</h3><p>Competitor moves, YouTube channels, Google reviews, ranking shifts — tracked without you asking.</p></div>
      <div class="card" style="background:var(--bg)"><h3>Briefs you daily</h3><p>A morning intelligence briefing: what moved, what shipped, what needs you.</p></div>
      <div class="card" style="background:var(--bg)"><h3>Runs from Telegram</h3><p>Talk to it where you already are. Ask for a post, approve a draft, get the briefing.</p></div>
      <div class="card" style="background:var(--bg)"><h3>Tracks its own cost</h3><p>Per-client, per-model cost tracking, so you always know what the machine is spending.</p></div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <h2>You approve. It ships.</h2>
    <ol class="steps" style="margin-top:22px;max-width:620px">
      <li><strong>You set the brief.</strong> What the brand sounds like, what it sells, where it publishes.</li>
      <li><strong>It drafts.</strong> Content, images and posts come to you as drafts — not surprises.</li>
      <li><strong>You approve.</strong> Nothing goes out on your channels without your say-so.</li>
      <li><strong>It publishes and reports back.</strong> Then tells you what happened next morning.</li>
    </ol>
    <p style="margin-top:20px;max-width:620px;color:var(--muted)">Antidote is delivered with us, for our clients — it isn’t a self-serve signup. If you want it pointed at your brand, talk to us.</p>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="cta">
      <h2>Put the engine on your brand.</h2>
      <p>Tell us what you sell. We’ll show you what Antidote would ship in week one.</p>
      <p style="margin-top:22px"><a href="https://tally.so/r/444qZ5" class="btn btn-primary">Talk to us →</a></p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify routing and distinctness**

```bash
cd "/Users/prakhar/Desktop/Meegrow/Meegrowlabs Website"
npm run build 2>&1 | tail -2
pkill -f "netlify dev"; (netlify dev --dir dist --port 8888 --offline > /tmp/ntl.log 2>&1 &)
sleep 6
echo "antidote: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8888/antidote/)"
echo "  md5: $(curl -s http://localhost:8888/antidote/ | md5)  (must differ from home + seo-geo)"
```
Expected: `200`, distinct md5.

- [ ] **Step 3: Honesty audit — this is the page most likely to overclaim**

```bash
for w in autonomous "AI Visibility" "Keywords" pricing "free trial" "sign up" "signup" seamless revolutionary cutting-edge leverage supercharge elevate; do
  grep -qi "$w" public/antidote/index.html && echo "  VIOLATION: $w"; done; echo "  audit done"
```
Expected: only `audit done`. Any hit is a spec violation — fix before committing.

- [ ] **Step 4: Commit**

```bash
pkill -f "netlify dev"
git add public/antidote/index.html
git commit -m "Add /antidote/ product page

Copy is sourced from the Antidote README, not the aspirational design doc.
Framed as 'you approve, it ships' because the docs describe approval gates,
and the synthetic AI Visibility / Keywords modules are omitted per
NORTH_STAR.md."
```

---

## Task 6: `/research/` — the SEO research suite

**Files:**
- Create: `public/research/index.html`

**Interfaces:**
- Consumes: `/assets/site.css`; nav/footer from Task 4 (verbatim).

**Copy constraint:** source is `datawise-replica/BUILD_BRIEF.md` and `RESEARCH_SUITE_V2.md`. Permitted modules: keywords, competitor analysis, backlinks, site audit, rank tracking, local SEO, schema studio, SXO, content, monitoring. Differentiator: every result row has a **"+ Task"** that lands on a work board. Data source: DataForSEO. **Forbidden:** claiming it's a module inside Antidote (it's a separate app; consolidation is a plan); the word "autonomous"; pricing/signup.

- [ ] **Step 1: Create `public/research/index.html`**

Copy the Task 4 nav/footer verbatim. Head:

```html
<title>Antidote Research — SEO research that turns into work | Meegrow Labs</title>
<meta name="description" content="Antidote Research is an SEO research suite: keywords, backlinks, site audits, rank tracking, local SEO and schema. Every result turns into a task on your board. By Meegrow Labs.">
<link rel="canonical" href="https://meegrowlabs.com/research/">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Antidote Research","applicationCategory":"BusinessApplication","operatingSystem":"Web","url":"https://meegrowlabs.com/research/","publisher":{"@type":"Organization","name":"Meegrow Labs","url":"https://meegrowlabs.com/"},"description":"An SEO research suite covering keywords, backlinks, site audits, rank tracking, local SEO and schema, where every result can become a task."}
</script>
```

Body:

```html
<section>
  <div class="wrap">
    <p class="kicker">Product · SEO research suite</p>
    <h1>Research that turns into work.</h1>
    <p class="lede">Most SEO tools hand you a report and wish you luck. Antidote Research puts a <strong>+ Task</strong> on every row — so the finding lands on a board instead of in a tab you never reopen.</p>
    <p style="margin-top:16px"><span class="badge">Invite only</span></p>
    <p style="margin-top:26px"><a href="https://tally.so/r/444qZ5" class="btn btn-primary">Talk to us →</a></p>
  </div>
</section>

<section style="background:var(--bg2);border-top:4px solid var(--ink);border-bottom:4px solid var(--ink)">
  <div class="wrap">
    <h2>What’s inside</h2>
    <div class="grid" style="margin-top:22px">
      <div class="card" style="background:var(--bg)"><h3>Keywords</h3><p>Volume, difficulty and intent — the research that decides what’s worth writing.</p></div>
      <div class="card" style="background:var(--bg)"><h3>Competitors</h3><p>Who’s beating you, on what, and the map of where they’re strong.</p></div>
      <div class="card" style="background:var(--bg)"><h3>Backlinks</h3><p>Your profile and theirs — the gap you can actually close.</p></div>
      <div class="card" style="background:var(--bg)"><h3>Site audit</h3><p>The technical problems standing between your pages and the index.</p></div>
      <div class="card" style="background:var(--bg)"><h3>Rank tracking</h3><p>Where you sit today, and which way it’s moving.</p></div>
      <div class="card" style="background:var(--bg)"><h3>Local SEO</h3><p>For the businesses with a map pin — the signals that decide the pack.</p></div>
      <div class="card" style="background:var(--bg)"><h3>Schema studio</h3><p>Structured data, generated and validated, so engines know what you are.</p></div>
      <div class="card" style="background:var(--bg)"><h3>SXO</h3><p>Search experience: why a well-optimized page still loses the click.</p></div>
    </div>
    <p style="margin-top:22px;color:var(--muted)">Built on the DataForSEO API — the numbers come from the same place the industry’s tools get theirs.</p>
  </div>
</section>

<section>
  <div class="wrap">
    <h2>The difference: a work spine</h2>
    <ol class="steps" style="margin-top:22px;max-width:620px">
      <li><strong>Run the research.</strong> Any module, any site — yours or a competitor’s.</li>
      <li><strong>Hit + Task on the row that matters.</strong> The finding becomes a job, with its context attached.</li>
      <li><strong>Work the board.</strong> Todo, in progress, done. The research stops being a PDF nobody reads.</li>
    </ol>
    <p style="margin-top:20px;max-width:620px;color:var(--muted)">Antidote Research runs behind a sign-in and is provisioned for our team and our clients. There’s no public signup — talk to us if you want in.</p>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="cta">
      <h2>See what the research says about you.</h2>
      <p>We’ll run your site through it and walk you through what comes back.</p>
      <p style="margin-top:22px"><a href="https://tally.so/r/444qZ5" class="btn btn-primary">Talk to us →</a></p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify and audit**

```bash
cd "/Users/prakhar/Desktop/Meegrow/Meegrowlabs Website"
npm run build 2>&1 | tail -2
pkill -f "netlify dev"; (netlify dev --dir dist --port 8888 --offline > /tmp/ntl.log 2>&1 &)
sleep 6
echo "research: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8888/research/)"
for w in autonomous pricing "free trial" "sign up" seamless revolutionary leverage supercharge elevate; do
  grep -qi "$w" public/research/index.html && echo "  VIOLATION: $w"; done; echo "  audit done"
```
Expected: `200`; only `audit done`.

- [ ] **Step 3: Commit**

```bash
pkill -f "netlify dev"
git add public/research/index.html
git commit -m "Add /research/ product page for Antidote Research"
```

---

## Task 7: `/social/` — upgrade, additively

**Files:**
- Modify: `public/social/index.html`

**This page is live evidence in an active Meta App Review.** The Meta section, the YouTube section, and the legal links must survive **verbatim**. This task only adds the shared chrome and expands the surrounding page.

- [ ] **Step 1: Snapshot the sections that must survive**

```bash
cd "/Users/prakhar/Desktop/Meegrow/Meegrowlabs Website"
grep -c "Facebook Page\|Instagram Business\|Meta Platform\|facebook.com/terms.php\|business_tools\|youtube.com/t/terms\|myaccount.google.com/permissions" public/social/index.html
```
Expected: `7` or more. Note the number — Step 4 re-checks it.

- [ ] **Step 2: Rework the page**

- Replace the `<style>` block with `<link rel="stylesheet" href="/assets/site.css">` plus the shared font link from Task 4.
- Add the shared `<nav>` from Task 4 (verbatim) above the hero.
- Replace the footer with the shared `<footer class="site-footer">` from Task 4 (verbatim) — it already contains all three legal links.
- Keep the existing `<h2>Connecting your Facebook Page &amp; Instagram account</h2>` section and the `<h2>Connecting your YouTube channel</h2>` section **exactly as they are** — do not reword a single sentence.
- Update the head: keep the canonical, add `<link rel="stylesheet" href="/assets/site.css">`, and add:

```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Meegrow Social","applicationCategory":"BusinessApplication","operatingSystem":"Web","url":"https://meegrowlabs.com/social/","publisher":{"@type":"Organization","name":"Meegrow Labs","url":"https://meegrowlabs.com/"},"description":"Social media management: plan, schedule, publish and measure across Facebook Pages, Instagram Business accounts, Google Business Profiles, LinkedIn and YouTube."}
</script>
```

- Add a `Talk to us` CTA band before the footer, using the `.cta` block from Task 4 with:
  - h2: `Put your publishing on rails.`
  - p: `Tell us which channels you run. We’ll show you the calendar.`

- [ ] **Step 3: Rebuild and verify routing**

```bash
npm run build 2>&1 | tail -2
pkill -f "netlify dev"; (netlify dev --dir dist --port 8888 --offline > /tmp/ntl.log 2>&1 &)
sleep 6
echo "social: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8888/social/)"
```
Expected: `200`.

- [ ] **Step 4: Prove the Meta App Review content survived**

```bash
S=$(curl -s http://localhost:8888/social/)
for t in "Facebook Page" "Instagram Business" "Meta Platform" "facebook.com/terms.php" "business_tools" "youtube.com/t/terms" "myaccount.google.com/permissions" "/privacy/" "/terms/" "/data-deletion/"; do
  echo "$S" | grep -q "$t" && echo "  ok  $t" || echo "  *** LOST: $t ***"; done
```
Expected: every line `ok`. Any `LOST` means the App Review evidence was damaged — revert and redo.

- [ ] **Step 5: Commit**

```bash
pkill -f "netlify dev"
git add public/social/index.html
git commit -m "Upgrade /social/ onto the shared site chrome

Additive only: adds the site nav, shared stylesheet, SoftwareApplication
schema and a CTA. The Meta and YouTube sections and the legal links are
unchanged — this page is live evidence in an active Meta App Review."
```

---

## Task 8: Discovery — sitemap and llms.txt

**Files:**
- Modify: `public/sitemap.xml`
- Modify: `public/llms.txt`

- [ ] **Step 1: Add the four new pages to `public/sitemap.xml`**

`/` and `/learn/` are already listed — do not duplicate them. Insert after the `/learn/` entry:

```xml
  <url>
    <loc>https://meegrowlabs.com/seo-geo/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://meegrowlabs.com/antidote/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://meegrowlabs.com/research/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://meegrowlabs.com/social/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
```

- [ ] **Step 2: Read the existing `llms.txt` before editing**

```bash
cd "/Users/prakhar/Desktop/Meegrow/Meegrowlabs Website"
cat public/llms.txt
```
Match its existing format and tone. Add the four new pages with one-line descriptions, and update any line that describes the site as a course site rather than a company. Do not restructure the file.

- [ ] **Step 3: Verify the sitemap is well-formed**

```bash
npm run build 2>&1 | tail -2
python3 -c "import xml.dom.minidom;xml.dom.minidom.parse('dist/sitemap.xml');print('sitemap OK')"
grep -c "<loc>" dist/sitemap.xml
```
Expected: `sitemap OK`, and the `<loc>` count is exactly 4 higher than before.

- [ ] **Step 4: Commit**

```bash
git add public/sitemap.xml public/llms.txt
git commit -m "List the new pages in sitemap.xml and llms.txt

llms.txt is the GEO play we sell — the new pages have to be in it."
```

---

## Task 9: Full verification and deploy

- [ ] **Step 1: Run the complete route matrix against `netlify dev`**

```bash
cd "/Users/prakhar/Desktop/Meegrow/Meegrowlabs Website"
npm run build 2>&1 | tail -2
pkill -f "netlify dev"; (netlify dev --dir dist --port 8888 --offline > /tmp/ntl.log 2>&1 &)
sleep 8
B=http://localhost:8888
echo "=== must be 200 ==="
for p in / /seo-geo/ /antidote/ /research/ /social/ /learn/ /learn/what-is-a-file/ /privacy/ /terms/ /data-deletion/ /client/au-cost/ /robots.txt /sitemap.xml /llms.txt /assets/site.css; do
  printf "  %-26s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' $B$p)"; done
echo "=== SPA must be 200 ==="
for p in /app /app/ /login /login/ /app/some-course/lesson/intro; do
  printf "  %-26s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' $B$p)"; done
echo "=== must be 404 / 301 / 405 ==="
printf "  %-26s %s\n" "/unknown-xyz/ (404)" "$(curl -s -o /dev/null -w '%{http_code}' $B/unknown-xyz/)"
printf "  %-26s %s\n" "/postiz/foo (301)" "$(curl -s -o /dev/null -w '%{http_code}' $B/postiz/foo)"
printf "  %-26s %s\n" "subscribe fn (405)" "$(curl -s -o /dev/null -w '%{http_code}' $B/.netlify/functions/subscribe)"
```
Expected: every 200 row `200`; unknown `404`; postiz `301`; function `405`.

- [ ] **Step 2: Prove every page is distinct (the md5 test)**

```bash
for p in "" seo-geo antidote research social learn privacy terms data-deletion; do
  printf "  %-16s %s\n" "/$p/" "$(curl -s http://localhost:8888/$p/ | md5)"; done
```
Expected: nine **different** hashes. Any two matching means a page isn't really routed.

- [ ] **Step 3: Confirm the legal pages never changed**

```bash
git log --oneline -- public/privacy/index.html public/terms/index.html public/data-deletion/index.html | head -3
git diff HEAD~8 --stat -- public/privacy/ public/terms/ public/data-deletion/
```
Expected: the diff is **empty** — no commit in this plan touched them.

- [ ] **Step 4: Site-wide copy audit**

```bash
echo "=== banned words across the new pages ==="
for f in public/seo-geo/index.html public/antidote/index.html public/research/index.html public/social/index.html src/components/CompanyHome.tsx; do
  for w in seamless revolutionary cutting-edge leverage supercharge elevate world-class game-changing delve synergy robust holistic autonomous "best-in-class" next-gen; do
    grep -qi "$w" "$f" && echo "  $f → $w"; done; done
echo "=== synthetic Antidote features must be absent ==="
grep -i "AI Visibility\|Keywords" public/antidote/index.html && echo "  *** VIOLATION ***" || echo "  ok — absent"
echo "=== no signup/pricing implied ==="
for f in public/seo-geo/index.html public/antidote/index.html public/research/index.html; do
  grep -qiE "sign up|signup|pricing|free trial|per month|/mo\b" "$f" && echo "  $f → implies signup/pricing"; done
echo "  audit complete"
```
Expected: no violations printed.

- [ ] **Step 5: Deploy**

```bash
pkill -f "netlify dev"
git status --short
git push origin main
```

- [ ] **Step 6: Verify in production**

```bash
sleep 45
B=https://meegrowlabs.com
for p in / /seo-geo/ /antidote/ /research/ /social/ /learn/ /privacy/ /terms/ /data-deletion/; do
  printf "  %-18s %s  %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' $B$p)" "$(curl -s $B$p | md5)"; done
printf "  %-18s %s\n" "/unknown-xyz/" "$(curl -s -o /dev/null -w '%{http_code}' $B/unknown-xyz/)"
curl -s $B/ | grep -o "impossible to ignore" | head -1
```
Expected: all `200` with distinct md5s; unknown `404`; the home tagline present in the served HTML (proving prerender).

- [ ] **Step 7: Post-deploy — watch the homepage keyword shift**

`/` no longer targets "Zero to AI Hero"; `/learn/` inherits it. In Google Search Console, request re-indexing of `/` and `/learn/`, and resubmit `sitemap.xml`. Expect a ranking shuffle for a few weeks. This resolves the pre-existing `/` vs `/learn/` cannibalization rather than creating new risk — but watch it.

---

## Self-Review

**Spec coverage:**

| Spec section | Task |
|---|---|
| D1 cream system canonical | 1, 2 |
| D2 `/` = company home, course → `/learn/` | 3 |
| D3 IA Services/Products/Learn | 3 (router), 4-7 (pages) |
| D4 static pages + React home | 2-7 |
| D5 lead-gen CTAs only | 3-7 (all → Tally) |
| D6 Antidote = engine, Social = tool | 5, 7 |
| D7 site-wide token retune | 1 |
| §3 nav `<details>` dropdown | 3 (React), 4 (static) |
| §3 shared `site.css` | 2 |
| §4 page copy grounded in product truth | 4-7 + Global Constraints |
| §5 schema / sitemap / llms.txt / canonicals | 3, 4-7, 8 |
| §5 homepage keyword shift risk | 9 Step 7 |
| §7 verification (1-6) | 9 |
| §6 out of scope (legal pages untouched) | 3 Step 9, 9 Step 3 |

No gaps.

**Placeholder scan:** No TBD/TODO. Every code step carries its content. Tasks 5-7 say "copy the nav/footer from Task 4 verbatim" rather than reprinting ~25 lines four times — the file is small and adjacent, and the instruction names the exact source.

**Type consistency:** `SiteNav` / `SiteFooter` / `CompanyHome` are default exports consumed only by `CompanyHome` and `App`. Tailwind tokens defined in Task 1 (`cream-{50..300}`, `green-{50,100,600,700,800}`, `slate-{200..900}`, `accent-500`, `mustard-{400,500}`) match every usage in Task 3. CSS classes defined in Task 2 (`.wrap .site-nav .kicker .btn .btn-primary .btn-ghost .card .grid .badge .steps .cta .site-footer`) match every usage in Tasks 4-7. `--yellow` is defined in `site.css` and used by `.badge`.

**Known ordering constraint:** Task 2 must land before Tasks 4-7 (they link `site.css`). Task 1 must land before Task 3 (it consumes the tokens). Tasks 4-7 are independent of each other and may be done in any order or in parallel.
