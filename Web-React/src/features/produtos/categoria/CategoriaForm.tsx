import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Categoria } from './types'
import Input from '../../../shared/components/ui/Input'
import Button from '../../../shared/components/ui/Button'
import { Card } from '../../../shared/components/ui/Card'

const categoriaSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
})

type CategoriaFormData = z.infer<typeof categoriaSchema>

interface CategoriaFormProps {
  editing: Categoria | null
  onSubmit: (data: CategoriaFormData) => void
  onNew: () => void
  isPending: boolean
}

export function CategoriaForm({ editing, onSubmit, onNew, isPending }: CategoriaFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
  })

  useEffect(() => {
    reset({ descricao: editing?.descricao ?? '' })
  }, [editing, reset])

  function handleFormSubmit(data: CategoriaFormData) {
    onSubmit(data)
    if (!editing) reset()
  }

  return (
    <Card title={editing ? `Editando: ${editing.descricao}` : 'Nova Categoria'}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Descrição"
          placeholder="Nome da categoria"
          error={errors.descricao?.message}
          {...register('descricao')}
        />
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
  )
}
