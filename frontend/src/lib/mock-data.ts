import { Wilayah, Berita } from '../types'

export const INITIAL_WILAYAH: Wilayah[] = []

export const INITIAL_BERITA: Berita[] = []

export function getStoredWilayah(): Wilayah[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('siduktag_wilayah_data')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    // Jika masih berisi data dummy lawas seperti Dusun Kanginan, bersihkan
    if (Array.isArray(parsed) && parsed.some((item) => item.nama_wilayah === 'Dusun Kanginan')) {
      localStorage.removeItem('siduktag_wilayah_data')
      return []
    }
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    return []
  }
}

export function saveStoredWilayah(list: Wilayah[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('siduktag_wilayah_data', JSON.stringify(list))
  } catch (e) {
    console.error('Failed to save wilayah:', e)
  }
}

export function getStoredBerita(): Berita[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('siduktag_berita_data')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    // Jika masih berisi data dummy lawas, bersihkan
    if (Array.isArray(parsed) && parsed.some((item) => item.judul?.includes('Sosialisasi Penerapan'))) {
      localStorage.removeItem('siduktag_berita_data')
      return []
    }
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    return []
  }
}

export function saveStoredBerita(list: Berita[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('siduktag_berita_data', JSON.stringify(list))
  } catch (e) {
    console.error('Failed to save berita:', e)
  }
}
