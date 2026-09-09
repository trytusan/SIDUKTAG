import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import AnimatedAlertModal, { AnimatedAlertOptions } from '../components/modal/AnimatedAlertModal'

interface AlertContextType {
  showAlert: (options: AnimatedAlertOptions) => void
  hideAlert: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alertOptions, setAlertOptions] = useState<AnimatedAlertOptions | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const showAlert = useCallback((options: AnimatedAlertOptions) => {
    setAlertOptions(options)
    setIsOpen(true)
  }, [])

  const hideAlert = useCallback(() => {
    setIsOpen(false)
    setAlertOptions(null)
  }, [])

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <AnimatedAlertModal
        isOpen={isOpen}
        options={alertOptions}
        onDismiss={hideAlert}
      />
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}

