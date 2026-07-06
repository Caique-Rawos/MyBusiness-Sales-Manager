import { Pencil, Trash2 } from 'lucide-react'
import type { StatusPagamento } from './types'
import { Badge } from '../../../shared/components/ui/Badge'
import { Table, Thead, Tbody, Th, Td, EmptyRow } from '../../../shared/components/ui/Table'
import { Card } from '../../../shared/components/ui/Card'
import Button from '../../../shared/components/ui/Button'

interface StatusPagamentoTableProps {
  statusList: StatusPagamento[]
  isLoading: boolean
  onEdit: (status: StatusPagamento) => void
  onDelete: (status: StatusPagamento) => void
}

export function StatusPagamentoTable({ statusList, isLoading, onEdit, onDelete }: StatusPagamentoTableProps) {
  return (
    <Card title="Status de Pagamento">
      <Table>
        <Thead>
          <tr>
            <Th>Código</Th>
            <Th>Descrição</Th>
            <Th>Cor</Th>
            <Th className="whitespace-nowrap">Ações</Th>
          </tr>
        </Thead>
        <Tbody>
          {isLoading && <EmptyRow cols={4} message="Carregando..." />}
          {!isLoading && statusList.length === 0 && <EmptyRow cols={4} />}
          {!isLoading && statusList.map(s => (
            <tr key={s.id} className="hover:bg-gray-50">
              <Td>{s.id}</Td>
              <Td>
                <Badge color={s.cor}>{s.descricao}</Badge>
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-4 w-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: s.cor }}
                  />
                  <span className="text-xs text-gray-500 font-mono">{s.cor}</span>
                </div>
              </Td>
              <Td>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(s)} title="Editar">
                    <Pencil size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(s)} title="Excluir" className="text-red-500 hover:text-red-700">
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
