import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pagamentoSchema, type PagamentoFormData } from './schemas'
import type { Pagamento } from './types'
import Input from '../../../shared/components/ui/Input'
import Button from '../../../shared/components/ui/Button'
import { Card } from '../../../shared/components/ui/Card'

interface PagamentoFormProps {
  editing?: Pagamento | null
  onSubmit: (data: PagamentoFormData) => void
  onNew?: () => void
  isPending: boolean
}

export function PagamentoForm({ editing, onSubmit, onNew, isPending }: PagamentoFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PagamentoFormData>({
    resolver: zodResolver(pagamentoSchema),
  })

  useEffect(() => {
    if (editing) {
      reset({ descricao: editing.descricao })
    } else {
      reset({ descricao: '' })
    }
  }, [editing, reset])

  function handleFormSubmit(data: PagamentoFormData) {
    onSubmit(data)
    if (!editing) reset()
  }

  return (
    <Card title={editing ? `Editando: ${editing.descricao}` : 'Nova Forma de Pagamento'}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Input
              label="Descrição"
              placeholder="Ex: Dinheiro, Cartão..."
              error={errors.descricao?.message}
              {...register('descricao')}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : editing ? 'Atualizar' : 'Cadastrar'}
          </Button>
          {editing && onNew && (
            <Button type="button" variant="secondary" onClick={onNew}>Novo</Button>
          )}
        </div>
      </form>
    </Card>
  )
}
