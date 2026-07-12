import { Pencil, Trash2 } from 'lucide-react'
import type { Papel } from './types'
import { Card } from '../../../shared/components/ui/Card'
import Button from '../../../shared/components/ui/Button'
import { Badge } from '../../../shared/components/ui/Badge'
import { Table, Thead, Tbody, Th, Td, EmptyRow } from '../../../shared/components/ui/Table'

interface PapelTableProps {
  papeis: Papel[]
  isLoading: boolean
  onEdit: (papel: Papel) => void
  onDelete: (papel: Papel) => void
}

export function PapelTable({ papeis, isLoading, onEdit, onDelete }: PapelTableProps) {
  return (
    <Card title="Papéis cadastrados">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Nome</Th>
              <Th>Permissões</Th>
              <Th className="whitespace-nowrap">Ações</Th>
            </tr>
          </Thead>
          <Tbody>
            {papeis.length === 0 ? (
              <EmptyRow cols={3} />
            ) : (
              papeis.map(papel => (
                <tr key={papel.id} className="hover:bg-gray-50">
                  <Td className="font-medium text-gray-900">{papel.nome}</Td>
                  <Td>
                    <Badge>{papel.permissoes.length} permissões</Badge>
                  </Td>
                  <Td>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => onEdit(papel)} title="Editar">
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(papel)}
                        title="Excluir"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </Tbody>
        </Table>
      )}
    </Card>
  )
}
