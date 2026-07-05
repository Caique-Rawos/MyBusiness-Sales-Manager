import { useState } from 'react'
import toast from 'react-hot-toast'
import { useStatusPagamentos, useCreateStatusPagamento, useUpdateStatusPagamento, useDeleteStatusPagamento } from './hooks'
import { StatusPagamentoForm } from './StatusPagamentoForm'
import { StatusPagamentoTable } from './StatusPagamentoTable'
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal'
import type { StatusPagamento } from './types'
import type { StatusPagamentoFormData } from './schemas'

export function StatusPagamentoPage() {
  const [editing, setEditing] = useState<StatusPagamento | null>(null)
  const [deleting, setDeleting] = useState<StatusPagamento | null>(null)

  const { data: statusList = [], isLoading } = useStatusPagamentos()
  const createMutation = useCreateStatusPagamento()
  const updateMutation = useUpdateStatusPagamento()
  const deleteMutation = useDeleteStatusPagamento()

  const isPending = createMutation.isPending || updateMutation.isPending

  function handleSubmit(data: StatusPagamentoFormData) {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data },
        {
          onSuccess: () => { toast.success('Status atualizado!'); setEditing(null) },
          onError: () => toast.error('Erro ao atualizar.'),
        },
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => toast.success('Status cadastrado!'),
        onError: () => toast.error('Erro ao cadastrar.'),
      })
    }
  }

  function handleConfirmDelete() {
    if (!deleting) return
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success('Status excluído!')
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
      <h1 className="text-2xl font-bold text-gray-900">Status de Pagamento</h1>
      <StatusPagamentoForm
        editing={editing}
        onSubmit={handleSubmit}
        onNew={() => setEditing(null)}
        isPending={isPending}
      />
      <StatusPagamentoTable
        statusList={statusList}
        isLoading={isLoading}
        onEdit={setEditing}
        onDelete={setDeleting}
      />
      <ConfirmModal
        open={!!deleting}
        title={`Excluir "${deleting?.descricao}"?`}
        description="Esta ação não pode ser desfeita."
        isPending={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
