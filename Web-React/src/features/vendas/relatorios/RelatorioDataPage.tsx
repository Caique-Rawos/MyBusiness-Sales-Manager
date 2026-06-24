import { useSearchParams } from 'react-router-dom'
import { Printer } from 'lucide-react'
import { useRelatorioData } from '../venda/hooks'
import { Table, Thead, Tbody, Th, Td, EmptyRow } from '../../../shared/components/ui/Table'
import Button from '../../../shared/components/ui/Button'
import { Card } from '../../../shared/components/ui/Card'
import { formatCurrency, formatDate } from '../../../shared/lib/utils'

export function RelatorioDataPage() {
  const [params] = useSearchParams()
  const dataInicio = params.get('dataInicio') ?? ''
  const dataFinal = params.get('dataFinal') ?? ''

  const { data, isLoading } = useRelatorioData(dataInicio, dataFinal)
  const datas = data?.datas ?? []
  const total = data?.totalVendas ?? 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold text-gray-900">
          Relatório por Data — {formatDate(dataInicio)} a {formatDate(dataFinal)}
        </h1>
        <Button type="button" variant="secondary" onClick={() => window.print()}>
          <Printer size={16} />
          Imprimir
        </Button>
      </div>

      <Card title="Resumo por Data">
        <Table>
          <Thead>
            <tr>
              <Th>Data</Th>
              <Th>Qtd. Clientes</Th>
              <Th>Total</Th>
            </tr>
          </Thead>
          <Tbody>
            {isLoading && <EmptyRow cols={3} message="Carregando..." />}
            {!isLoading && datas.length === 0 && <EmptyRow cols={3} message="Nenhuma venda no período." />}
            {!isLoading && datas.map(d => (
              <tr key={d.data}>
                <Td>{formatDate(d.data)}</Td>
                <Td>{d.contagemCliente}</Td>
                <Td>{formatCurrency(d.totalVendas)}</Td>
              </tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      {!isLoading && datas.length > 0 && (
        <div className="flex justify-end">
          <p className="text-base font-bold text-gray-900">Total geral: {formatCurrency(total)}</p>
        </div>
      )}
    </div>
  )
}
