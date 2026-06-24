import { Pencil, Trash2 } from 'lucide-react'
import type { RegraFiscal } from './types'
import { Card } from '../../../shared/components/ui/Card'
import Button from '../../../shared/components/ui/Button'
import { Table, Thead, Tbody, Th, Td, EmptyRow } from '../../../shared/components/ui/Table'

interface RegraFiscalTableProps {
  regras: RegraFiscal[]
  isLoading: boolean
  onEdit: (regra: RegraFiscal) => void
  onDelete: (regra: RegraFiscal) => void
}

export function RegraFiscalTable({ regras, isLoading, onEdit, onDelete }: RegraFiscalTableProps) {
  return (
    <Card title="Regras Fiscais Cadastradas">
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
              <Th>NCM</Th>
              <Th>ICMS</Th>
              <Th>PIS</Th>
              <Th>COFINS</Th>
              <Th>IPI</Th>
              <Th className="whitespace-nowrap">Ações</Th>
            </tr>
          </Thead>
          <Tbody>
            {regras.length === 0 ? (
              <EmptyRow cols={8} />
            ) : (
              regras.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <Td className="font-medium text-gray-900">{r.id}</Td>
                  <Td>{r.descricao}</Td>
                  <Td>{r.ncm}</Td>
                  <Td>{Number(r.icms).toFixed(2)}%</Td>
                  <Td>{Number(r.pis).toFixed(2)}%</Td>
                  <Td>{Number(r.cofins).toFixed(2)}%</Td>
                  <Td>{Number(r.ipi).toFixed(2)}%</Td>
                  <Td>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => onEdit(r)} title="Editar">
                        <Pencil size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onDelete(r)} title="Excluir" className="text-red-500 hover:text-red-700">
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
