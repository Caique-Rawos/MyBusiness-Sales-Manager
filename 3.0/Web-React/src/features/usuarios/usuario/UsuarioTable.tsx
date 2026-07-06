import { useState } from 'react'
import { Pencil, Crown, Trash2 } from 'lucide-react'
import type { Usuario } from './types'
import type { PapelResumo } from '../papel/types'
import { Card } from '../../../shared/components/ui/Card'
import Button from '../../../shared/components/ui/Button'
import { Badge } from '../../../shared/components/ui/Badge'
import { Modal } from '../../../shared/components/ui/Modal'
import { Table, Thead, Tbody, Th, Td, EmptyRow } from '../../../shared/components/ui/Table'

interface UsuarioTableProps {
  usuarios: Usuario[]
  papeis: PapelResumo[]
  isLoading: boolean
  isSaving: boolean
  onUpdatePapeis: (usuarioId: number, papelIds: number[]) => void
  onDelete: (usuario: Usuario) => void
}

export function UsuarioTable({ usuarios, papeis, isLoading, isSaving, onUpdatePapeis, onDelete }: UsuarioTableProps) {
  const [editing, setEditing] = useState<Usuario | null>(null)
  const [selectedPapelIds, setSelectedPapelIds] = useState<number[]>([])

  function openEdit(usuario: Usuario) {
    setEditing(usuario)
    setSelectedPapelIds(usuario.papeis.map(p => p.id))
  }

  function handleSave() {
    if (!editing) return
    onUpdatePapeis(editing.id, selectedPapelIds)
    setEditing(null)
  }

  return (
    <Card title="Usuários da loja">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Nome</Th>
              <Th>E-mail</Th>
              <Th>Papéis</Th>
              <Th className="whitespace-nowrap">Ações</Th>
            </tr>
          </Thead>
          <Tbody>
            {usuarios.length === 0 ? (
              <EmptyRow cols={4} />
            ) : (
              usuarios.map(usuario => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <Td className="font-medium text-gray-900">
                    <div className="flex items-center gap-1.5">
                      {usuario.nome}
                      {usuario.isOwner && (
                        <span title="Dono da loja">
                          <Crown size={14} className="text-amber-500" />
                        </span>
                      )}
                    </div>
                  </Td>
                  <Td>{usuario.email}</Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {usuario.isOwner ? (
                        <Badge color="#d97706">Acesso total</Badge>
                      ) : usuario.papeis.length === 0 ? (
                        <span className="text-sm text-gray-400">Sem papel</span>
                      ) : (
                        usuario.papeis.map(papel => <Badge key={papel.id}>{papel.nome}</Badge>)
                      )}
                    </div>
                  </Td>
                  <Td>
                    {!usuario.isOwner && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(usuario)} title="Editar papéis">
                          <Pencil size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(usuario)}
                          title="Excluir"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    )}
                  </Td>
                </tr>
              ))
            )}
          </Tbody>
        </Table>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={`Papéis de ${editing?.nome}`}>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {papeis.length === 0 ? (
              <span className="text-sm text-gray-400">Nenhum papel cadastrado ainda.</span>
            ) : (
              papeis.map(papel => (
                <label key={papel.id} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={selectedPapelIds.includes(papel.id)}
                    onChange={e => {
                      setSelectedPapelIds(prev =>
                        e.target.checked ? [...prev, papel.id] : prev.filter(id => id !== papel.id),
                      )
                    }}
                  />
                  {papel.nome}
                </label>
              ))
            )}
          </div>
          <div className="flex gap-3">
            <Button className="flex-1" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  )
}
