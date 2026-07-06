import { useState } from 'react'
import toast from 'react-hot-toast'
import { isAxiosError } from 'axios'
import { useAuth } from '../../shared/context/AuthContext'
import { Tabs } from '../../shared/components/ui/Tabs'
import { ConfirmModal } from '../../shared/components/ui/ConfirmModal'
import { useUsuarios, useCreateUsuario, useUpdateUsuarioPapeis, useDeleteUsuario } from './usuario/hooks'
import { UsuarioForm } from './usuario/UsuarioForm'
import { UsuarioTable } from './usuario/UsuarioTable'
import { usePapeis, usePermissoes, useCreatePapel, useUpdatePapel, useDeletePapel } from './papel/hooks'
import { PapelForm } from './papel/PapelForm'
import { PapelTable } from './papel/PapelTable'
import type { Papel } from './papel/types'
import type { Usuario } from './usuario/types'
import type { UsuarioFormData } from './usuario/schemas'
import type { PapelFormData } from './papel/schemas'

function extractErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error) && typeof error.response?.data?.message === 'string') {
    return error.response.data.message
  }
  return fallback
}

const TABS = [
  { value: 'usuarios', label: 'Usuários' },
  { value: 'papeis', label: 'Papéis' },
]

export function UsuariosPage() {
  const { hasPermission } = useAuth()
  const [activeTab, setActiveTab] = useState('usuarios')
  const [editingPapel, setEditingPapel] = useState<Papel | null>(null)
  const [deletingUsuario, setDeletingUsuario] = useState<Usuario | null>(null)
  const [deletingPapel, setDeletingPapel] = useState<Papel | null>(null)

  const { data: usuarios = [], isLoading: isLoadingUsuarios } = useUsuarios()
  const { data: papeis = [], isLoading: isLoadingPapeis } = usePapeis()
  const { data: permissoes = [] } = usePermissoes()

  const createUsuarioMutation = useCreateUsuario()
  const updatePapeisMutation = useUpdateUsuarioPapeis()
  const deleteUsuarioMutation = useDeleteUsuario()
  const createPapelMutation = useCreatePapel()
  const updatePapelMutation = useUpdatePapel()
  const deletePapelMutation = useDeletePapel()

  function handleCreateUsuario(data: UsuarioFormData) {
    createUsuarioMutation.mutate(data, {
      onSuccess: () => toast.success('Usuário cadastrado com sucesso!'),
      onError: () => toast.error('Erro ao cadastrar usuário.'),
    })
  }

  function handleUpdatePapeis(usuarioId: number, papelIds: number[]) {
    updatePapeisMutation.mutate(
      { id: usuarioId, papelIds },
      {
        onSuccess: () => toast.success('Papéis atualizados!'),
        onError: () => toast.error('Erro ao atualizar papéis.'),
      },
    )
  }

  function handleConfirmDelete() {
    if (!deletingUsuario) return
    deleteUsuarioMutation.mutate(deletingUsuario.id, {
      onSuccess: () => {
        toast.success('Usuário excluído!')
        setDeletingUsuario(null)
      },
      onError: () => {
        toast.error('Erro ao excluir usuário.')
        setDeletingUsuario(null)
      },
    })
  }

  function handleConfirmDeletePapel() {
    if (!deletingPapel) return
    deletePapelMutation.mutate(deletingPapel.id, {
      onSuccess: () => {
        toast.success('Papel excluído!')
        setDeletingPapel(null)
      },
      onError: error => {
        toast.error(extractErrorMessage(error, 'Erro ao excluir papel.'))
        setDeletingPapel(null)
      },
    })
  }

  function handleSubmitPapel(data: PapelFormData) {
    if (editingPapel) {
      updatePapelMutation.mutate(
        { id: editingPapel.id, data },
        {
          onSuccess: () => { toast.success('Papel atualizado!'); setEditingPapel(null) },
          onError: () => toast.error('Erro ao atualizar papel.'),
        },
      )
    } else {
      createPapelMutation.mutate(data, {
        onSuccess: () => toast.success('Papel criado!'),
        onError: () => toast.error('Erro ao criar papel.'),
      })
    }
  }

  const canListUsuarios = hasPermission('usuario:listar')
  const canCreateUsuario = hasPermission('usuario:criar')
  const canListPapeis = hasPermission('papel:listar')
  const canCreatePapel = hasPermission('papel:criar')
  const canEditPapel = hasPermission('papel:editar')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Usuários e Papéis</h1>

      <Tabs tabs={TABS} value={activeTab} onChange={setActiveTab} />

      {activeTab === 'usuarios' && (
        <div className="space-y-6">
          {canCreateUsuario && (
            <UsuarioForm papeis={papeis} onSubmit={handleCreateUsuario} isPending={createUsuarioMutation.isPending} />
          )}

          {canListUsuarios && (
            <UsuarioTable
              usuarios={usuarios}
              papeis={papeis}
              isLoading={isLoadingUsuarios}
              isSaving={updatePapeisMutation.isPending}
              onUpdatePapeis={handleUpdatePapeis}
              onDelete={setDeletingUsuario}
            />
          )}
        </div>
      )}

      {activeTab === 'papeis' && (
        <div className="space-y-6">
          {canCreatePapel && (
            <PapelForm
              editing={editingPapel}
              permissoes={permissoes}
              onSubmit={handleSubmitPapel}
              onNew={() => setEditingPapel(null)}
              isPending={createPapelMutation.isPending || updatePapelMutation.isPending}
            />
          )}

          {canListPapeis && (
            <PapelTable
              papeis={papeis}
              isLoading={isLoadingPapeis}
              onEdit={papel => (canEditPapel ? setEditingPapel(papel) : undefined)}
              onDelete={setDeletingPapel}
            />
          )}
        </div>
      )}

      <ConfirmModal
        open={!!deletingUsuario}
        title={`Excluir "${deletingUsuario?.nome}"?`}
        description="Esta ação não pode ser desfeita. O usuário perderá o acesso imediatamente."
        isPending={deleteUsuarioMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingUsuario(null)}
      />

      <ConfirmModal
        open={!!deletingPapel}
        title={`Excluir "${deletingPapel?.nome}"?`}
        description="Esta ação não pode ser desfeita. Não é possível excluir um papel atribuído a usuários."
        isPending={deletePapelMutation.isPending}
        onConfirm={handleConfirmDeletePapel}
        onCancel={() => setDeletingPapel(null)}
      />
    </div>
  )
}
