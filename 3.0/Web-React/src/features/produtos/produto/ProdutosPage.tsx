import { useState } from 'react'
import toast from 'react-hot-toast'
import { useProdutos, useCreateProduto, useUpdateProduto, useDeleteProduto } from './hooks'
import { useCategorias, useCreateCategoria } from '../categoria/hooks'
import { useRegrasFiscais } from '../regra-fiscal/hooks'
import { ProdutoForm } from './ProdutoForm'
import { ProdutoTable } from './ProdutoTable'
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal'
import type { Produto } from './types'
import type { ProdutoFormData } from './schemas'

export function ProdutosPage() {
  const [editing, setEditing] = useState<Produto | null>(null)
  const [deleting, setDeleting] = useState<Produto | null>(null)

  const { data: produtos = [], isLoading } = useProdutos()
  const { data: categorias = [] } = useCategorias()
  const { data: regrasFiscais = [] } = useRegrasFiscais()
  const createMutation = useCreateProduto()
  const updateMutation = useUpdateProduto()
  const deleteMutation = useDeleteProduto()
  const createCategoriaMutation = useCreateCategoria()

  const isPending = createMutation.isPending || updateMutation.isPending

  function buildPayload(data: ProdutoFormData) {
    return {
      descricao: data.descricao,
      codigoDeBarra: data.codigoDeBarra,
      valorCusto: Number(data.precoCusto),
      valorVenda: Number(data.precoVenda),
      estoque: Number(data.estoque),
      unidade: data.unidade,
      idCategoria: Number(data.idCategoria),
      idRegraFiscal: Number(data.idRegraFiscal),
    }
  }

  function handleSubmit(data: ProdutoFormData) {
    if (editing) {
      const { estoque: _estoque, ...payload } = buildPayload(data)
      updateMutation.mutate(
        { id: editing.id, data: payload },
        {
          onSuccess: () => { toast.success('Produto atualizado!'); setEditing(null) },
          onError: () => toast.error('Erro ao atualizar produto.'),
        },
      )
    } else {
      createMutation.mutate(buildPayload(data), {
        onSuccess: () => toast.success('Produto cadastrado!'),
        onError: () => toast.error('Erro ao cadastrar produto.'),
      })
    }
  }

  function handleEdit(produto: Produto) {
    setEditing(produto)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleConfirmDelete() {
    if (!deleting) return
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success('Produto excluído!')
        if (editing?.id === deleting.id) setEditing(null)
        setDeleting(null)
      },
      onError: () => {
        toast.error('Erro ao excluir produto.')
        setDeleting(null)
      },
    })
  }

  function handleCreateCategoria(descricao: string, onSuccess: (id: number) => void) {
    createCategoriaMutation.mutate(
      { descricao },
      {
        onSuccess: (data) => { toast.success('Categoria criada!'); onSuccess(data.id) },
        onError: () => toast.error('Erro ao criar categoria.'),
      },
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
      <ProdutoForm
        editing={editing}
        categorias={categorias}
        regrasFiscais={regrasFiscais}
        onSubmit={handleSubmit}
        onNew={() => setEditing(null)}
        onCreateCategoria={handleCreateCategoria}
        isPending={isPending}
      />
      <ProdutoTable
        produtos={produtos}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={setDeleting}
      />
      <ConfirmModal
        open={!!deleting}
        title={`Excluir "${deleting?.descricao}"?`}
        description="Esta ação não pode ser desfeita. O produto será removido permanentemente."
        isPending={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
