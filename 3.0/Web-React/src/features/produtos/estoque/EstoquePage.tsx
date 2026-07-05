import { useState } from 'react'
import { useMovimentosEstoque } from './hooks'
import { useProdutos } from '../produto/hooks'
import { Card } from '../../../shared/components/ui/Card'
import { Badge } from '../../../shared/components/ui/Badge'
import { Table, Thead, Tbody, Th, Td, EmptyRow } from '../../../shared/components/ui/Table'
import Input from '../../../shared/components/ui/Input'
import Select from '../../../shared/components/ui/Select'
import { formatDate } from '../../../shared/lib/utils'
import type { FiltroEstoque, TipoMovimento } from './types'

const TIPO_CONFIG: Record<TipoMovimento, { label: string; color: string }> = {
  ENTRADA:      { label: 'Entrada',       color: '#16a34a' },
  SAIDA:        { label: 'Saída',         color: '#dc2626' },
  ESTORNO_SAIDA:{ label: 'Estorno',       color: '#d97706' },
}

export function EstoquePage() {
  const [filtro, setFiltro] = useState<FiltroEstoque>({})

  const { data: movimentos = [], isLoading } = useMovimentosEstoque(filtro)
  const { data: produtos = [] } = useProdutos()

  function handleFiltro(campo: keyof FiltroEstoque, valor: string) {
    setFiltro(prev => ({
      ...prev,
      [campo]: campo === 'idProduto' ? (valor ? Number(valor) : undefined) : (valor || undefined),
    }))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Consulta de Estoque</h1>

      <Card title="Filtros">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Data Início"
            type="date"
            value={filtro.dataInicio ?? ''}
            onChange={e => handleFiltro('dataInicio', e.target.value)}
          />
          <Input
            label="Data Fim"
            type="date"
            value={filtro.dataFim ?? ''}
            onChange={e => handleFiltro('dataFim', e.target.value)}
          />
          <Select
            label="Produto"
            placeholder="Todos os produtos"
            options={produtos.map(p => ({ value: p.id, label: p.descricao }))}
            value={filtro.idProduto ?? ''}
            onChange={e => handleFiltro('idProduto', e.target.value)}
          />
        </div>
      </Card>

      <Card title="Movimentações">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Código</Th>
                <Th>Produto</Th>
                <Th>Tipo</Th>
                <Th>Quantidade</Th>
                <Th>Venda</Th>
                <Th>Data</Th>
              </tr>
            </Thead>
            <Tbody>
              {movimentos.length === 0 ? (
                <EmptyRow cols={6} />
              ) : (
                movimentos.map(m => {
                  const tipo = TIPO_CONFIG[m.tipo]
                  return (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <Td className="font-medium text-gray-900">{m.id}</Td>
                      <Td>{m.produto?.descricao ?? `#${m.idProduto}`}</Td>
                      <Td>
                        <Badge color={tipo.color}>{tipo.label}</Badge>
                      </Td>
                      <Td>{m.quantidade}</Td>
                      <Td>{m.idVenda ? `#${m.idVenda}` : '—'}</Td>
                      <Td>{formatDate(m.dataMovimento)}</Td>
                    </tr>
                  )
                })
              )}
            </Tbody>
          </Table>
        )}
      </Card>
    </div>
  )
}
