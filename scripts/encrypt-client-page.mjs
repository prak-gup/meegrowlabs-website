#!/usr/bin/env node
/**
 * Encrypts a self-contained HTML document with a password and emits a
 * password-gated page that decrypts client-side via the Web Crypto API.
 *
 * Crypto: PBKDF2(SHA-256, 200k iters) -> AES-256-GCM. The plaintext is NOT
 * present in the output — only salt, iv and ciphertext. Without the password
 * the content cannot be recovered from page source.
 *
 * Usage:
 *   node scripts/encrypt-client-page.mjs <source.html> <out.html> <password> ["Page Title"]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { webcrypto as crypto } from 'node:crypto'

const [, , srcPath, outPath, password, titleArg] = process.argv
if (!srcPath || !outPath || !password) {
  console.error('Usage: encrypt-client-page.mjs <source.html> <out.html> <password> ["Title"]')
  process.exit(1)
}

const ITERATIONS = 200000
const enc = new TextEncoder()

const plaintext = readFileSync(srcPath, 'utf8')
const title = titleArg || 'Protected · Meegrow Labs'

const salt = crypto.getRandomValues(new Uint8Array(16))
const iv = crypto.getRandomValues(new Uint8Array(12))

const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
  baseKey,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt']
)
const ctBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext))

const b64 = (u8) => Buffer.from(u8).toString('base64')
const payload = {
  salt: b64(salt),
  iv: b64(iv),
  iterations: ITERATIONS,
  ct: Buffer.from(ctBuf).toString('base64'),
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>${title.replace(/</g, '&lt;')}</title>
<style>
  :root{--brand:#0b3d91;--blue:#1f6feb;--ink:#1a1d24;--muted:#5b6472;--line:#e4e8ee;--bg:#f6f8fb;--red:#c0392b}
  *{box-sizing:border-box}
  html,body{margin:0;height:100%}
  body{font-family:'Inter',system-ui,-apple-system,sans-serif;background:linear-gradient(135deg,#0b3d91,#1f6feb);color:var(--ink);display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}
  .gate{background:#fff;border-radius:16px;box-shadow:0 18px 50px rgba(10,30,70,.28);padding:40px 36px;width:100%;max-width:400px;text-align:center}
  .badge{display:inline-block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:var(--blue);background:#eaf2ff;padding:5px 12px;border-radius:999px}
  h1{font-size:20px;margin:18px 0 4px;color:var(--brand)}
  p.sub{color:var(--muted);font-size:14px;margin:0 0 24px}
  form{display:flex;flex-direction:column;gap:12px}
  input[type=password]{width:100%;padding:13px 14px;font-size:15px;border:1.5px solid var(--line);border-radius:10px;outline:none;transition:border-color .15s}
  input[type=password]:focus{border-color:var(--blue)}
  button{padding:13px 14px;font-size:15px;font-weight:600;color:#fff;background:var(--brand);border:none;border-radius:10px;cursor:pointer;transition:background .15s}
  button:hover{background:#0a347d}
  button:disabled{opacity:.6;cursor:default}
  .err{color:var(--red);font-size:13.5px;font-weight:500;min-height:18px;margin-top:2px}
  .foot{margin-top:22px;font-size:12px;color:var(--muted)}
</style>
</head>
<body>
  <div class="gate" id="gate">
    <span class="badge">Client AU · Confidential</span>
    <h1>Protected Document</h1>
    <p class="sub">This document is password protected. Enter the access code to continue.</p>
    <form id="f" autocomplete="off">
      <input type="password" id="pw" placeholder="Access code" autofocus aria-label="Access code" />
      <button type="submit" id="btn">Unlock</button>
      <div class="err" id="err"></div>
    </form>
    <div class="foot">Meegrow Labs</div>
  </div>

<script>
  const PAYLOAD = ${JSON.stringify(payload)};
  const b64d = (s) => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const form = document.getElementById('f');
  const pwEl = document.getElementById('pw');
  const errEl = document.getElementById('err');
  const btn = document.getElementById('btn');

  async function unlock(password) {
    const enc = new TextEncoder();
    const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: b64d(PAYLOAD.salt), iterations: PAYLOAD.iterations, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    const ptBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: b64d(PAYLOAD.iv) },
      key,
      b64d(PAYLOAD.ct)
    );
    return new TextDecoder().decode(ptBuf);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errEl.textContent = '';
    btn.disabled = true;
    btn.textContent = 'Unlocking…';
    try {
      const html = await unlock(pwEl.value);
      document.open();
      document.write(html);
      document.close();
    } catch (err) {
      errEl.textContent = 'Incorrect access code. Please try again.';
      btn.disabled = false;
      btn.textContent = 'Unlock';
      pwEl.value = '';
      pwEl.focus();
    }
  });
</script>
</body>
</html>
`

writeFileSync(outPath, html)
console.log('Wrote', outPath, '(' + (html.length / 1024).toFixed(1) + ' KB, ' + ITERATIONS + ' PBKDF2 iters)')
