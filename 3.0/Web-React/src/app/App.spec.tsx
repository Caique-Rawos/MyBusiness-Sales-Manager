import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import { refreshSession } from '../shared/lib/refresh-session'

vi.mock('../shared/lib/refresh-session', () => ({ refreshSession: vi.fn() }))

describe('App', () => {
  it('should boot and redirect an unauthenticated user to the login page', async () => {
    vi.mocked(refreshSession).mockResolvedValue(null)
    render(<App />)

    expect(await screen.findByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })
})
