import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import http from '../../../shared/api/http'
import { CupomFiscalPage } from './CupomFiscalPage'

vi.mock('../../../shared/api/http', () => ({ default: { get: vi.fn() } }))
vi.mock('qrcode', () => ({ default: { toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,fake') } }))

const navigateMock = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => navigateMock }
})

const cupomCompleto = {
  cupomItens: [
    {
      descricao: 'Produto A',
      quantidade: '2',
      precounitario: '10.00',
      desconto: '0',
      subtotal: '20.00',
      ncm: '1234.56.78',
      icms: '18',
      pis: '1.65',
      cofins: '7.6',
      ipi: '0',
    },
  ],
  totalVendas: 20,
  tributosAproximados: 5.4,
  loja: { nomeFantasia: 'Minha Loja', cpfCnpj: '12345678900', endereco: 'Rua A, 1' },
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/vendas/1/cupom']}>
      <Routes>
        <Route path="/vendas/:id/cupom" element={<CupomFiscalPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CupomFiscalPage', () => {
  it('should show an error when there are no cupomItens', async () => {
    vi.mocked(http.get).mockResolvedValue({ data: { ...cupomCompleto, cupomItens: [] } })
    renderPage()
    expect(await screen.findByText('Nenhum item encontrado nessa venda.')).toBeInTheDocument()
  })

  it('should show an error when the loja is not registered', async () => {
    vi.mocked(http.get).mockResolvedValue({ data: { ...cupomCompleto, loja: null } })
    renderPage()
    expect(await screen.findByText('Dados da loja não cadastrados.')).toBeInTheDocument()
  })

  it('should show a generic error when the request fails', async () => {
    vi.mocked(http.get).mockRejectedValue(new Error('network error'))
    renderPage()
    expect(await screen.findByText('Erro ao carregar o cupom fiscal.')).toBeInTheDocument()
  })

  it('should render the cupom with loja info, items and the QR code', async () => {
    vi.mocked(http.get).mockResolvedValue({ data: cupomCompleto })
    renderPage()

    expect(await screen.findByText('Minha Loja')).toBeInTheDocument()
    expect(screen.getByText(/Produto A/)).toBeInTheDocument()
    expect(screen.getByText(/Subtotal:/)).toBeInTheDocument()
    expect(await screen.findByAltText('QR Code')).toBeInTheDocument()
  })

  it('should navigate back to /vendas', async () => {
    vi.mocked(http.get).mockResolvedValue({ data: { ...cupomCompleto, cupomItens: [] } })
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: /voltar/i }))
    expect(navigateMock).toHaveBeenCalledWith('/vendas')
  })

  it('should call window.print when clicking "Imprimir"', async () => {
    vi.mocked(http.get).mockResolvedValue({ data: cupomCompleto })
    const printSpy = vi.fn()
    vi.stubGlobal('print', printSpy)
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: /imprimir/i }))
    expect(printSpy).toHaveBeenCalledTimes(1)

    vi.unstubAllGlobals()
  })

  it('should navigate back to /vendas from the fully rendered cupom', async () => {
    vi.mocked(http.get).mockResolvedValue({ data: cupomCompleto })
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: /voltar/i }))
    expect(navigateMock).toHaveBeenCalledWith('/vendas')
  })
})
