const fs = require('fs')
const path = require('path')

const pagesDir = path.join(__dirname, '..', 'frontend', 'pages')

function walk(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) walk(full, files)
    else files.push(full)
  })
  return files
}

const files = walk(pagesDir).filter(f => f.endsWith('.tsx'))

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8')
  if (!content.includes('Placeholder for resources/views')) return

  // derive api path from file path
  const rel = path.relative(pagesDir, file).replace(/\\/g, '/') // e.g. user/pengajuan-surat/index.tsx
  let trimmed = rel.replace(/index\.tsx$|\.tsx$/,'')
  trimmed = trimmed.replace(/\[id\]/g, '')
  trimmed = trimmed.replace(/\/+$|^\/+/, '')
  const apiPath = '/api/' + trimmed
  const name = path.basename(file).replace('.tsx','')

  const newContent = `import Layout from '../../src/components/Layout'
import { useEffect, useState } from 'react'
import api from '../../src/lib/api'

export default function Page() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const res = await api.get('${apiPath}')
        if (!mounted) return
        setData(res.data)
      } catch (err) {
        if (!mounted) return
        setError(err?.response?.data || err?.message || 'Fetch error')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <Layout>
      <main>
        <h1>${name}</h1>
        {loading && <p>Memuat...</p>}
        {error && <pre style={{color:'red'}}>{JSON.stringify(error, null, 2)}</pre>}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        {!loading && !data && !error && <p>No data from ${apiPath} (placeholder)</p>}
      </main>
    </Layout>
  )
}
`

  fs.writeFileSync(file, newContent, 'utf8')
  console.log('Upgraded', file, '-> api path', apiPath)
})

console.log('Done')
