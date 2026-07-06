export interface AuthUser {
  id: number
  email: string
  permissions: string[]
}

export interface AuthTenant {
  id: number
  schema: string
}

export interface AuthSession {
  accessToken: string
  usuario: AuthUser
  tenant: AuthTenant
}

let currentSession: AuthSession | null = null

export function getSession(): AuthSession | null {
  return currentSession
}

export function getAccessToken(): string | null {
  return currentSession?.accessToken ?? null
}

export function setSession(session: AuthSession): void {
  currentSession = session
}

export function clearSession(): void {
  currentSession = null
}
