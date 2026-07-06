import { Pencil, Trash2 } from 'lucide-react'
import type { ContasPagar } from './contas-pagar/types'
import type { ContasReceber } from './contas-receber/types'
import { Badge } from '../../shared/components/ui/Badge'
import { Table, Thead, Tbody, Th, Td, EmptyRow } from '../../shared/components/ui/Table'
import { formatDate } from '../../shared/lib/utils'
import { Card } from '../../shared/components/ui/Card'
import Button from '../../shared/components/ui/Button'

interface ContaTableProps {
  title: string
  contas: ContasPagar[] | ContasReceber[]
  isLoading: boolean
  showLancamento?: boolean
  onEdit?: (conta: ContasPagar | ContasReceber) => void
  onDelete?: (conta: ContasPagar | ContasReceber) => void
}

export function ContaTable({ title, contas, isLoading, showLancamento, onEdit, onDelete }: ContaTableProps) {
  const hasActions = !!(onEdit || onDelete)
  const totalCols = 5 + (showLancamento ? 1 : 0) + (hasActions ? 1 : 0)

  function getLancamento(conta: ContasPagar | ContasReceber) {
    const idVenda = (conta as ContasReceber).idVenda
    return idVenda ? `Venda #${idVenda}` : 'Manual'
  }

  return (
    <Card title={title}>
      <Table>
        <Thead>
          <tr>
            <Th>Código</Th>
            <Th>Descrição</Th>
            {showLancamento && <Th>Lançamento</Th>}
            <Th>Valor Total</Th>
            <Th>Status</Th>
            <Th>Vencimento</Th>
            {hasActions && <Th className="whitespace-nowrap">Ações</Th>}
          </tr>
        </Thead>
        <Tbody>
          {isLoading && <EmptyRow cols={totalCols} message="Carregando..." />}
          {!isLoading && contas.length === 0 && <EmptyRow cols={totalCols} />}
          {!isLoading && contas.map(conta => (
            <tr key={conta.id}>
              <Td>{conta.id}</Td>
              <Td>{conta.descricao}</Td>
              {showLancamento && <Td>{getLancamento(conta)}</Td>}
              <Td>R$ {conta.valorTotal}</Td>
              <Td>
                <Badge color={conta.statusPagamento?.cor}>
                  {conta.statusPagamento?.descricao ?? '-'}
                </Badge>
              </Td>
              <Td>{formatDate(conta.dataVencimento)}</Td>
              {hasActions && (
                <Td>
                  <div className="flex gap-1">
                    {onEdit && (
                      <Button size="sm" variant="ghost" onClick={() => onEdit(conta)} title="Editar">
                        <Pencil size={14} />
                      </Button>
                    )}
                    {onDelete && (
                      <Button size="sm" variant="ghost" onClick={() => onDelete(conta)} title="Excluir" className="text-red-500 hover:text-red-700">
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </Td>
              )}
            </tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  )
}
