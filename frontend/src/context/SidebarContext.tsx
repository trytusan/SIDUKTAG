import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

interface SidebarContextType {
  isOpen: boolean
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  // Default to true (standard for desktop view)
  const [isOpen, setIsOpen] = useState(true)

  // Sync state with device size and localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 1024) {
        setIsOpen(false)
      } else {
        const saved = localStorage.getItem('siduktag_sidebar_open')
        if (saved !== null) {
          setIsOpen(saved === 'true')
        }
      }
    }
  }, [])

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setIsOpen(false)
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  // Handle browser window resize
  useEffect(() => {
    let prevWidth = typeof window !== 'undefined' ? window.innerWidth : 1024
    const handleResize = () => {
      const currentWidth = window.innerWidth
      if (currentWidth < 1024 && prevWidth >= 1024) {
        setIsOpen(false)
      } else if (currentWidth >= 1024 && prevWidth < 1024) {
        const saved = localStorage.getItem('siduktag_sidebar_open')
        setIsOpen(saved !== null ? saved === 'true' : true)
      }
      prevWidth = currentWidth
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const triggerResizeEvent = () => {
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('resize'))
      }
    }, 320)
  }

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const next = !prev
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        try {
          localStorage.setItem('siduktag_sidebar_open', String(next))
        } catch (e) {}
      }
      triggerResizeEvent()
      return next
    })
  }

  const openSidebar = () => {
    setIsOpen(true)
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      try {
        localStorage.setItem('siduktag_sidebar_open', 'true')
      } catch (e) {}
    }
    triggerResizeEvent()
  }

  const closeSidebar = () => {
    setIsOpen(false)
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      try {
        localStorage.setItem('siduktag_sidebar_open', 'false')
      } catch (e) {}
    }
    triggerResizeEvent()
  }

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggleSidebar,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

export default SidebarContext

