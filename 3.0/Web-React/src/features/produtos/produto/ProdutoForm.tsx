import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { produtoSchema, type ProdutoFormData } from './schemas'
import type { Produto } from './types'
import type { Categoria } from '../categoria/types'
import type { RegraFiscal } from '../regra-fiscal/types'
import Input from '../../../shared/components/ui/Input'
import Select from '../../../shared/components/ui/Select'
import Button from '../../../shared/components/ui/Button'
import { Card } from '../../../shared/components/ui/Card'
import { Modal } from '../../../shared/components/ui/Modal'

interface ProdutoFormProps {
  editing: Produto | null
  categorias: Categoria[]
  regrasFiscais: RegraFiscal[]
  onSubmit: (data: ProdutoFormData) => void
  onNew: () => void
  onCreateCategoria: (descricao: string, onSuccess: (id: number) => void) => void
  isPending: boolean
}

export function ProdutoForm({ editing, categorias, regrasFiscais, onSubmit, onNew, onCreateCategoria, isPending }: ProdutoFormProps) {
  const [categoriaModal, setCategoriaModal] = useState(false)
  const [novaCategoria, setNovaCategoria] = useState('')
  const [pendingCategoriaId, setPendingCategoriaId] = useState<number | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: { precoCusto: '0.00', precoVenda: '0.00', estoque: '0' },
  })

  useEffect(() => {
    if (editing) {
      reset({
        descricao: editing.descricao,
        codigoDeBarra: editing.codigoDeBarra ?? '',
        precoCusto: editing.valorCusto,
        precoVenda: editing.valorVenda,
        estoque: String(editing.estoque),
        unidade: editing.unidade ?? '',
        idCategoria: String(editing.categoria?.id ?? ''),
        idRegraFiscal: String(editing.regraFiscal?.id ?? ''),
      })
    } else {
      reset({ descricao: '', codigoDeBarra: '', precoCusto: '0.00', precoVenda: '0.00', estoque: '0', unidade: '', idCategoria: '', idRegraFiscal: '' })
    }
  }, [editing, reset])

  useEffect(() => {
    if (pendingCategoriaId && categorias.some(c => c.id === pendingCategoriaId)) {
      setValue('idCategoria', String(pendingCategoriaId))
      setPendingCategoriaId(null)
    }
  }, [categorias, pendingCategoriaId, setValue])

  function handleCategoriaSubmit() {
    if (!novaCategoria.trim()) return
    onCreateCategoria(novaCategoria, (id) => {
      setPendingCategoriaId(id)
      setNovaCategoria('')
      setCategoriaModal(false)
    })
  }

  return (
    <>
      <Card title={editing ? 'Editando Produto' : 'Novo Produto'}>
        <form onSubmit={handleSubmit(data => {
          onSubmit(data)
          if (!editing) reset({ descricao: '', codigoDeBarra: '', precoCusto: '0.00', precoVenda: '0.00', estoque: '0', unidade: '', idCategoria: '', idRegraFiscal: '' })
        })} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Input label="Descrição" placeholder="Nome do produto" error={errors.descricao?.message} {...register('descricao')} />
            </div>
            <Input label="Código de Barras" placeholder="EAN-13" {...register('codigoDeBarra')} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="Preço de Custo" type="number" step="0.01" min="0" {...register('precoCusto')} />
            <Input label="Preço de Venda" type="number" step="0.01" min="0" {...register('precoVenda')} />
            <Input label="Estoque" type="number" min="0" readOnly={!!editing} className={editing ? 'bg-gray-100 cursor-not-allowed' : ''} {...register('estoque')} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="Unidade" placeholder="UN, KG, LT..." {...register('unidade')} />
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Select
                  label="Categoria"
                  error={errors.idCategoria?.message}
                  options={categorias.map(c => ({ value: c.id, label: c.descricao }))}
                  placeholder="Selecione..."
                  {...register('idCategoria')}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="invisible select-none text-sm font-medium">_</span>
                <Button type="button" variant="secondary" onClick={() => setCategoriaModal(true)} title="Nova categoria" className="px-2 border border-transparent">
                  <Plus size={20} />
                </Button>
              </div>
            </div>
            <Select
              label="Regra Fiscal"
              error={errors.idRegraFiscal?.message}
              options={regrasFiscais.map(r => ({ value: r.id, label: r.descricao }))}
              placeholder="Selecione..."
              {...register('idRegraFiscal')}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : editing ? 'Atualizar' : 'Cadastrar'}
            </Button>
            {editing && (
              <Button type="button" variant="secondary" onClick={onNew}>Novo</Button>
            )}
          </div>
        </form>
      </Card>

      <Modal open={categoriaModal} onClose={() => setCategoriaModal(false)} title="Nova Categoria">
        <div className="space-y-4">
          <Input
            label="Descrição"
            value={novaCategoria}
            onChange={e => setNovaCategoria(e.target.value)}
            placeholder="Nome da categoria"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setCategoriaModal(false)}>Fechar</Button>
            <Button onClick={handleCategoriaSubmit} disabled={!novaCategoria.trim()}>Cadastrar</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
