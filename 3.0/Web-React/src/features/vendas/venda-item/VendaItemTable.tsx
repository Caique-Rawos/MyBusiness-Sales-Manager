import { Trash2 } from 'lucide-react'
import type { VendaItem } from './types'
import { Table, Thead, Tbody, Th, Td, EmptyRow } from '../../../shared/components/ui/Table'
import { Card } from '../../../shared/components/ui/Card'
import Button from '../../../shared/components/ui/Button'
import { formatCurrency } from '../../../shared/lib/utils'

interface VendaItemTableProps {
  itens: VendaItem[]
  isLoading: boolean
  onDelete: (item: VendaItem) => void
}

export function VendaItemTable({ itens, isLoading, onDelete }: VendaItemTableProps) {
  return (
    <Card title="Itens da Venda">
      <Table>
        <Thead>
          <tr>
            <Th>Código</Th>
            <Th>Produto</Th>
            <Th>Valor Unit.</Th>
            <Th>Desconto Unit.</Th>
            <Th>Quantidade</Th>
            <Th>Sub Total</Th>
            <Th className="whitespace-nowrap">Ações</Th>
          </tr>
        </Thead>
        <Tbody>
          {isLoading && <EmptyRow cols={7} message="Carregando..." />}
          {!isLoading && itens.length === 0 && <EmptyRow cols={7} />}
          {!isLoading && itens.map(item => (
            <tr key={item.id}>
              <Td>{item.id}</Td>
              <Td>{item.produto?.descricao ?? '-'}</Td>
              <Td>{formatCurrency(item.precoUnitario)}</Td>
              <Td>{formatCurrency(item.desconto)}</Td>
              <Td>{item.quantidade}</Td>
              <Td>{formatCurrency(item.subTotal)}</Td>
              <Td>
                <Button size="sm" variant="ghost" onClick={() => onDelete(item)} title="Excluir" className="text-red-500 hover:text-red-700">
                  <Trash2 size={14} />
                </Button>
              </Td>
            </tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  )
}
