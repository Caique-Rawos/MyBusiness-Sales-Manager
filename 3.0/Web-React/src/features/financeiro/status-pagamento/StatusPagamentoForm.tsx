import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { statusPagamentoSchema, type StatusPagamentoFormData } from './schemas'
import type { StatusPagamento } from './types'
import Input from '../../../shared/components/ui/Input'
import Button from '../../../shared/components/ui/Button'
import { Card } from '../../../shared/components/ui/Card'

interface StatusPagamentoFormProps {
  editing?: StatusPagamento | null
  onSubmit: (data: StatusPagamentoFormData) => void
  onNew?: () => void
  isPending: boolean
}

export function StatusPagamentoForm({ editing, onSubmit, onNew, isPending }: StatusPagamentoFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<StatusPagamentoFormData>({
    resolver: zodResolver(statusPagamentoSchema),
    defaultValues: { descricao: '', cor: '#3b82f6' },
  })

  useEffect(() => {
    if (editing) {
      reset({ descricao: editing.descricao, cor: editing.cor })
    } else {
      reset({ descricao: '', cor: '#3b82f6' })
    }
  }, [editing, reset])

  function handleFormSubmit(data: StatusPagamentoFormData) {
    onSubmit(data)
    if (!editing) reset()
  }

  return (
    <Card title={editing ? `Editando: ${editing.descricao}` : 'Novo Status de Pagamento'}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Input
              label="Descrição"
              placeholder="Ex: Pago, Pendente, Vencido..."
              error={errors.descricao?.message}
              {...register('descricao')}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Cor</label>
            <input
              type="color"
              className="h-10 w-16 rounded-lg border border-gray-300 cursor-pointer"
              {...register('cor')}
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
