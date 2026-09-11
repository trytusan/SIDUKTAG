export const FAMILY_ROLE_ORDER: Record<string, number> = {
  'Kepala Keluarga': 1,
  'Suami': 2,
  'Istri': 3,
  'Anak': 4,
  'Menantu': 5,
  'Cucu': 6,
  'Orang Tua': 7,
  'Ayah': 7,
  'Ibu': 7,
  'Mertua': 8,
  'Famili Lain': 9,
  'Pembantu': 10,
  'Lainnya': 11,
}

export function sortFamilyMembers<T extends { status_dalam_keluarga?: string | null; tanggal_lahir?: string | null }>(
  members: T[]
): T[] {
  if (!Array.isArray(members)) return []

  return [...members].sort((a, b) => {
    const roleA = (a.status_dalam_keluarga || '').trim()
    const roleB = (b.status_dalam_keluarga || '').trim()

    const orderA = FAMILY_ROLE_ORDER[roleA] ?? 99
    const orderB = FAMILY_ROLE_ORDER[roleB] ?? 99

    if (orderA !== orderB) {
      return orderA - orderB
    }

    // Jika derajat hierarkinya sama (misal sesama anak), urutkan berdasarkan tanggal lahir (tertua lebih dahulu)
    if (a.tanggal_lahir && b.tanggal_lahir) {
      return new Date(a.tanggal_lahir).getTime() - new Date(b.tanggal_lahir).getTime()
    }

    return 0
  })
}

export function getFamilyRoleBadgeClass(role?: string | null): string {
  switch (role) {
    case 'Kepala Keluarga':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
    case 'Istri':
    case 'Suami':
      return 'bg-purple-100 text-purple-800 border-purple-300 font-semibold'
    case 'Anak':
      return 'bg-sky-100 text-sky-800 border-sky-300 font-medium'
    case 'Orang Tua':
    case 'Ayah':
    case 'Ibu':
    case 'Mertua':
      return 'bg-amber-100 text-amber-800 border-amber-300 font-medium'
    case 'Cucu':
      return 'bg-teal-100 text-teal-800 border-teal-300 font-medium'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

