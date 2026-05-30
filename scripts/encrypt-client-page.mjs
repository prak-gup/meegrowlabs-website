#!/usr/bin/env node
/**
 * Low-level: encrypt one HTML file to a password-gated page at an explicit
 * output path. Most of the time you want scripts/new-client-share.mjs instead,
 * which places the page under public/client/<code>/ automatically.
 *
 * Usage:
 *   node scripts/encrypt-client-page.mjs <source.html> <out.html> <password> ["Title"] ["Badge"]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { buildEncryptedPage } from './lib/encrypt-page.mjs'

const [, , srcPath, outPath, password, title, badge] = process.argv
if (!srcPath || !outPath || !password) {
  console.error('Usage: encrypt-client-page.mjs <source.html> <out.html> <password> ["Title"] ["Badge"]')
  process.exit(1)
}

const plaintext = readFileSync(srcPath, 'utf8')
const html = await buildEncryptedPage({ plaintext, password, title, badge })
writeFileSync(outPath, html)
console.log('Wrote', outPath, '(' + (html.length / 1024).toFixed(1) + ' KB)')
