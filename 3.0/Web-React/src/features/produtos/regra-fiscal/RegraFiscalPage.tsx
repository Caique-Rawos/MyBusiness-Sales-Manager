import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRegrasFiscais, useCreateRegraFiscal, useUpdateRegraFiscal, useDeleteRegraFiscal } from './hooks'
import { RegraFiscalForm } from './RegraFiscalForm'
import { RegraFiscalTable } from './RegraFiscalTable'
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal'
import type { RegraFiscal } from './types'
import type { RegraFiscalFormData } from './schemas'

export function RegraFiscalPage() {
  const [editing, setEditing] = useState<RegraFiscal | null>(null)
  const [deleting, setDeleting] = useState<RegraFiscal | null>(null)

  const { data: regras = [], isLoading } = useRegrasFiscais()
  const createMutation = useCreateRegraFiscal()
  const updateMutation = useUpdateRegraFiscal()
  const deleteMutation = useDeleteRegraFiscal()

  const isPending = createMutation.isPending || updateMutation.isPending

  function buildPayload(data: RegraFiscalFormData) {
    return {
      descricao: data.descricao,
      ncm: data.ncm,
      icms: Number(data.icms),
      pis: Number(data.pis),
      cofins: Number(data.cofins),
      ipi: Number(data.ipi),
    }
  }

  function handleSubmit(data: RegraFiscalFormData) {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: buildPayload(data) },
        {
          onSuccess: () => { toast.success('Regra fiscal atualizada!'); setEditing(null) },
          onError: () => toast.error('Erro ao atualizar.'),
        },
      )
    } else {
      createMutation.mutate(buildPayload(data), {
        onSuccess: () => toast.success('Regra fiscal cadastrada!'),
        onError: () => toast.error('Erro ao cadastrar.'),
      })
    }
  }

  function handleEdit(regra: RegraFiscal) {
    setEditing(regra)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleConfirmDelete() {
    if (!deleting) return
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success('Regra fiscal excluída!')
        if (editing?.id === deleting.id) setEditing(null)
        setDeleting(null)
      },
      onError: () => {
        toast.error('Erro ao excluir regra fiscal.')
        setDeleting(null)
      },
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Regras Fiscais</h1>
      <RegraFiscalForm editing={editing} onSubmit={handleSubmit} onNew={() => setEditing(null)} isPending={isPending} />
      <RegraFiscalTable regras={regras} isLoading={isLoading} onEdit={handleEdit} onDelete={setDeleting} />
      <ConfirmModal
        open={!!deleting}
        title={`Excluir "${deleting?.descricao}"?`}
        description="Esta ação não pode ser desfeita. A regra fiscal será removida permanentemente."
        isPending={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
