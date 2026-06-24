import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Printer, ArrowLeft } from 'lucide-react'
import QRCode from 'qrcode'
import http from '../../../shared/api/http'
import Button from '../../../shared/components/ui/Button'

const BITCOIN_ADDRESS = 'bc1q0a9gnhf0h4chfmtvjrj33eu3mtszryxyyead84'

interface CupomItem {
  descricao: string
  quantidade: string
  precounitario: string
  desconto: string
  subtotal: string
  ncm: string
  icms: string
  pis: string
  cofins: string
  ipi: string
}

interface CupomData {
  cupomItens: CupomItem[]
  totalVendas: number
  tributosAproximados: number
  loja: {
    nomeFantasia: string
    cpfCnpj: string
    ie?: string
    endereco: string
  } | null
}

function formatPct(valor: string | number): string {
  const n = typeof valor === 'string' ? parseFloat(valor) : valor
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',')
}

function gerarNfce(): string {
  const q4 = () => Math.floor(1000 + Math.random() * 9000)
  const q2 = () => Math.floor(10 + Math.random() * 90)
  return `${q4()}${q2()}`
}

function gerarChaveAcesso(): string {
  const q4 = () => Math.floor(1000 + Math.random() * 9000)
  const q2 = () => Math.floor(10 + Math.random() * 90)
  return Array.from({ length: 11 }, q4).join(' ') + ' ' + q2()
}

function formatarDataHora(): string {
  const agora = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(agora.getDate())}/${pad(agora.getMonth() + 1)}/${agora.getFullYear()} ${pad(agora.getHours())}:${pad(agora.getMinutes())}:${pad(agora.getSeconds())}`
}

export function CupomFiscalPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [cupom, setCupom] = useState<CupomData | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [nfce] = useState(gerarNfce)
  const [chaveAcesso] = useState(gerarChaveAcesso)
  const [dataHora] = useState(formatarDataHora)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    http
      .get<CupomData>(`/venda-relatorio/cupom_fiscal/${id}`)
      .then(r => {
        if (!r.data.cupomItens?.length) {
          setErro('Nenhum item encontrado nessa venda.')
        } else if (!r.data.loja) {
          setErro('Dados da loja não cadastrados.')
        } else {
          setCupom(r.data)
          const uri = `bitcoin:${BITCOIN_ADDRESS}?amount=${parseFloat(String(r.data.totalVendas)).toFixed(2)}`
          QRCode.toDataURL(uri, { width: 150, margin: 1 }).then(setQrDataUrl)
        }
      })
      .catch(() => setErro('Erro ao carregar o cupom fiscal.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (erro) {
    return (
      <div className="space-y-4">
        <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/vendas')} className="print:hidden">
          <ArrowLeft size={16} /> Voltar
        </Button>
        <p className="text-center text-red-500">{erro}</p>
      </div>
    )
  }

  if (!cupom) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 print:hidden">
        <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/vendas')}>
          <ArrowLeft size={16} /> Voltar
        </Button>
        <Button type="button" variant="secondary" onClick={() => window.print()}>
          <Printer size={16} /> Imprimir
        </Button>
      </div>

      <div id="cupomFiscal" className="mx-auto max-w-sm border border-gray-200 bg-white p-5 font-mono text-xs shadow-sm">
        <h3 className="text-center text-sm font-bold uppercase">{cupom.loja!.nomeFantasia}</h3>
        <p className="text-center">
          CNPJ: {cupom.loja!.cpfCnpj}<br />
          {cupom.loja!.ie && <>IE: {cupom.loja!.ie}<br /></>}
          {cupom.loja!.endereco}
        </p>

        <hr className="my-2 border-dashed border-gray-400" />

        {cupom.cupomItens.map((item, i) => (
          <div key={i} className="mb-3">
            <p>{parseFloat(item.quantidade).toFixed(0)}x {item.descricao}</p>
            <p>NCM: {item.ncm}</p>
            <p>
              Vlr Unit: R$ {parseFloat(item.precounitario).toFixed(2).replace('.', ',')} | Total: R$ {parseFloat(item.subtotal).toFixed(2).replace('.', ',')}
            </p>
            <p>
              ICMS: {formatPct(item.icms)}% | PIS: {formatPct(item.pis)}% | COFINS: {formatPct(item.cofins)}% | IPI: {formatPct(item.ipi)}%
            </p>
          </div>
        ))}

        <hr className="my-2 border-dashed border-gray-400" />
        <p><strong>Subtotal:</strong> R$ {parseFloat(String(cupom.totalVendas)).toFixed(2).replace('.', ',')}</p>
        <hr className="my-2 border-dashed border-gray-400" />

        <p>
          <strong>Tributos aproximados:</strong> R$ {parseFloat(String(cupom.tributosAproximados)).toFixed(2).replace('.', ',')} (Fonte: IBPT)
        </p>

        <p className="mt-2">NFC-e nº {nfce}</p>
        <p>Chave de Acesso: {chaveAcesso}</p>

        {qrDataUrl && (
          <div className="my-3 flex justify-center">
            <img src={qrDataUrl} alt="QR Code" width={150} height={150} />
          </div>
        )}

        <p className="text-center">Emitido em: {dataHora}</p>
      </div>
    </div>
  )
}
