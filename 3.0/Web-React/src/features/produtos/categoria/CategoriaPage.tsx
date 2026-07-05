import { useState } from 'react'
import toast from 'react-hot-toast'
import { useCategorias, useCreateCategoria, useUpdateCategoria, useDeleteCategoria } from './hooks'
import { CategoriaForm } from './CategoriaForm'
import { CategoriaTable } from './CategoriaTable'
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal'
import type { Categoria } from './types'

export function CategoriaPage() {
  const [editing, setEditing] = useState<Categoria | null>(null)
  const [deleting, setDeleting] = useState<Categoria | null>(null)

  const { data: categorias = [], isLoading } = useCategorias()
  const createMutation = useCreateCategoria()
  const updateMutation = useUpdateCategoria()
  const deleteMutation = useDeleteCategoria()

  const isPending = createMutation.isPending || updateMutation.isPending

  function handleSubmit(data: { descricao: string }) {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data },
        {
          onSuccess: () => { toast.success('Categoria atualizada!'); setEditing(null) },
          onError: () => toast.error('Erro ao atualizar categoria.'),
        },
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => toast.success('Categoria cadastrada!'),
        onError: () => toast.error('Erro ao cadastrar categoria.'),
      })
    }
  }

  function handleConfirmDelete() {
    if (!deleting) return
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success('Categoria excluída!')
        if (editing?.id === deleting.id) setEditing(null)
        setDeleting(null)
      },
      onError: () => {
        toast.error('Erro ao excluir categoria.')
        setDeleting(null)
      },
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
      <CategoriaForm
        editing={editing}
        onSubmit={handleSubmit}
        onNew={() => setEditing(null)}
        isPending={isPending}
      />
      <CategoriaTable
        categorias={categorias}
        isLoading={isLoading}
        onEdit={c => { setEditing(c); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
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
