import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UsuarioForm } from './UsuarioForm'
import type { PapelResumo } from '../papel/types'

const papeis: PapelResumo[] = [
  { id: 1, nome: 'Vendedor' },
  { id: 2, nome: 'Administrador' },
]

describe('UsuarioForm', () => {
  it('should show a message when there are no papeis registered', () => {
    render(<UsuarioForm papeis={[]} onSubmit={vi.fn()} isPending={false} />)
    expect(screen.getByText('Nenhum papel cadastrado ainda.')).toBeInTheDocument()
  })

  it('should show validation errors for nome, email and senha', async () => {
    render(<UsuarioForm papeis={papeis} onSubmit={vi.fn()} isPending={false} />)

    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar usuário' }))

    expect(await screen.findByText('Nome é obrigatório')).toBeInTheDocument()
    expect(await screen.findByText('E-mail inválido')).toBeInTheDocument()
    expect(await screen.findByText('A senha deve ter ao menos 6 caracteres')).toBeInTheDocument()
  })

  it('should toggle papeis and submit the selected ids, resetting the form after', async () => {
    const onSubmit = vi.fn()
    render(<UsuarioForm papeis={papeis} onSubmit={onSubmit} isPending={false} />)

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Fulano' } })
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'fulano@teste.com' } })
    fireEvent.change(screen.getByLabelText('Senha inicial'), { target: { value: '123456' } })
    fireEvent.click(screen.getByLabelText('Vendedor'))
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar usuário' }))

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        nome: 'Fulano',
        email: 'fulano@teste.com',
        senha: '123456',
        papelIds: [1],
      }),
    )
    await waitFor(() => expect(screen.getByLabelText('Nome')).toHaveValue(''))
    expect(screen.getByLabelText('Vendedor')).not.toBeChecked()
  })

  it('should uncheck a previously selected papel', () => {
    render(<UsuarioForm papeis={papeis} onSubmit={vi.fn()} isPending={false} />)

    fireEvent.click(screen.getByLabelText('Vendedor'))
    fireEvent.click(screen.getByLabelText('Administrador'))
    fireEvent.click(screen.getByLabelText('Vendedor'))

    expect(screen.getByLabelText('Vendedor')).not.toBeChecked()
    expect(screen.getByLabelText('Administrador')).toBeChecked()
  })

  it('should show "Cadastrando..." when pending', () => {
    render(<UsuarioForm papeis={papeis} onSubmit={vi.fn()} isPending={true} />)
    expect(screen.getByRole('button', { name: 'Cadastrando...' })).toBeInTheDocument()
  })
})
