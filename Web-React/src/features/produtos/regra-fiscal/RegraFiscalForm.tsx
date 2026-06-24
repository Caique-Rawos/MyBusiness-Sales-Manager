import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { regraFiscalSchema, type RegraFiscalFormData } from './schemas'
import type { RegraFiscal } from './types'
import Input from '../../../shared/components/ui/Input'
import Button from '../../../shared/components/ui/Button'
import { Card } from '../../../shared/components/ui/Card'
import { formatNcm } from '../../../shared/lib/utils'

interface RegraFiscalFormProps {
  editing: RegraFiscal | null
  onSubmit: (data: RegraFiscalFormData) => void
  onNew: () => void
  isPending: boolean
}

export function RegraFiscalForm({ editing, onSubmit, onNew, isPending }: RegraFiscalFormProps) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<RegraFiscalFormData>({
    resolver: zodResolver(regraFiscalSchema),
    defaultValues: { descricao: '', ncm: '', icms: '0.00', pis: '0.00', cofins: '0.00', ipi: '0.00' },
  })

  useEffect(() => {
    if (editing) {
      reset({
        descricao: editing.descricao,
        ncm: editing.ncm,
        icms: String(editing.icms),
        pis: String(editing.pis),
        cofins: String(editing.cofins),
        ipi: String(editing.ipi),
      })
    } else {
      reset({ descricao: '', ncm: '', icms: '0.00', pis: '0.00', cofins: '0.00', ipi: '0.00' })
    }
  }, [editing, reset])

  return (
    <Card title={editing ? 'Editando Regra Fiscal' : 'Nova Regra Fiscal'}>
      <form onSubmit={handleSubmit(data => {
          onSubmit(data)
          if (!editing) reset({ descricao: '', ncm: '', icms: '0.00', pis: '0.00', cofins: '0.00', ipi: '0.00' })
        })} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Input label="Descrição" placeholder="Ex: Tributado, Isento..." error={errors.descricao?.message} {...register('descricao')} />
          </div>
          <Controller
              name="ncm"
              control={control}
              render={({ field }) => (
                <Input
                  label="NCM"
                  placeholder="0000.00.00"
                  error={errors.ncm?.message}
                  value={field.value}
                  onChange={e => field.onChange(formatNcm(e.target.value))}
                  onBlur={field.onBlur}
                  maxLength={10}
                />
              )}
            />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Input label="ICMS (%)" type="number" step="0.01" min="0" max="100" error={errors.icms?.message} {...register('icms')} />
          <Input label="PIS (%)" type="number" step="0.01" min="0" max="100" error={errors.pis?.message} {...register('pis')} />
          <Input label="COFINS (%)" type="number" step="0.01" min="0" max="100" error={errors.cofins?.message} {...register('cofins')} />
          <Input label="IPI (%)" type="number" step="0.01" min="0" max="100" error={errors.ipi?.message} {...register('ipi')} />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : editing ? 'Atualizar' : 'Cadastrar'}
          </Button>
          {editing && <Button type="button" variant="secondary" onClick={onNew}>Novo</Button>}
        </div>
      </form>
    </Card>
  )
}
