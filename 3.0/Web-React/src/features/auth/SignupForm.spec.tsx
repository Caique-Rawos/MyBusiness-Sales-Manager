import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SignupForm } from './SignupForm'

describe('SignupForm', () => {
  it('should require every field', async () => {
    render(<SignupForm onSubmit={vi.fn()} isPending={false} />)

    fireEvent.click(screen.getByRole('button', { name: /criar minha loja/i }))

    expect(await screen.findByText('Nome da loja é obrigatório')).toBeInTheDocument()
    expect(await screen.findByText('Endereço é obrigatório')).toBeInTheDocument()
    expect(await screen.findByText('Seu nome é obrigatório')).toBeInTheDocument()
    expect(await screen.findByText('E-mail inválido')).toBeInTheDocument()
  })

  it('should submit the fully filled payload', async () => {
    const onSubmit = vi.fn()
    render(<SignupForm onSubmit={onSubmit} isPending={false} />)

    fireEvent.change(screen.getByLabelText('Nome da loja'), { target: { value: 'Minha Loja' } })
    fireEvent.change(screen.getByLabelText('CPF/CNPJ'), { target: { value: '12345678900' } })
    fireEvent.change(screen.getByLabelText('Endereço'), { target: { value: 'Rua A, 1' } })
    fireEvent.change(screen.getByLabelText('Seu nome'), { target: { value: 'Fulano' } })
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'a@a.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: /criar minha loja/i }))

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          nomeFantasia: 'Minha Loja',
          cpfCnpj: '12345678900',
          endereco: 'Rua A, 1',
          nome: 'Fulano',
          email: 'a@a.com',
          senha: '123456',
        },
        expect.anything(),
      ),
    )
  })

  it('should show a pending label while submitting', () => {
    render(<SignupForm onSubmit={vi.fn()} isPending />)
    expect(screen.getByRole('button', { name: 'Criando...' })).toBeDisabled()
  })
})
