import { useSearchParams } from 'react-router-dom'
import { Printer } from 'lucide-react'
import { useRelatorio } from '../venda/hooks'
import { Table, Thead, Tbody, Th, Td, EmptyRow } from '../../../shared/components/ui/Table'
import Button from '../../../shared/components/ui/Button'
import { Card } from '../../../shared/components/ui/Card'
import { formatCurrency, formatDate } from '../../../shared/lib/utils'

export function RelatorioVendasPage() {
  const [params] = useSearchParams()
  const dataInicio = params.get('dataInicio') ?? ''
  const dataFinal = params.get('dataFinal') ?? ''

  const { data, isLoading } = useRelatorio(dataInicio, dataFinal)
  const vendas = data?.vendas ?? []
  const total = data?.totalVendas ?? 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold text-gray-900">
          Relatório de Vendas — {formatDate(dataInicio)} a {formatDate(dataFinal)}
        </h1>
        <Button type="button" variant="secondary" onClick={() => window.print()}>
          <Printer size={16} />
          Imprimir
        </Button>
      </div>

      <Card>
        <Table>
          <Thead>
            <tr>
              <Th>Código</Th>
              <Th>Cliente</Th>
              <Th>Valor Total</Th>
              <Th>Data</Th>
            </tr>
          </Thead>
          <Tbody>
            {isLoading && <EmptyRow cols={4} message="Carregando..." />}
            {!isLoading && vendas.length === 0 && <EmptyRow cols={4} message="Nenhuma venda no período." />}
            {!isLoading && vendas.map(v => (
              <tr key={v.idVenda}>
                <Td>{v.idVenda}</Td>
                <Td>{v.nomeCliente}</Td>
                <Td>{formatCurrency(v.valorVenda)}</Td>
                <Td>{formatDate(v.dataVenda)}</Td>
              </tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      {!isLoading && vendas.length > 0 && (
        <div className="flex justify-end">
          <p className="text-base font-bold text-gray-900">Total do período: {formatCurrency(total)}</p>
        </div>
      )}
    </div>
  )
}
