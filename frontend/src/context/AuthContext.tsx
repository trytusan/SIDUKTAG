import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getUser, login as authLogin, logout as authLogout, register as authRegister, LoginCredentials, RegisterPayload } from '../lib/auth'
import { User } from '../types'

export interface AuthContextType {
  user: User | null
  role: 'admin' | 'user' | null
  isProfileCompleted: boolean
  loading: boolean
  refreshUser: () => Promise<void>
  login: (credentials: LoginCredentials) => Promise<any>
  logout: () => Promise<void>
  register: (payload: RegisterPayload) => Promise<any>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isProfileCompleted: false,
  loading: true,
  refreshUser: async () => {},
  login: async () => {},
  logout: async () => {},
  register: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<'admin' | 'user' | null>(null)
  const [isProfileCompleted, setIsProfileCompleted] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const refreshUser = async () => {
    try {
      const data = await getUser()
      if (data) {
        setUser(data.user)
        setRole(data.role)
        setIsProfileCompleted(data.is_profile_completed)
      } else {
        setUser(null)
        setRole(null)
        setIsProfileCompleted(false)
      }
    } catch (e) {
      setUser(null)
      setRole(null)
      setIsProfileCompleted(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    const res = await authLogin(credentials)
    await refreshUser()
    return res
  }

  const logout = async () => {
    try {
      await authLogout()
    } finally {
      setUser(null)
      setRole(null)
      setIsProfileCompleted(false)
      router.push('/login')
    }
  }

  const register = async (payload: RegisterPayload) => {
    const res = await authRegister(payload)
    await refreshUser()
    return res
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isProfileCompleted,
        loading,
        refreshUser,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
