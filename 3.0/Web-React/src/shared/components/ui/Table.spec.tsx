import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Table, Thead, Tbody, Th, Td, EmptyRow } from './Table'

describe('Table', () => {
  it('should render a scrollable wrapper around the table', () => {
    const { container } = render(
      <Table>
        <Thead>
          <tr><Th>Nome</Th></tr>
        </Thead>
        <Tbody>
          <tr><Td>Fulano</Td></tr>
        </Tbody>
      </Table>,
    )

    expect(container.querySelector('.overflow-x-auto')).toBeInTheDocument()
    expect(screen.getByText('Nome')).toBeInTheDocument()
    expect(screen.getByText('Fulano')).toBeInTheDocument()
  })

  it('should render the default empty message spanning every column', () => {
    render(
      <table>
        <tbody>
          <EmptyRow cols={3} />
        </tbody>
      </table>,
    )

    const cell = screen.getByText('Nenhum registro encontrado.')
    expect(cell).toHaveAttribute('colspan', '3')
  })

  it('should render a custom empty message', () => {
    render(
      <table>
        <tbody>
          <EmptyRow cols={2} message="Carregando..." />
        </tbody>
      </table>,
    )

    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })
})
