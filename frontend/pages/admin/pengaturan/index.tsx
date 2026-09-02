import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function AdminPengaturanIndex() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin/pengaturan/profil')
  }, [router])
  return null
}

