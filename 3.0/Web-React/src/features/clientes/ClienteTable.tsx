import { Pencil, Trash2 } from 'lucide-react'
import type { Cliente } from './types'
import { Card } from '../../shared/components/ui/Card'
import Button from '../../shared/components/ui/Button'
import { Table, Thead, Tbody, Th, Td, EmptyRow } from '../../shared/components/ui/Table'
import { formatCpfCnpj } from '../../shared/lib/utils'

interface ClienteTableProps {
  clientes: Cliente[]
  isLoading: boolean
  onEdit: (cliente: Cliente) => void
  onDelete: (cliente: Cliente) => void
}

export function ClienteTable({ clientes, isLoading, onEdit, onDelete }: ClienteTableProps) {
  return (
    <Card title="Clientes Cadastrados">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Código</Th>
              <Th>Nome</Th>
              <Th>CPF/CNPJ</Th>
              <Th className="whitespace-nowrap">Ações</Th>
            </tr>
          </Thead>
          <Tbody>
            {clientes.length === 0 ? (
              <EmptyRow cols={4} />
            ) : (
              clientes.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <Td className="font-medium text-gray-900">{c.id}</Td>
                  <Td>{c.nome}</Td>
                  <Td>{formatCpfCnpj(c.cpfCnpj)}</Td>
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
