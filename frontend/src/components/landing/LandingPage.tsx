import React from 'react'
import Head from 'next/head'
import { useAuth } from '../../context/AuthContext'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import GuideSection from './GuideSection'
import ProfileSection from './ProfileSection'
import NewsSection from './NewsSection'
import Footer from './Footer'

export default function LandingPage() {
  const { user, role } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      <Head>
        <title>SIDUKTAG — Sistem Informasi Kependudukan & Geotagging</title>
        <meta
          name="description"
          content="Platform terpadu untuk pendataan warga, pemetaan lokasi rumah (geotagging), pengajuan surat keterangan daring, serta transparansi penyaluran bantuan sosial."
        />
      </Head>

      <Navbar />

      <main className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 text-center">
        <HeroSection />
        <FeaturesSection />
        <GuideSection />
        <ProfileSection />
        <NewsSection isAdmin={Boolean(user && role === 'admin')} />
      </main>

      <Footer />
    </div>
  )
}
