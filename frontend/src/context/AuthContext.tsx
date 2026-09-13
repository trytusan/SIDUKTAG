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
  setAuthUser: (user: User | null, role?: 'admin' | 'user' | null, isProfileCompleted?: boolean) => void
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
  setAuthUser: () => {},
  login: async () => {},
  logout: async () => {},
  register: async () => {},
})

const AUTH_STORAGE_KEY = 'siduktag_auth_cache'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<'admin' | 'user' | null>(null)
  const [isProfileCompleted, setIsProfileCompleted] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const saveCache = (u: User | null, r: 'admin' | 'user' | null, comp: boolean) => {
    if (typeof window === 'undefined') return
    try {
      if (u) {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ user: u, role: r, isProfileCompleted: comp })
        )
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    } catch (e) {}
  }

  const refreshUser = async () => {
    try {
      const data = await getUser()
      if (data && data.user) {
        setUser(data.user)
        setRole(data.role)
        setIsProfileCompleted(data.is_profile_completed)
        saveCache(data.user, data.role, data.is_profile_completed)
      } else {
        setUser(null)
        setRole(null)
        setIsProfileCompleted(false)
        saveCache(null, null, false)
      }
    } catch (e: any) {
      if (e?.response?.status === 401 || e?.response?.status === 419) {
        setUser(null)
        setRole(null)
        setIsProfileCompleted(false)
        saveCache(null, null, false)
      }
    } finally {
      setLoading(false)
    }
  }

  // Hydrate immediately from cache on client mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(AUTH_STORAGE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed.user) {
          setUser(parsed.user)
          setRole(parsed.role)
          setIsProfileCompleted(Boolean(parsed.isProfileCompleted))
          setLoading(false)
        }
      }
    } catch (e) {}

    // Verify session in background
    refreshUser()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    const res = await authLogin(credentials)
    if (res?.user) {
      const userObj = res.user
      const roleVal = res.role || userObj.role || 'user'
      const completedVal = res.is_profile_completed ?? (roleVal === 'admin' ? true : false)

      setUser(userObj)
      setRole(roleVal)
      setIsProfileCompleted(completedVal)
      setLoading(false)
      saveCache(userObj, roleVal, completedVal)
    } else {
      await refreshUser()
    }
    return res
  }

  const logout = async () => {
    try {
      saveCache(null, null, false)
      setUser(null)
      setRole(null)
      setIsProfileCompleted(false)
      await authLogout()
    } finally {
      router.push('/login')
    }
  }

  const register = async (payload: RegisterPayload) => {
    const res = await authRegister(payload)
    if (res?.user) {
      const userObj = res.user
      const roleVal = res.role || userObj.role || 'user'
      const completedVal = res.is_profile_completed ?? (roleVal === 'admin' ? true : false)

      setUser(userObj)
      setRole(roleVal)
      setIsProfileCompleted(completedVal)
      setLoading(false)
      saveCache(userObj, roleVal, completedVal)
    } else {
      await refreshUser()
    }
    return res
  }

  const setAuthUser = (u: User | null, r?: 'admin' | 'user' | null, comp?: boolean) => {
    setUser(u)
    const effectiveRole = r !== undefined ? r : (u?.role || role || 'user')
    const effectiveComp = comp !== undefined ? comp : Boolean(u?.penduduk?.is_profile_completed)
    setRole(effectiveRole)
    setIsProfileCompleted(effectiveComp)
    setLoading(false)
    saveCache(u, effectiveRole, effectiveComp)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isProfileCompleted,
        loading,
        refreshUser,
        setAuthUser,
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
