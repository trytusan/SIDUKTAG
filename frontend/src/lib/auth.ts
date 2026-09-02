import api from './api'
import { User } from '../types'

export type LoginCredentials = {
  email: string
  password: string
  remember?: boolean | number
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export async function csrf() {
  await api.get('/sanctum/csrf-cookie')
}

export async function login(credentials: LoginCredentials) {
  await csrf()
  const res = await api.post('/login', credentials)
  return res.data
}

export async function logout() {
  await api.post('/logout')
}

export async function register(payload: RegisterPayload) {
  await csrf()
  const res = await api.post('/register', payload)
  return res.data
}

export async function forgotPassword(email: string) {
  await csrf()
  const res = await api.post('/forgot-password', { email })
  return res.data
}

export async function resetPassword(payload: {
  token: string
  email: string
  password: string
  password_confirmation: string
}) {
  await csrf()
  const res = await api.post('/reset-password', payload)
  return res.data
}

export async function changePassword(payload: {
  current_password: string
  password: string
  password_confirmation: string
}) {
  const res = await api.post('/change-password', payload)
  return res.data
}

export async function getUser(): Promise<{
  user: User
  role: 'admin' | 'user'
  is_profile_completed: boolean
} | null> {
  try {
    const res = await api.get('/api/user')
    return res.data
  } catch (err: any) {
    return null
  }
}

export default {
  csrf,
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
  changePassword,
  getUser,
}
