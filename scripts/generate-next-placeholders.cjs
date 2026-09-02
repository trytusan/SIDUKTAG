const fs = require('fs')
const path = require('path')

const viewsDir = path.join(__dirname, '..', 'resources', 'views')
const outDir = path.join(__dirname, '..', 'frontend')

function walk(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) walk(full, files)
    else files.push(full)
  })
  return files
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

const bladeFiles = walk(viewsDir).filter(f => f.endsWith('.blade.php'))

bladeFiles.forEach(src => {
  // skip admin views
  if (src.includes(path.join('resources', 'views', 'admin'))) return

  const rel = path.relative(viewsDir, src) // e.g. user/onboarding/step-3.blade.php
  const parts = rel.split(path.sep)

  if (parts[0] === 'components') {
    // components -> src/components
    const compPath = parts.slice(1).join(path.sep).replace(/\.blade\.php$/, '.tsx')
    const target = path.join(outDir, 'src', 'components', compPath)
    ensureDir(path.dirname(target))
    if (fs.existsSync(target)) return
    const content = `import React from 'react'\n\nexport default function Placeholder() {\n  return (\n    <div>Placeholder for resources/views/${rel.replace(/\\\\/g, '/')}</div>\n  )\n}\n`
    fs.writeFileSync(target, content)
    console.log('Created', target)
  } else if (parts[0] === 'errors') {
    // errors -> pages/404.tsx etc
    const name = path.basename(rel).replace('.blade.php', '')
    const target = path.join(outDir, 'pages', `${name}.tsx`)
    ensureDir(path.dirname(target))
    if (fs.existsSync(target)) return
    const content = `import Layout from '../src/components/Layout'\n\nexport default function ErrorPage() {\n  return (\n    <Layout>\n      <main>\n        <h1>${name} (placeholder)</h1>\n        <p>Placeholder for resources/views/${rel.replace(/\\\\/g, '/')}</p>\n      </main>\n    </Layout>\n  )\n}\n`
    fs.writeFileSync(target, content)
    console.log('Created', target)
  } else {
    // normal page under pages/<rel path>.tsx (strip .blade.php)
    const targetRel = rel.replace(/\.blade\.php$/, '') + '.tsx'
    const target = path.join(outDir, 'pages', targetRel)
    ensureDir(path.dirname(target))
    if (fs.existsSync(target)) return
    const content = `import Layout from '../../src/components/Layout'\n\nexport default function PagePlaceholder() {\n  return (\n    <Layout>\n      <main>\n        <h1>Placeholder</h1>\n        <p>Placeholder for resources/views/${rel.replace(/\\\\/g, '/')}</p>\n      </main>\n    </Layout>\n  )\n}\n`
    fs.writeFileSync(target, content)
    console.log('Created', target)
  }
})

console.log('Done')
