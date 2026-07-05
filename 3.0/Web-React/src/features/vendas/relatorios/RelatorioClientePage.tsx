import { useSearchParams } from 'react-router-dom'
import { Printer } from 'lucide-react'
import { useRelatorioCliente } from '../venda/hooks'
import { Table, Thead, Tbody, Th, Td, EmptyRow } from '../../../shared/components/ui/Table'
import Button from '../../../shared/components/ui/Button'
import { Card } from '../../../shared/components/ui/Card'
import { formatCurrency, formatDate } from '../../../shared/lib/utils'

export function RelatorioClientePage() {
  const [params] = useSearchParams()
  const dataInicio = params.get('dataInicio') ?? ''
  const dataFinal = params.get('dataFinal') ?? ''

  const { data, isLoading } = useRelatorioCliente(dataInicio, dataFinal)
  const clientes = data?.vendas ?? []
  const total = data?.totalVendas ?? 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold text-gray-900">
          Relatório por Cliente — {formatDate(dataInicio)} a {formatDate(dataFinal)}
        </h1>
        <Button type="button" variant="secondary" onClick={() => window.print()}>
          <Printer size={16} />
          Imprimir
        </Button>
      </div>

      <Card title="Resumo por Cliente">
        <Table>
          <Thead>
            <tr>
              <Th>Cliente</Th>
              <Th>Qtd. Vendas</Th>
              <Th>Total</Th>
            </tr>
          </Thead>
          <Tbody>
            {isLoading && <EmptyRow cols={3} message="Carregando..." />}
            {!isLoading && clientes.length === 0 && <EmptyRow cols={3} message="Nenhuma venda no período." />}
            {!isLoading && clientes.map(c => (
              <tr key={c.idCliente}>
                <Td>{c.nomeCliente}</Td>
                <Td>{c.quantidadeVendas}</Td>
                <Td>{formatCurrency(c.valorVendas)}</Td>
              </tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      {!isLoading && clientes.length > 0 && (
        <div className="flex justify-end">
          <p className="text-base font-bold text-gray-900">Total do período: {formatCurrency(total)}</p>
        </div>
      )}
    </div>
  )
}
