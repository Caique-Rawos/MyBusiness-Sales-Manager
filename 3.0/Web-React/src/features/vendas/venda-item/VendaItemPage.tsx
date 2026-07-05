import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useVendaItens, useCreateVendaItem, useDeleteVendaItem } from './hooks'
import { useProdutos } from '../../produtos/produto/hooks'
import { VendaItemForm } from './VendaItemForm'
import { VendaItemTable } from './VendaItemTable'
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal'
import Button from '../../../shared/components/ui/Button'
import type { VendaItem } from './types'
import type { VendaItemFormData } from './schemas'

export function VendaItemPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const idVenda = Number(id)
  const [deleting, setDeleting] = useState<VendaItem | null>(null)

  const { data: itens = [], isLoading } = useVendaItens(idVenda)
  const { data: produtos = [] } = useProdutos()
  const createMutation = useCreateVendaItem(idVenda)
  const deleteMutation = useDeleteVendaItem(idVenda)

  function handleSubmit(data: VendaItemFormData) {
    const precoUnitario = parseFloat(data.valor_venda) || 0
    const desconto = parseFloat(data.valor_desconto) || 0
    const quantidade = parseFloat(data.quantidade) || 0
    const subTotal = parseFloat(((precoUnitario - desconto) * quantidade).toFixed(2))

    const payload = {
      idVenda: idVenda,
      idProduto: Number(data.selecionarProduto),
      precoUnitario,
      desconto,
      quantidade,
      subTotal,
    }

    createMutation.mutate(payload, {
      onSuccess: () => toast.success('Item adicionado!'),
      onError: () => toast.error('Erro ao adicionar item.'),
    })
  }

  function handleConfirmDelete() {
    if (!deleting) return
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success('Item removido!')
        setDeleting(null)
      },
      onError: () => {
        toast.error('Erro ao remover item.')
        setDeleting(null)
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/vendas')}>
          <ArrowLeft size={16} />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Itens da Venda #{idVenda}</h1>
      </div>
      <VendaItemForm idVenda={idVenda} produtos={produtos} onSubmit={handleSubmit} isPending={createMutation.isPending} />
      <VendaItemTable itens={itens} isLoading={isLoading} onDelete={setDeleting} />
      <ConfirmModal
        open={!!deleting}
        title="Remover item da venda?"
        description={`"${deleting?.produto?.descricao ?? 'Este item'}" será removido. O estoque será estornado automaticamente.`}
        confirmLabel="Remover"
        isPending={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
