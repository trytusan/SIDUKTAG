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

export default api

