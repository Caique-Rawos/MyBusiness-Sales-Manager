import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import http from '../api/http'
import {
  clearSession,
  getSession,
  setSession,
  type AuthSession,
  type AuthTenant,
  type AuthUser,
} from '../lib/auth-session'
import { refreshSession } from '../lib/refresh-session'

interface AuthContextValue {
  user: AuthUser | null
  tenant: AuthTenant | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(getSession())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    refreshSession()
      .then(setSessionState)
      .finally(() => setIsLoading(false))
  }, [])

  async function login(email: string, senha: string) {
    const res = await http.post<AuthSession>('/auth/login', { email, senha })
    setSession(res.data)
    setSessionState(res.data)
  }

  async function logout() {
    await http.post('/auth/logout').catch(() => undefined)
    clearSession()
    setSessionState(null)
  }

  const value: AuthContextValue = {
    user: session?.usuario ?? null,
    tenant: session?.tenant ?? null,
    isAuthenticated: !!session,
    isLoading,
    login,
    logout,
    hasPermission: (permission) => session?.usuario.permissions.includes(permission) ?? false,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return ctx
}
