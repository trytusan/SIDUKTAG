import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function RouteProgressBar() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let progressTimer: NodeJS.Timeout

    const handleStart = (url: string) => {
      // Don't animate if navigating to the same URL
      if (url === router.asPath) return

      setLoading(true)
      setProgress(25)

      clearInterval(progressTimer)
      progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressTimer)
            return 85
          }
          return prev + Math.random() * 15
        })
      }, 120)
    }

    const handleComplete = () => {
      clearInterval(progressTimer)
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 250)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      clearInterval(progressTimer)
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  if (!loading && progress === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  )
}

