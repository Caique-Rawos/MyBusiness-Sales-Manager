import { Pencil, Trash2 } from 'lucide-react'
import type { Pagamento } from './types'
import { Table, Thead, Tbody, Th, Td, EmptyRow } from '../../../shared/components/ui/Table'
import { Card } from '../../../shared/components/ui/Card'
import Button from '../../../shared/components/ui/Button'

interface PagamentoTableProps {
  pagamentos: Pagamento[]
  isLoading: boolean
  onEdit: (pagamento: Pagamento) => void
  onDelete: (pagamento: Pagamento) => void
}

export function PagamentoTable({ pagamentos, isLoading, onEdit, onDelete }: PagamentoTableProps) {
  return (
    <Card title="Formas de Pagamento">
      <Table>
        <Thead>
          <tr>
            <Th>Código</Th>
            <Th>Descrição</Th>
            <Th className="whitespace-nowrap">Ações</Th>
          </tr>
        </Thead>
        <Tbody>
          {isLoading && <EmptyRow cols={3} message="Carregando..." />}
          {!isLoading && pagamentos.length === 0 && <EmptyRow cols={3} />}
          {!isLoading && pagamentos.map(p => (
            <tr key={p.id} className="hover:bg-gray-50">
              <Td>{p.id}</Td>
              <Td>{p.descricao}</Td>
              <Td>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(p)} title="Editar">
                    <Pencil size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(p)} title="Excluir" className="text-red-500 hover:text-red-700">
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
