import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText } from 'lucide-react'
import { vendaSchema, type VendaFormData } from './schemas'
import type { Cliente } from '../../clientes/types'
import Input from '../../../shared/components/ui/Input'
import Select from '../../../shared/components/ui/Select'
import Button from '../../../shared/components/ui/Button'
import { Card } from '../../../shared/components/ui/Card'

interface VendaFormProps {
  clientes: Cliente[]
  onSubmit: (data: VendaFormData) => void
  isPending: boolean
  onRelatorio: () => void
}

export function VendaForm({ clientes, onSubmit, isPending, onRelatorio }: VendaFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VendaFormData>({
    resolver: zodResolver(vendaSchema),
  })

  function handleFormSubmit(data: VendaFormData) {
    onSubmit(data)
    reset()
  }

  return (
    <Card title="Nova Venda">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            label="Cliente"
            placeholder="Selecione um cliente..."
            options={clientes.map(c => ({ value: c.id, label: c.nome }))}
            error={errors.selecionarCliente?.message}
            {...register('selecionarCliente')}
          />
          <Input
            label="Data da Venda"
            type="date"
            error={errors.dataVenda?.message}
            {...register('dataVenda')}
          />
          <Input label="Valor Total" value="0,00" readOnly />
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
          <Button type="button" variant="secondary" onClick={onRelatorio}>
            <FileText size={16} />
            Relatório
          </Button>
        </div>
      </form>
    </Card>
  )
}
