import { useState } from 'react'
import toast from 'react-hot-toast'
import { useContasPagar, useCreateContasPagar, useUpdateContasPagar, useDeleteContasPagar } from './hooks'
import { usePagamentos } from '../pagamento/hooks'
import { useStatusPagamentos } from '../status-pagamento/hooks'
import { ContaForm } from '../ContaForm'
import { ContaTable } from '../ContaTable'
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal'
import type { ContasPagar } from './types'
import type { ContaFormData } from '../schemas'

export function ContasPagarPage() {
  const [editing, setEditing] = useState<ContasPagar | null>(null)
  const [deleting, setDeleting] = useState<ContasPagar | null>(null)

  const { data: contas = [], isLoading } = useContasPagar()
  const { data: formasPagamento = [] } = usePagamentos()
  const { data: statusList = [] } = useStatusPagamentos()
  const createMutation = useCreateContasPagar()
  const updateMutation = useUpdateContasPagar()
  const deleteMutation = useDeleteContasPagar()

  const isPending = createMutation.isPending || updateMutation.isPending

  function buildPayload(data: ContaFormData) {
    return {
      descricao: data.descricao,
      valorTotal: Number(data.valorTotal),
      valorPago: Number(data.valorPago),
      dataVencimento: data.dataVencimento,
      idPagamento: Number(data.idPagamento),
      idStatusPagamento: Number(data.idStatusPagamento),
    }
  }

  function handleSubmit(data: ContaFormData) {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: buildPayload(data) },
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

  function handleEdit(conta: ContasPagar) {
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
      <h1 className="text-2xl font-bold text-gray-900">Contas a Pagar</h1>
      <ContaForm
        title="Nova Conta a Pagar"
        formasPagamento={formasPagamento}
        statusList={statusList}
        onSubmit={handleSubmit}
        isPending={isPending}
        editing={editing}
        onNew={() => setEditing(null)}
      />
      <ContaTable
        title="Contas a Pagar"
        contas={contas}
        isLoading={isLoading}
        onEdit={conta => handleEdit(conta as ContasPagar)}
        onDelete={conta => setDeleting(conta as ContasPagar)}
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
