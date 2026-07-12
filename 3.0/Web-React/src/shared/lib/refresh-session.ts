import axios from 'axios'
import { clearSession, setSession, type AuthSession } from './auth-session'

const baseURL = import.meta.env.VITE_API_URL ?? 'https://mybusiness-api.caiquerawos.com/'

let refreshPromise: Promise<AuthSession | null> | null = null

// Deduplicado globalmente: sem isso, duas chamadas concorrentes (ex: reload da pagina
// disparando o refresh silencioso ao mesmo tempo que uma request 401 tenta se recuperar)
// competem pelo mesmo refresh token rotativo -- uma vence, a outra recebe 401 e derruba a sessão.
export function refreshSession(): Promise<AuthSession | null> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<AuthSession>(`${baseURL}auth/refresh`, {}, { withCredentials: true })
      .then((res) => {
        setSession(res.data)
        return res.data
      })
      .catch(() => {
        clearSession()
        return null
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}
