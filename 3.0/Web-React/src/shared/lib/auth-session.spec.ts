import { describe, expect, it, afterEach } from 'vitest'
import { clearSession, getAccessToken, getSession, setSession } from './auth-session'

const session = {
  accessToken: 'access-token',
  usuario: { id: 1, nome: 'Fulano', email: 'fulano@teste.com', permissions: [], isOwner: false },
  tenant: { id: 1, schema: 'tenant_1' },
}

describe('auth-session', () => {
  afterEach(() => {
    clearSession()
  })

  it('should start with no session', () => {
    expect(getSession()).toBeNull()
    expect(getAccessToken()).toBeNull()
  })

  it('should store and return the session', () => {
    setSession(session)
    expect(getSession()).toBe(session)
    expect(getAccessToken()).toBe('access-token')
  })

  it('should clear the session', () => {
    setSession(session)
    clearSession()
    expect(getSession()).toBeNull()
    expect(getAccessToken()).toBeNull()
  })
})
