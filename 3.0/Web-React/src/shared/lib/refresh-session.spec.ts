import { describe, expect, it, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { refreshSession } from './refresh-session'
import { clearSession, getSession } from './auth-session'

vi.mock('axios', () => ({ default: { post: vi.fn() } }))

const session = {
  accessToken: 'new-access-token',
  usuario: { id: 1, nome: 'Fulano', email: 'fulano@teste.com', permissions: [], isOwner: false },
  tenant: { id: 1, schema: 'tenant_1' },
}

describe('refreshSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearSession()
  })

  it('should store the session returned by the refresh endpoint', async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: session })

    const result = await refreshSession()

    expect(result).toEqual(session)
    expect(getSession()).toEqual(session)
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringMatching(/auth\/refresh$/),
      {},
      { withCredentials: true },
    )
  })

  it('should clear the session and resolve to null when the refresh fails', async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error('401'))

    const result = await refreshSession()

    expect(result).toBeNull()
    expect(getSession()).toBeNull()
  })

  it('should deduplicate concurrent calls into a single request', async () => {
    let resolvePost!: (value: { data: typeof session }) => void
    vi.mocked(axios.post).mockReturnValue(
      new Promise((resolve) => {
        resolvePost = resolve
      }) as ReturnType<typeof axios.post>,
    )

    const p1 = refreshSession()
    const p2 = refreshSession()
    resolvePost({ data: session })
    const [r1, r2] = await Promise.all([p1, p2])

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(r1).toEqual(session)
    expect(r2).toEqual(session)
  })

  it('should issue a new request after the previous one has settled', async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: session })

    await refreshSession()
    await refreshSession()

    expect(axios.post).toHaveBeenCalledTimes(2)
  })
})
