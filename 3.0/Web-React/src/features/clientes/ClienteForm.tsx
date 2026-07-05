import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clienteSchema, type ClienteFormData } from './schemas'
import type { Cliente } from './types'
import Input from '../../shared/components/ui/Input'
import Button from '../../shared/components/ui/Button'
import { Card } from '../../shared/components/ui/Card'
import { formatCpfCnpj } from '../../shared/lib/utils'

interface ClienteFormProps {
  editing: Cliente | null
  onSubmit: (data: ClienteFormData) => void
  onNew: () => void
  isPending: boolean
}

export function ClienteForm({ editing, onSubmit, onNew, isPending }: ClienteFormProps) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
  })

  useEffect(() => {
    if (editing) {
      reset({ nome: editing.nome, cpfCnpj: editing.cpfCnpj, observacao: editing.observacao ?? '' })
    } else {
      reset({ nome: '', cpfCnpj: '', observacao: '' })
    }
  }, [editing, reset])

  return (
    <Card title={editing ? `Editando cliente #${editing.id}` : 'Novo Cliente'}>
      <form onSubmit={handleSubmit(data => {
          onSubmit(data)
          if (!editing) reset({ nome: '', cpfCnpj: '', observacao: '' })
        })} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Nome" placeholder="Nome do cliente" error={errors.nome?.message} {...register('nome')} />
          <Controller
            name="cpfCnpj"
            control={control}
            render={({ field }) => (
              <Input
                label="CPF/CNPJ"
                placeholder="000.000.000-00"
                error={errors.cpfCnpj?.message}
                value={field.value}
                onChange={e => field.onChange(formatCpfCnpj(e.target.value))}
                onBlur={field.onBlur}
                maxLength={18}
              />
            )}
          />
        </div>
        <Input label="Observação" placeholder="Observação sobre o cliente" {...register('observacao')} />
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
