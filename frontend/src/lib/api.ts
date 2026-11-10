import axios from 'axios'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

let csrfToken: string | null = null

export function setCsrfToken(token: string | null) {
  csrfToken = token
  if (token) {
    api.defaults.headers.common['X-CSRF-TOKEN'] = token
  } else {
    delete api.defaults.headers.common['X-CSRF-TOKEN']
  }
}

export function getCsrfToken(): string | null {
  return csrfToken
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// Request interceptor: lampirkan CSRF token pada setiap request mutasi (POST, PUT, PATCH, DELETE)
api.interceptors.request.use(async (config) => {
  const method = config.method?.toUpperCase()
  if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    if (!csrfToken) {
      try {
        const res = await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, { withCredentials: true })
        if (res.data?.csrf_token) {
          csrfToken = res.data.csrf_token
          api.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
        }
      } catch (e) {
        // Abaikan dan lanjutkan
      }
    }
    if (csrfToken) {
      if (typeof (config.headers as any)?.set === 'function') {
        (config.headers as any).set('X-CSRF-TOKEN', csrfToken)
      } else if (config.headers) {
        (config.headers as Record<string, any>)['X-CSRF-TOKEN'] = csrfToken
      }
    }
  }
  return config
})

// Response interceptor: jika terjadi error 419 (CSRF expired/mismatch), ambil token baru dan ulangi sekali
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 419 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const res = await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, { withCredentials: true })
        if (res.data?.csrf_token) {
          csrfToken = res.data.csrf_token
          api.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
          if (typeof (originalRequest.headers as any)?.set === 'function') {
            (originalRequest.headers as any).set('X-CSRF-TOKEN', csrfToken)
          } else if (originalRequest.headers) {
            (originalRequest.headers as Record<string, any>)['X-CSRF-TOKEN'] = csrfToken
          }
          return api(originalRequest)
        }
      } catch (refreshErr) {
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export function getStorageUrl(path?: string | null): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${API_BASE_URL}/storage/${path.replace(/^\/+/, '')}`
}

/**
 * Mengunduh atau membuka file biner (PDF/Excel) dengan otorisasi sesi Axios yang valid
 */
export async function downloadAuthorizedFile(
  pathOrUrl: string,
  defaultFilename: string = 'dokumen.pdf',
  openInTab: boolean = false
) {
  let url = pathOrUrl
  if (url.startsWith(API_BASE_URL)) {
    url = url.substring(API_BASE_URL.length)
  }

  let printWindow: Window | null = null
  if (openInTab && typeof window !== 'undefined') {
    printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head><title>Memuat Dokumen...</title></head>
          <body style="font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; color: #334155;">
            <div style="text-align: center; max-width: 420px; padding: 28px; background: white; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
              <div style="width: 40px; height: 40px; border: 3px solid #10b981; border-top-color: transparent; border-radius: 50%; margin: 0 auto 16px; animation: spin 1s linear infinite;"></div>
              <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Menyiapkan Dokumen...</div>
              <div style="font-size: 13px; color: #64748b; line-height: 1.5;">Sedang membuat berkas resmi dari server. Pratinjau akan segera tampil...</div>
            </div>
            <style>
              @keyframes spin { to { transform: rotate(360deg); } }
            </style>
          </body>
        </html>
      `)
    }
  }

  try {
    const res = await api.get(url, { responseType: 'blob' })
    const ext = defaultFilename.split('.').pop()?.toLowerCase() || ''
    const fallbackMime: Record<string, string> = {
      pdf: 'application/pdf',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      xls: 'application/vnd.ms-excel',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    }
    const defaultType = fallbackMime[ext] || 'application/pdf'
    const headerContentType = res.headers['content-type']
    const contentType = (typeof headerContentType === 'string' && headerContentType !== 'application/octet-stream')
      ? headerContentType
      : defaultType
    const blob = new Blob([res.data], { type: contentType })
    const blobUrl = window.URL.createObjectURL(blob)

    if (openInTab && printWindow) {
      printWindow.location.href = blobUrl
    } else {
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = defaultFilename
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000)
    }
  } catch (error) {
    if (printWindow) printWindow.close()
    throw error
  }
}

export const DEFAULT_BERITA_FALLBACK = 'https://images.unsplash.com/photo-1524813686514-a57563d77d46?w=1200&auto=format&fit=crop&q=80'

export const BERITA_FALLBACK_IMAGES: Record<string, string> = {
  'pengumuman': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
  'kegiatan': 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&auto=format&fit=crop&q=80',
  'bansos': 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&auto=format&fit=crop&q=80',
  'bantuan': 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&auto=format&fit=crop&q=80',
  'pembangunan': 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1200&auto=format&fit=crop&q=80',
  'pelayanan': 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&auto=format&fit=crop&q=80',
  'kesehatan': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80',
}

export function getBeritaImageUrl(gambar?: string | null, kategori?: string): string {
  if (gambar && typeof gambar === 'string' && gambar.trim().length > 0) {
    const trimmed = gambar.trim()
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
      return trimmed
    }
    return getStorageUrl(trimmed)
  }

  if (kategori) {
    const key = kategori.toLowerCase().trim()
    for (const [catKey, url] of Object.entries(BERITA_FALLBACK_IMAGES)) {
      if (key.includes(catKey)) {
        return url
      }
    }
  }

  return DEFAULT_BERITA_FALLBACK
}

export async function downloadFile(
  endpointUrl: string,
  fallbackFilename: string = 'dokumen.docx',
  onProgress?: (downloading: boolean) => void
): Promise<void> {
  try {
    if (onProgress) onProgress(true)
    const response = await api.get(endpointUrl, {
      responseType: 'blob',
    })

    let filename = fallbackFilename
    const disposition = response.headers['content-disposition']
    if (disposition) {
      const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(disposition)
      if (utf8Match && utf8Match[1]) {
        filename = decodeURIComponent(utf8Match[1])
      } else {
        const standardMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)
        if (standardMatch && standardMatch[1]) {
          filename = standardMatch[1].replace(/['"]/g, '').trim()
        }
      }
    }

    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Download error:', err)
    const fullUrl = endpointUrl.startsWith('http') ? endpointUrl : `${API_BASE_URL}${endpointUrl.startsWith('/') ? '' : '/'}${endpointUrl}`
    window.open(fullUrl, '_blank')
  } finally {
    if (onProgress) onProgress(false)
  }
}

export default api

