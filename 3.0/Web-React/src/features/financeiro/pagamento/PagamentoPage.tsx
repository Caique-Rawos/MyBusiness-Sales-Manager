import { useState } from 'react'
import toast from 'react-hot-toast'
import { usePagamentos, useCreatePagamento, useUpdatePagamento, useDeletePagamento } from './hooks'
import { PagamentoForm } from './PagamentoForm'
import { PagamentoTable } from './PagamentoTable'
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal'
import type { Pagamento } from './types'
import type { PagamentoFormData } from './schemas'

export function PagamentoPage() {
  const [editing, setEditing] = useState<Pagamento | null>(null)
  const [deleting, setDeleting] = useState<Pagamento | null>(null)

  const { data: pagamentos = [], isLoading } = usePagamentos()
  const createMutation = useCreatePagamento()
  const updateMutation = useUpdatePagamento()
  const deleteMutation = useDeletePagamento()

  const isPending = createMutation.isPending || updateMutation.isPending

  function handleSubmit(data: PagamentoFormData) {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data },
        {
          onSuccess: () => { toast.success('Forma de pagamento atualizada!'); setEditing(null) },
          onError: () => toast.error('Erro ao atualizar.'),
        },
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => toast.success('Forma de pagamento cadastrada!'),
        onError: () => toast.error('Erro ao cadastrar.'),
      })
    }
  }

  function handleConfirmDelete() {
    if (!deleting) return
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success('Forma de pagamento excluída!')
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
      <h1 className="text-2xl font-bold text-gray-900">Formas de Pagamento</h1>
      <PagamentoForm
        editing={editing}
        onSubmit={handleSubmit}
        onNew={() => setEditing(null)}
        isPending={isPending}
      />
      <PagamentoTable
        pagamentos={pagamentos}
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
