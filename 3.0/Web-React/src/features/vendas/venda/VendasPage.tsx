import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useVendas, useCreateVenda, useDeleteVenda } from './hooks'
import { useClientes } from '../../clientes/hooks'
import { VendaForm } from './VendaForm'
import { VendaTable } from './VendaTable'
import { RelatorioModal } from './RelatorioModal'
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal'
import type { Venda } from './types'
import type { VendaFormData } from './schemas'

export function VendasPage() {
  const navigate = useNavigate()
  const [relatorioModal, setRelatorioModal] = useState(false)
  const [deleting, setDeleting] = useState<Venda | null>(null)

  const { data: vendas = [], isLoading } = useVendas()
  const { data: clientes = [] } = useClientes()
  const createVendaMutation = useCreateVenda()
  const deleteVendaMutation = useDeleteVenda()

  function handleSubmit(data: VendaFormData) {
    createVendaMutation.mutate(
      { idCliente: Number(data.selecionarCliente), dataVenda: data.dataVenda },
      {
        onSuccess: () => toast.success('Venda cadastrada!'),
        onError: () => toast.error('Erro ao cadastrar venda.'),
      },
    )
  }

  function handleRelatorio(dataInicio: string, dataFinal: string, tipo: string) {
    const routes: Record<string, string> = {
      '1': '/relatorio/vendas',
      '2': '/relatorio/cliente',
      '3': '/relatorio/data',
    }
    const path = routes[tipo] ?? '/relatorio/vendas'
    navigate(`${path}?dataInicio=${dataInicio}&dataFinal=${dataFinal}`)
  }

  function handleConfirmDelete() {
    if (!deleting) return
    deleteVendaMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success('Venda excluída!')
        setDeleting(null)
      },
      onError: () => {
        toast.error('Erro ao excluir venda.')
        setDeleting(null)
      },
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
      <VendaForm
        clientes={clientes}
        onSubmit={handleSubmit}
        isPending={createVendaMutation.isPending}
        onRelatorio={() => setRelatorioModal(true)}
      />
      <VendaTable
        vendas={vendas}
        isLoading={isLoading}
        onAddItens={(id) => navigate(`/vendas/${id}/itens`)}
        onCupom={(id) => navigate(`/vendas/${id}/cupom`)}
        onDelete={setDeleting}
      />
      <RelatorioModal
        open={relatorioModal}
        onClose={() => setRelatorioModal(false)}
        onGerar={handleRelatorio}
      />
      <ConfirmModal
        open={!!deleting}
        title={`Excluir venda #${deleting?.id}?`}
        description="Os itens e a conta a receber vinculados serão removidos automaticamente."
        isPending={deleteVendaMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
