#!/usr/bin/env node
/**
 * Create a password-protected client share — the standard for Meegrow client
 * deliverables. Encrypts a source HTML document and places it at
 *   public/client/<code>/index.html   ->  https://meegrowlabs.com/client/<code>/
 *
 * The page content is AES-256 encrypted (see scripts/lib/encrypt-page.mjs) and
 * only readable with the access code. robots.txt already disallows /client/.
 *
 * Usage:
 *   node scripts/new-client-share.mjs <slug> <source.html> <password|--open> ["Title"] ["Badge"]
 *
 * Password-protected (encrypted):
 *   node scripts/new-client-share.mjs au ~/Downloads/Tejas_Review.html AU2026 \
 *     "Tejas — Editorial Guidelines · Client Review" "Client AU · Confidential"
 *
 * Open (no access code, still noindex + robots-disallowed):
 *   node scripts/new-client-share.mjs au ~/Downloads/Tejas_Review.html --open
 *
 * After running: git add public/client/<slug>/ && git commit && git push  (Netlify auto-deploys).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { buildEncryptedPage } from './lib/encrypt-page.mjs'

const [, , code, srcPath, password, title, badge] = process.argv
if (!code || !srcPath || !password) {
  console.error('Usage: new-client-share.mjs <slug> <source.html> <password|--open> ["Title"] ["Badge"]')
  process.exit(1)
}
if (!/^[a-z0-9-]+$/.test(code)) {
  console.error('Error: <slug> must be lowercase letters, numbers, or hyphens (becomes the URL path).')
  process.exit(1)
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(repoRoot, 'public', 'client', code)
const outPath = resolve(outDir, 'index.html')

const plaintext = readFileSync(srcPath, 'utf8')
const isOpen = password === '--open' || password === 'none'

let html
if (isOpen) {
  // Open share: serve the document as-is, but ensure it won't be indexed.
  // (/client/ is already disallowed in robots.txt.)
  const noindex = '<meta name="robots" content="noindex, nofollow" />'
  html = /<meta\s+name=["']robots["']/i.test(plaintext)
    ? plaintext
    : plaintext.replace(/<head([^>]*)>/i, `<head$1>\n${noindex}`)
} else {
  html = await buildEncryptedPage({
    plaintext,
    password,
    title: title || `Client ${code.toUpperCase()} · Meegrow Labs`,
    badge: badge || `Client ${code.toUpperCase()} · Confidential`,
  })
}

mkdirSync(outDir, { recursive: true })
writeFileSync(outPath, html)

// Belt-and-suspenders: make sure robots.txt keeps /client/ out of crawlers.
const robotsPath = resolve(repoRoot, 'public', 'robots.txt')
if (existsSync(robotsPath)) {
  const robots = readFileSync(robotsPath, 'utf8')
  if (!/^\s*Disallow:\s*\/client\//mi.test(robots)) {
    console.warn('⚠  robots.txt does not disallow /client/ — add "Disallow: /client/" manually.')
  }
}

console.log(`✓ Wrote ${outPath} (${(html.length / 1024).toFixed(1)} KB)${isOpen ? ' [open]' : ' [encrypted]'}`)
console.log(`  Live (after push): https://meegrowlabs.com/client/${code}/`)
console.log(`  Access code: ${isOpen ? '(none — open share)' : password}`)
console.log(`  Next: git add public/client/${code}/ && git commit -m "Add client ${code} share" && git push`)
