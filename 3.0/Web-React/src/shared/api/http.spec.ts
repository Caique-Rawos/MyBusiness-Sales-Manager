import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import http from './http'
import { clearSession, setSession } from '../lib/auth-session'
import { refreshSession } from '../lib/refresh-session'

vi.mock('../lib/refresh-session', () => ({ refreshSession: vi.fn() }))

const oldSession = {
  accessToken: 'old-token',
  usuario: { id: 1, nome: 'Fulano', email: 'a@a.com', permissions: [], isOwner: false },
  tenant: { id: 1, schema: 'tenant_1' },
}

const newSession = { ...oldSession, accessToken: 'new-token' }

describe('http', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
    vi.clearAllMocks()
    clearSession()
  })

  afterEach(() => {
    mock.restore()
    clearSession()
  })

  it('should attach the Authorization header when a token is present', async () => {
    setSession(oldSession)
    mock.onGet('/clientes').reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer old-token')
      return [200, []]
    })

    await http.get('/clientes')
  })

  it('should not attach an Authorization header when there is no token', async () => {
    mock.onGet('/clientes').reply((config) => {
      expect(config.headers?.Authorization).toBeUndefined()
      return [200, []]
    })

    await http.get('/clientes')
  })

  it('should pass through a successful response unchanged', async () => {
    mock.onGet('/clientes').reply(200, [{ id: 1 }])

    const response = await http.get('/clientes')

    expect(response.data).toEqual([{ id: 1 }])
  })

  it('should reject non-401 errors without touching refreshSession', async () => {
    mock.onGet('/clientes').reply(500)

    await expect(http.get('/clientes')).rejects.toBeTruthy()
    expect(refreshSession).not.toHaveBeenCalled()
  })

  it('should reject a 401 on an /auth/* route without attempting a refresh', async () => {
    mock.onPost('/auth/login').reply(401)

    await expect(http.post('/auth/login')).rejects.toBeTruthy()
    expect(refreshSession).not.toHaveBeenCalled()
  })

  it('should refresh the session and retry the original request with the new token', async () => {
    setSession(oldSession)
    vi.mocked(refreshSession).mockImplementation(async () => {
      setSession(newSession)
      return newSession
    })

    let callCount = 0
    mock.onGet('/clientes').reply((config) => {
      callCount += 1
      if (callCount === 1) return [401]
      expect(config.headers?.Authorization).toBe('Bearer new-token')
      return [200, [{ id: 1 }]]
    })

    const response = await http.get('/clientes')

    expect(refreshSession).toHaveBeenCalledTimes(1)
    expect(response.data).toEqual([{ id: 1 }])
  })

  it('should redirect to /login when the refresh fails to produce a session', async () => {
    setSession(oldSession)
    vi.mocked(refreshSession).mockResolvedValue(null)
    mock.onGet('/clientes').reply(401)

    const originalLocation = window.location
    // jsdom nao implementa navegacao de verdade via window.location.href -- substitui por um
    // objeto simples so pra capturar a atribuicao
    Object.defineProperty(window, 'location', { value: { href: '' }, writable: true, configurable: true })

    await expect(http.get('/clientes')).rejects.toBeTruthy()

    expect(window.location.href).toBe('/login')
    Object.defineProperty(window, 'location', { value: originalLocation, writable: true, configurable: true })
  })

  it('should not attempt a second refresh when the retried request also 401s', async () => {
    setSession(oldSession)
    vi.mocked(refreshSession).mockResolvedValue(newSession)
    mock.onGet('/clientes').reply(401)

    await expect(http.get('/clientes')).rejects.toBeTruthy()
    expect(refreshSession).toHaveBeenCalledTimes(1)
  })
})
