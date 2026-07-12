import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contaSchema, type ContaFormData } from './schemas'
import type { Pagamento } from './pagamento/types'
import type { StatusPagamento } from './status-pagamento/types'
import type { ContasPagar } from './contas-pagar/types'
import type { ContasReceber } from './contas-receber/types'
import Input from '../../shared/components/ui/Input'
import Select from '../../shared/components/ui/Select'
import Button from '../../shared/components/ui/Button'
import { Card } from '../../shared/components/ui/Card'

interface ContaFormProps {
  title: string
  formasPagamento: Pagamento[]
  statusList: StatusPagamento[]
  onSubmit: (data: ContaFormData) => void
  isPending: boolean
  editing?: ContasPagar | ContasReceber | null
  onNew?: () => void
}

export function ContaForm({ title, formasPagamento, statusList, onSubmit, isPending, editing, onNew }: ContaFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContaFormData>({
    resolver: zodResolver(contaSchema),
  })

  const valorTotalBloqueado = !!(editing && (editing as ContasReceber).idVenda)

  // Só espera o catálogo carregar quando a conta realmente tem forma/status vinculados --
  // senão, com o catálogo vazio (nada cadastrado ainda), o reset nunca dispararia e o
  // formulário inteiro ficaria em branco na edição.
  const aguardandoPagamento = !!editing?.pagamento?.id && formasPagamento.length === 0
  const aguardandoStatus = !!editing?.statusPagamento?.id && statusList.length === 0

  useEffect(() => {
    if (editing) {
      if (aguardandoPagamento || aguardandoStatus) return
      reset({
        descricao: editing.descricao,
        valorTotal: editing.valorTotal,
        valorPago: editing.valorPago,
        dataVencimento: editing.dataVencimento?.slice(0, 10),
        idPagamento: String(editing.pagamento?.id ?? ''),
        idStatusPagamento: String(editing.statusPagamento?.id ?? ''),
      })
    } else {
      reset({ descricao: '', valorTotal: '', valorPago: '', dataVencimento: '', idPagamento: '', idStatusPagamento: '' })
    }
  // editing?.id detecta troca de registro sem re-disparar por refetch do restante do objeto
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing?.id, reset, aguardandoPagamento, aguardandoStatus])

  function handleFormSubmit(data: ContaFormData) {
    onSubmit(data)
    if (!editing) reset()
  }

  return (
    <Card title={editing ? `Editando: ${editing.descricao}` : title}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Descrição"
            placeholder="Descrição da conta"
            error={errors.descricao?.message}
            {...register('descricao')}
          />
          <Input
            label="Data de Vencimento"
            type="date"
            error={errors.dataVencimento?.message}
            {...register('dataVencimento')}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Input
              label="Valor Total"
              type="number"
              step="0.01"
              placeholder="0,00"
              error={errors.valorTotal?.message}
              readOnly={valorTotalBloqueado}
              className={valorTotalBloqueado ? 'bg-gray-100 cursor-not-allowed' : ''}
              {...register('valorTotal')}
            />
            {valorTotalBloqueado && (
              <p className="mt-1 text-xs text-gray-500">Gerenciado automaticamente pela venda vinculada.</p>
            )}
          </div>
          <Input
            label="Valor Pago"
            type="number"
            step="0.01"
            placeholder="0,00"
            error={errors.valorPago?.message}
            {...register('valorPago')}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Forma de Pagamento"
            placeholder="Selecione..."
            options={formasPagamento.map(p => ({ value: p.id, label: p.descricao }))}
            error={errors.idPagamento?.message}
            {...register('idPagamento')}
          />
          <Select
            label="Status de Pagamento"
            placeholder="Selecione..."
            options={statusList.map(s => ({ value: s.id, label: s.descricao }))}
            error={errors.idStatusPagamento?.message}
            {...register('idStatusPagamento')}
          />
        </div>
        <div className="flex gap-3">
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
