import { useEffect } from 'react'
import { useRouter } from 'next/router'
import UserLayout from '../../../src/components/layouts/user'
import LoadingSpinner from '../../../src/components/ui/loading'

export default function UserBantuanCreate() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/user/bantuan')
  }, [router])

  return (
    <UserLayout pageTitle="Bantuan Sosial">
      <LoadingSpinner message="Mengalihkan ke daftar bantuan..." />
    </UserLayout>
  )
}
