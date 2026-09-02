const fs = require('fs')
const path = require('path')

const compsDir = path.join(__dirname, '..', 'frontend', 'src', 'components')

function walk(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) walk(full, files)
    else files.push(full)
  })
  return files
}

function ensure(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

const files = walk(compsDir).filter(f => f.endsWith('.tsx'))

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8')
  if (!content.includes('Placeholder for resources/views')) return

  const rel = path.relative(compsDir, file).replace(/\\/g, '/')
  const name = path.basename(file).replace('.tsx','')
  const dir = path.dirname(rel)

  let newContent = ''

  // Basic heuristics by directory
  if (dir.startsWith('form')) {
    newContent = `import React from 'react'\n\ntype Props = React.ComponentPropsWithoutRef<'input'>\n\nexport default function ${capitalize(name)}(props: Props) {\n  return <input {...props} className={props.className || 'w-full rounded border px-3 py-2'} />\n}\n`
  } else if (dir.startsWith('layout')) {
    newContent = `import React from 'react'\n\ntype Props = { children?: React.ReactNode }\n\nexport default function ${capitalize(name)}({ children }: Props) {\n  return <div>{children}</div>\n}\n`
  } else if (dir.startsWith('ui')) {
    newContent = `import React from 'react'\n\ntype Props = { children?: React.ReactNode }\n\nexport default function ${capitalize(name)}({ children }: Props) {\n  return <div>{children}</div>\n}\n`
  } else if (dir.startsWith('modal')) {
    newContent = `import React from 'react'\n\ntype Props = { children?: React.ReactNode, open?: boolean }\n\nexport default function ${capitalize(name)}({ children, open = true }: Props) {\n  if (!open) return null\n  return (\n    <div className="fixed inset-0 z-50 flex items-center justify-center">\n      <div className="mx-4 max-w-lg rounded bg-white p-4 shadow-lg">{children}</div>\n    </div>\n  )\n}\n`
  } else if (dir.startsWith('maps')) {
    newContent = `import React from 'react'\n\nexport default function ${capitalize(name)}() {\n  return <div style={{height:300}}>Map placeholder</div>\n}\n`
  } else {
    newContent = `import React from 'react'\n\nexport default function ${capitalize(name)}() {\n  return <div>{'${rel} component'}</div>\n}\n`
  }

  fs.writeFileSync(file, newContent, 'utf8')
  console.log('Replaced', file)
})

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1).replace(/[-_\.]/g,'') }

console.log('Done')
