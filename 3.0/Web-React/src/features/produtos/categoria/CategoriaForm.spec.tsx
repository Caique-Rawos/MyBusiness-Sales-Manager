import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CategoriaForm } from './CategoriaForm'
import type { Categoria } from './types'

describe('CategoriaForm', () => {
  it('should require descricao and not submit when empty', async () => {
    const onSubmit = vi.fn()
    render(<CategoriaForm editing={null} onSubmit={onSubmit} onNew={vi.fn()} isPending={false} />)

    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByText('Descrição é obrigatória')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should submit and reset when creating', async () => {
    const onSubmit = vi.fn()
    render(<CategoriaForm editing={null} onSubmit={onSubmit} onNew={vi.fn()} isPending={false} />)

    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Bebidas' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ descricao: 'Bebidas' }))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue(''))
  })

  it('should populate and show a "Novo" button when editing', async () => {
    const editing: Categoria = { id: 1, descricao: 'Bebidas' }
    render(<CategoriaForm editing={editing} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)

    expect(screen.getByText('Editando: Bebidas')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Bebidas'))
    expect(screen.getByRole('button', { name: 'Novo' })).toBeInTheDocument()
  })
})
