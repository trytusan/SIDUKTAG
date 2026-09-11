import api, { setCsrfToken, getCsrfToken } from './api'
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

export async function csrf(force = false) {
  const currentToken = getCsrfToken()
  if (currentToken && !force) {
    return currentToken
  }
  try {
    const res = await api.get('/sanctum/csrf-cookie')
    const token = res.data?.csrf_token
    if (token) {
      setCsrfToken(token)
    }
    return token || getCsrfToken()
  } catch (e) {
    return getCsrfToken()
  }
}

export async function login(credentials: LoginCredentials) {
  const token = await csrf()
  const payload = token ? { ...credentials, _token: token } : credentials
  const res = await api.post('/login', payload, {
    headers: token ? { 'X-CSRF-TOKEN': token } : {},
  })
  return res.data
}

export async function logout() {
  const token = await csrf()
  await api.post('/logout', token ? { _token: token } : {}, {
    headers: token ? { 'X-CSRF-TOKEN': token } : {},
  })
}

export async function register(payload: RegisterPayload) {
  const token = await csrf()
  const body = token ? { ...payload, _token: token } : payload
  const res = await api.post('/register', body, {
    headers: token ? { 'X-CSRF-TOKEN': token } : {},
  })
  return res.data
}

export async function forgotPassword(email: string) {
  const token = await csrf()
  const res = await api.post('/forgot-password', {
    email,
    ...(token ? { _token: token } : {}),
  }, {
    headers: token ? { 'X-CSRF-TOKEN': token } : {},
  })
  return res.data
}

export async function resetPassword(payload: {
  token: string
  email: string
  password: string
  password_confirmation: string
}) {
  const csrfToken = await csrf()
  const res = await api.post('/reset-password', {
    ...payload,
    ...(csrfToken ? { _token: csrfToken } : {}),
  }, {
    headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {},
  })
  return res.data
}

export async function changePassword(payload: {
  current_password: string
  password: string
  password_confirmation: string
}) {
  const token = await csrf()
  const res = await api.post('/change-password', {
    ...payload,
    ...(token ? { _token: token } : {}),
  }, {
    headers: token ? { 'X-CSRF-TOKEN': token } : {},
  })
  return res.data
}


export async function sendOtp(email: string) {
  const token = await csrf()
  const res = await api.post('/api/otp/send', {
    email,
    ...(token ? { _token: token } : {}),
  }, {
    headers: token ? { 'X-CSRF-TOKEN': token } : {},
  })
  return res.data
}

export async function verifyOtp(email: string, otp: string) {
  const token = await csrf()
  const res = await api.post('/api/otp/verify', {
    email,
    otp,
    ...(token ? { _token: token } : {}),
  }, {
    headers: token ? { 'X-CSRF-TOKEN': token } : {},
  })
  return res.data
}

export async function resetPasswordWithOtp(payload: {
  email: string
  otp: string
  password: string
  password_confirmation: string
}) {
  const token = await csrf()
  const res = await api.post('/api/otp/reset-password', {
    ...payload,
    ...(token ? { _token: token } : {}),
  }, {
    headers: token ? { 'X-CSRF-TOKEN': token } : {},
  })
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
  sendOtp,
  verifyOtp,
  resetPasswordWithOtp,
  getUser,
}
