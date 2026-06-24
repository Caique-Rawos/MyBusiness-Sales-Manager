import { Pencil, Trash2 } from 'lucide-react'
import type { Produto } from './types'
import { Card } from '../../../shared/components/ui/Card'
import Button from '../../../shared/components/ui/Button'
import { Table, Thead, Tbody, Th, Td, EmptyRow } from '../../../shared/components/ui/Table'
import { formatCurrency } from '../../../shared/lib/utils'

interface ProdutoTableProps {
  produtos: Produto[]
  isLoading: boolean
  onEdit: (produto: Produto) => void
  onDelete: (produto: Produto) => void
}

export function ProdutoTable({ produtos, isLoading, onEdit, onDelete }: ProdutoTableProps) {
  return (
    <Card title="Produtos Cadastrados">
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
              <Th>Custo</Th>
              <Th>Venda</Th>
              <Th>Estoque</Th>
              <Th>Categoria</Th>
              <Th className="whitespace-nowrap">Ações</Th>
            </tr>
          </Thead>
          <Tbody>
            {produtos.length === 0 ? (
              <EmptyRow cols={7} />
            ) : (
              produtos.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <Td className="font-medium text-gray-900">{p.id}</Td>
                  <Td>{p.descricao}</Td>
                  <Td>{formatCurrency(p.valorCusto)}</Td>
                  <Td>{formatCurrency(p.valorVenda)}</Td>
                  <Td>{p.estoque}</Td>
                  <Td>{p.categoria?.descricao}</Td>
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
              ))
            )}
          </Tbody>
        </Table>
      )}
    </Card>
  )
}
