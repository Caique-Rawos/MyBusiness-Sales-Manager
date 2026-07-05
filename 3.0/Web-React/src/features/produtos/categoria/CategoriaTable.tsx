import { Pencil, Trash2 } from 'lucide-react'
import type { Categoria } from './types'
import { Card } from '../../../shared/components/ui/Card'
import Button from '../../../shared/components/ui/Button'
import { Table, Thead, Tbody, Th, Td, EmptyRow } from '../../../shared/components/ui/Table'

interface CategoriaTableProps {
  categorias: Categoria[]
  isLoading: boolean
  onEdit: (categoria: Categoria) => void
  onDelete: (categoria: Categoria) => void
}

export function CategoriaTable({ categorias, isLoading, onEdit, onDelete }: CategoriaTableProps) {
  return (
    <Card title="Categorias Cadastradas">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Código</Th>
              <Th>Descrição</Th>
              <Th className="whitespace-nowrap">Ações</Th>
            </tr>
          </Thead>
          <Tbody>
            {categorias.length === 0 ? (
              <EmptyRow cols={3} />
            ) : (
              categorias.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <Td className="font-medium text-gray-900">{c.id}</Td>
                  <Td>{c.descricao}</Td>
                  <Td>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => onEdit(c)} title="Editar">
                        <Pencil size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onDelete(c)} title="Excluir" className="text-red-500 hover:text-red-700">
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
