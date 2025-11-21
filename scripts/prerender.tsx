import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import React from 'react'
import { renderToString } from 'react-dom/server'

import App from '../src/App'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distIndexPath = path.resolve(__dirname, '../dist/index.html')

async function injectPrerenderedHTML() {
  const template = await readFile(distIndexPath, 'utf-8')
  const appHTML = renderToString(<App />)

  const nextHTML = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHTML}</div>`
  )

  await writeFile(distIndexPath, nextHTML, 'utf-8')
  console.log('✅ Injected prerendered landing page HTML into dist/index.html')
}

injectPrerenderedHTML().catch((error) => {
  console.error('Failed to prerender landing page:', error)
  process.exitCode = 1
})

