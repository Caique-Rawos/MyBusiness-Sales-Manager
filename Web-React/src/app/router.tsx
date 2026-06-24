import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '../shared/components/layout/Layout'
import { DashboardPage } from '../features/dashboard'
import { ClientesPage } from '../features/clientes'
import { ProdutosPage, CategoriaPage, EstoquePage, RegraFiscalPage } from '../features/produtos'
import {
  VendasPage,
  VendaItemPage,
  CupomFiscalPage,
  RelatorioVendasPage,
  RelatorioClientePage,
  RelatorioDataPage,
} from '../features/vendas'
import {
  ContasPagarPage,
  ContasReceberPage,
  PagamentoPage,
  StatusPagamentoPage,
} from '../features/financeiro'
import { LojaPage } from '../features/loja'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/categorias" element={<CategoriaPage />} />
          <Route path="/estoque" element={<EstoquePage />} />
          <Route path="/regras-fiscais" element={<RegraFiscalPage />} />
          <Route path="/vendas" element={<VendasPage />} />
          <Route path="/vendas/:id/itens" element={<VendaItemPage />} />
          <Route path="/vendas/:id/cupom" element={<CupomFiscalPage />} />
          <Route path="/contas-pagar" element={<ContasPagarPage />} />
          <Route path="/contas-receber" element={<ContasReceberPage />} />
          <Route path="/pagamentos" element={<PagamentoPage />} />
          <Route path="/status-pagamento" element={<StatusPagamentoPage />} />
          <Route path="/loja" element={<LojaPage />} />
          <Route path="/relatorio/vendas" element={<RelatorioVendasPage />} />
          <Route path="/relatorio/cliente" element={<RelatorioClientePage />} />
          <Route path="/relatorio/data" element={<RelatorioDataPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
