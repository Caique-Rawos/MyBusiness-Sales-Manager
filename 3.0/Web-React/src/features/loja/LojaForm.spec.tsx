import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LojaForm } from './LojaForm'
import type { Loja } from './types'

describe('LojaForm', () => {
  it('should show "Cadastrar" when no loja exists yet', () => {
    render(<LojaForm loja={undefined} onSubmit={vi.fn()} isPending={false} />)
    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeInTheDocument()
  })

  it('should require nomeFantasia and endereco', async () => {
    render(<LojaForm loja={undefined} onSubmit={vi.fn()} isPending={false} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByText('Nome Fantasia é obrigatório')).toBeInTheDocument()
    expect(await screen.findByText('Endereço é obrigatório')).toBeInTheDocument()
  })

  it('should populate the form and show "Atualizar" when a loja already exists', async () => {
    const loja: Loja = { id: 1, nomeFantasia: 'Minha Loja', cpfCnpj: '12345678900', endereco: 'Rua A, 1' }
    render(<LojaForm loja={loja} onSubmit={vi.fn()} isPending={false} />)

    await waitFor(() => expect(screen.getByLabelText('Nome Fantasia')).toHaveValue('Minha Loja'))
    expect(screen.getByRole('button', { name: 'Atualizar' })).toBeInTheDocument()
  })

  it('should submit the filled data', async () => {
    const onSubmit = vi.fn()
    render(<LojaForm loja={undefined} onSubmit={onSubmit} isPending={false} />)

    fireEvent.change(screen.getByLabelText('Nome Fantasia'), { target: { value: 'Minha Loja' } })
    fireEvent.change(screen.getByLabelText('CPF/CNPJ'), { target: { value: '12345678900' } })
    fireEvent.change(screen.getByLabelText('Endereço'), { target: { value: 'Rua A, 1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          nomeFantasia: 'Minha Loja',
          cpfCnpj: '12345678900',
          ie: '',
          endereco: 'Rua A, 1',
        },
        expect.anything(),
      ),
    )
  })

  it('should show "Salvando..." when pending', () => {
    render(<LojaForm loja={undefined} onSubmit={vi.fn()} isPending={true} />)
    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeInTheDocument()
  })
})
