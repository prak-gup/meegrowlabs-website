// Generate SEO-friendly per-lesson pages at public/learn/<slug>/index.html
// + write a stable `slug` into learn-data.json so the course index can link to them.
// Sources: public/learn/learn-data.json, z2cc-videos/lesson-video-map.json, hi-titles.json, blog-published.json
import fs from "node:fs";
const SITE = "/Users/prakhar/Desktop/Meegrow/Meegrowlabs Website";
const Z = "/Users/prakhar/Desktop/Meegrow/z2cc-videos";
const LEARN = `${SITE}/public/learn`;
const data = JSON.parse(fs.readFileSync(`${LEARN}/learn-data.json`, "utf8"));
const vmap = JSON.parse(fs.readFileSync(`${Z}/lesson-video-map.json`, "utf8"));
const hiTitle = JSON.parse(fs.readFileSync(`${Z}/hi-titles.json`, "utf8"));
const blog = fs.existsSync(`${Z}/blog-published.json`) ? JSON.parse(fs.readFileSync(`${Z}/blog-published.json`, "utf8")) : {};
const PL_EN = "PL5ogw-CYz9s83NYo3HsDHQqsuUwJ-qxa7", PL_HI = "PL5ogw-CYz9s-G3UreFbcfFhMPLQRsc70U";

const kebab = (s) => s.toLowerCase().replace(/[?'".,/()]/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// flat ordered list + assign unique slugs (write back into learn-data)
const flat = [];
const seen = new Set();
for (const lv of data.levels) for (const ls of lv.lessons) {
  let slug = kebab(ls.title);
  if (seen.has(slug)) slug = `${slug}-${ls.id.toLowerCase()}`;
  seen.add(slug); ls.slug = slug;
  flat.push({ ...ls, level: lv.level, levelTitle: lv.levelTitle });
}
fs.writeFileSync(`${LEARN}/learn-data.json`, JSON.stringify(data, null, 2));

const HEAD = (title, desc, canon, ytId) => `<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-PCZK96MECF"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-PCZK96MECF')</script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canon}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="video.other"><meta property="og:url" content="${canon}">
${ytId ? `<meta property="og:image" content="https://i.ytimg.com/vi/${ytId}/hqdefault.jpg">` : ""}
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
<style>:root{--cream:#EFE9D9;--paper:#F7F3E9;--ink:#0F0F0F;--ink2:#5b5749;--green:#1F8A4C;--pink:#F06CA8;--yellow:#F5C518;--clay:#D97757}
*{margin:0;padding:0;box-sizing:border-box}body{background:var(--cream);color:var(--ink);font-family:"Space Grotesk",system-ui,sans-serif;line-height:1.5}a{color:var(--green)}
.wrap{max-width:860px;margin:0 auto;padding:0 20px}header{border-bottom:4px solid var(--ink);position:sticky;top:0;background:var(--cream);z-index:5}
.bar{display:flex;align-items:center;justify-content:space-between;padding:14px 0}.wm{font-family:"JetBrains Mono",monospace;font-weight:700;letter-spacing:.18em}.wm b{color:var(--green)}
.btn{display:inline-block;background:var(--green);color:var(--cream);border:3px solid var(--ink);font-weight:700;padding:8px 16px;border-radius:999px;text-decoration:none;font-size:14px;box-shadow:3px 3px 0 var(--ink)}
.crumbs{font-family:"JetBrains Mono",monospace;font-size:12px;color:var(--ink2);margin:22px 0 6px;letter-spacing:.05em}
h1{font-family:"Archivo Black",sans-serif;font-size:clamp(28px,5vw,46px);line-height:1;letter-spacing:-1px;margin:6px 0 10px}
.sub{font-size:18px;color:var(--ink2);margin-bottom:20px}
.frame{position:relative;padding-top:56.25%;border:4px solid var(--ink);background:#000;box-shadow:8px 8px 0 var(--ink);border-radius:10px;overflow:hidden}
.frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.langtabs{display:flex;gap:8px;margin:18px 0 0}.langtabs button{font:inherit;font-weight:700;border:3px solid var(--ink);background:var(--paper);padding:7px 16px;border-radius:999px;cursor:pointer}
.langtabs button.on{background:var(--green);color:var(--cream)}
.actions{display:flex;flex-wrap:wrap;gap:10px;margin:22px 0}.actions a{font-weight:700;font-size:14px;border:3px solid var(--ink);background:var(--paper);padding:9px 16px;border-radius:999px;text-decoration:none;color:var(--ink)}
.nav{display:flex;justify-content:space-between;gap:12px;margin:30px 0;border-top:2px solid #e4ddc9;padding-top:18px;font-weight:600}
footer{text-align:center;padding:40px 20px 70px;color:var(--ink2);font-size:13px}</style></head><body>
<header><div class="wrap bar"><a class="wm" href="/learn/" style="text-decoration:none">&gt;_ MEEGROW <b>LABS</b></a><span style="display:flex;align-items:center;gap:16px"><a href="https://blog.meegrowlabs.com" style="font-weight:700;text-decoration:none;color:var(--ink)">Blog</a><a class="btn" href="/learn/">Full course →</a></span></div></header>`;

function page(ls, idx) {
  const v = vmap[ls.id] || {};
  const enId = v.en?.ytId, enStart = v.en?.start || 0, hiId = v.hi?.ytId, hiStart = v.hi?.start || 0;
  const canon = `https://meegrowlabs.com/learn/${ls.slug}/`;
  const title = `${ls.title} | Zero to AI Hero (Free, Hindi & English)`;
  const desc = `${ls.title} — a free 2-minute lesson from Zero to AI Hero by Meegrow Labs. Learn to use & build with AI from scratch, in Hindi & English.`;
  const prev = idx > 0 ? flat[idx - 1] : null, next = idx < flat.length - 1 ? flat[idx + 1] : null;
  const blogEn = blog[`${ls.id}-en`]?.link, blogHi = blog[`${ls.id}-hi`]?.link;
  const emb = (id, start) => id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1${start ? `&start=${start}` : ""}` : "";
  const schema = enId ? `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "VideoObject", name: ls.title,
    description: desc, thumbnailUrl: `https://i.ytimg.com/vi/${enId}/hqdefault.jpg`,
    uploadDate: "2026-06-01", contentUrl: `https://www.youtube.com/watch?v=${enId}`,
    embedUrl: `https://www.youtube.com/embed/${enId}`,
    publisher: { "@type": "Organization", name: "Meegrow Labs", url: "https://meegrowlabs.com" }
  })}</script>` : "";
  const breadcrumb = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Zero to AI Hero", item: "https://meegrowlabs.com/learn/" },
      { "@type": "ListItem", position: 2, name: ls.levelTitle, item: `https://meegrowlabs.com/learn/#L${ls.level}` },
      { "@type": "ListItem", position: 3, name: ls.title, item: canon }]
  })}</script>`;
  return `${HEAD(title, desc, canon, enId)}${schema}${breadcrumb}
<div class="wrap">
  <div class="crumbs"><a href="/learn/">Course</a> / Level ${ls.level}: ${esc(ls.levelTitle)} / Lesson ${ls.num}</div>
  <h1>${esc(ls.title)}</h1>
  <p class="sub">Lesson ${ls.num} · ${esc(ls.levelTitle)} · Zero to AI Hero by Meegrow Labs</p>
  <div class="frame"><iframe id="vid" src="${emb(enId, enStart)}" title="${esc(ls.title)}" allow="encrypted-media; fullscreen" allowfullscreen loading="lazy"></iframe></div>
  ${hiId ? `<div class="langtabs">
    <button id="bEn" class="on" onclick="setLang('en')">English</button>
    <button id="bHi" onclick="setLang('hi')">हिंदी</button></div>
  <script>var SRC={en:"${emb(enId, enStart)}",hi:"${emb(hiId, hiStart)}"};
  function setLang(l){document.getElementById('vid').src=SRC[l];document.getElementById('bEn').className=l=='en'?'on':'';document.getElementById('bHi').className=l=='hi'?'on':'';try{localStorage.setItem('hf_lang',l)}catch(e){}}
  (function(){var p=new URLSearchParams(location.search).get('lang')||(function(){try{return localStorage.getItem('hf_lang')}catch(e){return null}})();if(p=='hi')setLang('hi')})();</script>` : ""}
  <div class="actions">
    <a href="https://www.youtube.com/playlist?list=${PL_EN}">▶ Watch full course (English)</a>
    <a href="https://www.youtube.com/playlist?list=${PL_HI}">▶ पूरा कोर्स (हिंदी)</a>
    ${blogEn ? `<a href="${blogEn}">📖 Read the full guide</a>` : ""}
    ${blogHi ? `<a href="${blogHi}">📖 हिंदी में पढ़ें</a>` : ""}
  </div>
  <div class="nav">
    <span>${prev ? `<a href="/learn/${prev.slug}/">← ${esc(prev.title)}</a>` : `<a href="/learn/">← Course home</a>`}</span>
    <span>${next ? `<a href="/learn/${next.slug}/">${esc(next.title)} →</a>` : ""}</span>
  </div>
</div>
<footer>Made by <b>Meegrow Labs</b> · <a href="https://meegrowlabs.com">meegrowlabs.com</a><br>New lesson every day. Narration is AI-generated; content is human-reviewed.</footer>
</body></html>`;
}

let n = 0;
for (let i = 0; i < flat.length; i++) {
  const ls = flat[i];
  const dir = `${LEARN}/${ls.slug}`;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/index.html`, page(ls, i));
  n++;
}
console.log(`✓ generated ${n} per-lesson pages under public/learn/<slug>/ ; slugs written into learn-data.json`);
console.log("  sample:", flat.slice(0, 3).map((l) => `/learn/${l.slug}/`).join("  "));
