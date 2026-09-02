import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function PengaturanIndex() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/user/pengaturan/profil')
  }, [router])
  return null
}
