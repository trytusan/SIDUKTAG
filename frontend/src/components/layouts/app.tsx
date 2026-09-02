import React from 'react'
import Head from 'next/head'

interface AppLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function AppLayout({ children, title = 'SIDUKTAG' }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 antialiased">
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </div>
  )
}
