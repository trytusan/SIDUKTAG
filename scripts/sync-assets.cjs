const fs = require('fs')
const path = require('path')

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) copyDir(srcPath, destPath)
    else fs.copyFileSync(srcPath, destPath)
  }
}

const projectRoot = path.join(__dirname, '..')
const from = path.join(projectRoot, 'public', 'assets')
const to = path.join(projectRoot, 'frontend', 'public', 'assets')

copyDir(from, to)
console.log('Assets synced from', from, 'to', to)
