import { useState } from 'react'
import toast from 'react-hot-toast'
import { useClientes, useCreateCliente, useUpdateCliente, useDeleteCliente } from './hooks'
import { ClienteForm } from './ClienteForm'
import { ClienteTable } from './ClienteTable'
import { ConfirmModal } from '../../shared/components/ui/ConfirmModal'
import type { Cliente } from './types'
import type { ClienteFormData } from './schemas'

export function ClientesPage() {
  const [editing, setEditing] = useState<Cliente | null>(null)
  const [deleting, setDeleting] = useState<Cliente | null>(null)

  const { data: clientes = [], isLoading } = useClientes()
  const createMutation = useCreateCliente()
  const updateMutation = useUpdateCliente()
  const deleteMutation = useDeleteCliente()

  const isPending = createMutation.isPending || updateMutation.isPending

  function handleSubmit(data: ClienteFormData) {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data },
        {
          onSuccess: () => { toast.success('Atualizado com sucesso!'); setEditing(null) },
          onError: () => toast.error('Erro ao atualizar cliente.'),
        },
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => toast.success('Cliente cadastrado!'),
        onError: () => toast.error('Erro ao cadastrar cliente.'),
      })
    }
  }

  function handleEdit(cliente: Cliente) {
    setEditing(cliente)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleConfirmDelete() {
    if (!deleting) return
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success('Cliente excluído!')
        if (editing?.id === deleting.id) setEditing(null)
        setDeleting(null)
      },
      onError: () => {
        toast.error('Erro ao excluir cliente.')
        setDeleting(null)
      },
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
      <ClienteForm
        editing={editing}
        onSubmit={handleSubmit}
        onNew={() => setEditing(null)}
        isPending={isPending}
      />
      <ClienteTable
        clientes={clientes}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={setDeleting}
      />
      <ConfirmModal
        open={!!deleting}
        title={`Excluir "${deleting?.nome}"?`}
        description="Esta ação não pode ser desfeita. O cliente será removido permanentemente."
        isPending={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
