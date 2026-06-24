import { Plus, Receipt, Trash2 } from 'lucide-react'
import type { Venda } from './types'
import { Table, Thead, Tbody, Th, Td, EmptyRow } from '../../../shared/components/ui/Table'
import Button from '../../../shared/components/ui/Button'
import { Card } from '../../../shared/components/ui/Card'
import { formatCurrency, formatDate } from '../../../shared/lib/utils'

interface VendaTableProps {
  vendas: Venda[]
  isLoading: boolean
  onAddItens: (id: number) => void
  onCupom: (id: number) => void
  onDelete: (venda: Venda) => void
}

export function VendaTable({ vendas, isLoading, onAddItens, onCupom, onDelete }: VendaTableProps) {
  return (
    <Card title="Vendas">
      <Table>
        <Thead>
          <tr>
            <Th>Código</Th>
            <Th>Cliente</Th>
            <Th>Valor Total</Th>
            <Th>Data</Th>
            <Th className="whitespace-nowrap">Ações</Th>
          </tr>
        </Thead>
        <Tbody>
          {isLoading && <EmptyRow cols={5} message="Carregando..." />}
          {!isLoading && vendas.length === 0 && <EmptyRow cols={5} />}
          {!isLoading && vendas.map(venda => (
            <tr key={venda.id}>
              <Td>{venda.id}</Td>
              <Td>{venda.cliente?.nome ?? '-'}</Td>
              <Td>{formatCurrency(venda.totalVenda)}</Td>
              <Td>{formatDate(venda.dataVenda)}</Td>
              <Td>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="secondary" size="sm" onClick={() => onAddItens(venda.id)} title="Gerenciar itens">
                    <Plus size={14} />
                    Itens
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => onCupom(venda.id)} title="Ver cupom fiscal">
                    <Receipt size={14} />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(venda)} title="Excluir venda" className="text-red-500 hover:text-red-700">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  )
}
