import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { lojaSchema, type LojaFormData } from './schemas'
import type { Loja } from './types'
import Input from '../../shared/components/ui/Input'
import Button from '../../shared/components/ui/Button'
import { Card } from '../../shared/components/ui/Card'

interface LojaFormProps {
  loja: Loja | undefined
  onSubmit: (data: LojaFormData) => void
  isPending: boolean
}

export function LojaForm({ loja, onSubmit, isPending }: LojaFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LojaFormData>({
    resolver: zodResolver(lojaSchema),
  })

  useEffect(() => {
    if (loja) {
      reset({
        nomeFantasia: loja.nomeFantasia,
        cpfCnpj: loja.cpfCnpj,
        ie: loja.ie ?? '',
        endereco: loja.endereco,
      })
    }
  }, [loja, reset])

  return (
    <Card title="Informações da Loja">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nome Fantasia"
            placeholder="Nome Fantasia"
            error={errors.nomeFantasia?.message}
            {...register('nomeFantasia')}
          />
          <Input
            label="CPF/CNPJ"
            placeholder="00.000.000/0000-00"
            error={errors.cpfCnpj?.message}
            {...register('cpfCnpj')}
          />
          <Input
            label="IE"
            placeholder="Inscrição Estadual"
            error={errors.ie?.message}
            {...register('ie')}
          />
          <Input
            label="Endereço"
            placeholder="Rua, número, bairro, cidade"
            error={errors.endereco?.message}
            {...register('endereco')}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Salvando...' : loja ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </form>
    </Card>
  )
}
