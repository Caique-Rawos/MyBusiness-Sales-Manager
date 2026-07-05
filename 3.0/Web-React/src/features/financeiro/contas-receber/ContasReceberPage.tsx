import { useState } from 'react'
import toast from 'react-hot-toast'
import { useContasReceber, useCreateContasReceber, useUpdateContasReceber, useDeleteContasReceber } from './hooks'
import { usePagamentos } from '../pagamento/hooks'
import { useStatusPagamentos } from '../status-pagamento/hooks'
import { ContaForm } from '../ContaForm'
import { ContaTable } from '../ContaTable'
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal'
import type { ContasReceber } from './types'
import type { ContaFormData } from '../schemas'

export function ContasReceberPage() {
  const [editing, setEditing] = useState<ContasReceber | null>(null)
  const [deleting, setDeleting] = useState<ContasReceber | null>(null)

  const { data: contas = [], isLoading } = useContasReceber()
  const { data: formasPagamento = [] } = usePagamentos()
  const { data: statusList = [] } = useStatusPagamentos()
  const createMutation = useCreateContasReceber()
  const updateMutation = useUpdateContasReceber()
  const deleteMutation = useDeleteContasReceber()

  const isPending = createMutation.isPending || updateMutation.isPending

  function buildPayload(data: ContaFormData, omitValorTotal = false) {
    const payload: Record<string, unknown> = {
      descricao: data.descricao,
      valorPago: Number(data.valorPago),
      dataVencimento: data.dataVencimento,
      idPagamento: Number(data.idPagamento),
      idStatusPagamento: Number(data.idStatusPagamento),
    }
    if (!omitValorTotal) payload.valorTotal = Number(data.valorTotal)
    return payload
  }

  function handleSubmit(data: ContaFormData) {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: buildPayload(data, !!editing.idVenda) },
        {
          onSuccess: () => { toast.success('Conta atualizada!'); setEditing(null) },
          onError: () => toast.error('Erro ao atualizar.'),
        },
      )
    } else {
      createMutation.mutate(buildPayload(data), {
        onSuccess: () => toast.success('Conta cadastrada!'),
        onError: () => toast.error('Erro ao cadastrar.'),
      })
    }
  }

  function handleEdit(conta: ContasReceber) {
    setEditing(conta)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleConfirmDelete() {
    if (!deleting) return
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success('Conta excluída!')
        if (editing?.id === deleting.id) setEditing(null)
        setDeleting(null)
      },
      onError: () => {
        toast.error('Erro ao excluir.')
        setDeleting(null)
      },
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Contas a Receber</h1>
      <ContaForm
        title="Nova Conta a Receber"
        formasPagamento={formasPagamento}
        statusList={statusList}
        onSubmit={handleSubmit}
        isPending={isPending}
        editing={editing}
        onNew={() => setEditing(null)}
      />
      <ContaTable
        title="Contas a Receber"
        contas={contas}
        isLoading={isLoading}
        showLancamento
        onEdit={conta => handleEdit(conta as ContasReceber)}
        onDelete={conta => setDeleting(conta as ContasReceber)}
      />
      <ConfirmModal
        open={!!deleting}
        title={`Excluir "${deleting?.descricao}"?`}
        description="Esta ação não pode ser desfeita. A conta será removida permanentemente."
        isPending={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
