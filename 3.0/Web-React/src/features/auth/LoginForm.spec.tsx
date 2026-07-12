import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('should validate email and senha', async () => {
    render(<LoginForm onSubmit={vi.fn()} isPending={false} />)

    // deixa o e-mail vazio em vez de um valor mal-formado: input type="email" tem validacao
    // nativa do browser que bloqueia o submit ANTES do React rodar quando o valor nao e vazio
    // mas tem formato invalido -- vazio (sem "required") passa direto pra validacao do zod
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('E-mail inválido')).toBeInTheDocument()
    expect(await screen.findByText('Senha deve ter no mínimo 6 caracteres')).toBeInTheDocument()
  })

  it('should submit valid credentials', async () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} isPending={false} />)

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'a@a.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ email: 'a@a.com', senha: '123456' }, expect.anything()),
    )
  })

  it('should show a pending label and disable the button while submitting', () => {
    render(<LoginForm onSubmit={vi.fn()} isPending />)
    expect(screen.getByRole('button', { name: 'Entrando...' })).toBeDisabled()
  })
})
