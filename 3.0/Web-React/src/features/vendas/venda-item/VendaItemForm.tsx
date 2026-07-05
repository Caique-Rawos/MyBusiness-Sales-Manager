import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { vendaItemSchema, type VendaItemFormData } from './schemas'
import type { Produto } from '../../produtos/types'
import Input from '../../../shared/components/ui/Input'
import Select from '../../../shared/components/ui/Select'
import Button from '../../../shared/components/ui/Button'
import { Card } from '../../../shared/components/ui/Card'

interface VendaItemFormProps {
  idVenda: number
  produtos: Produto[]
  onSubmit: (data: VendaItemFormData) => void
  isPending: boolean
}

export function VendaItemForm({ idVenda, produtos, onSubmit, isPending }: VendaItemFormProps) {
  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<VendaItemFormData>({
    resolver: zodResolver(vendaItemSchema),
    defaultValues: { selecionarProduto: '', valor_venda: '0', valor_desconto: '0', quantidade: '' },
  })

  const selectedProdutoId = useWatch({ control, name: 'selecionarProduto' })
  const valorVenda = useWatch({ control, name: 'valor_venda' })
  const valorDesconto = useWatch({ control, name: 'valor_desconto' })
  const quantidade = useWatch({ control, name: 'quantidade' })

  useEffect(() => {
    if (selectedProdutoId) {
      const produto = produtos.find(p => String(p.id) === selectedProdutoId)
      if (produto) {
        setValue('valor_venda', produto.valorVenda)
      }
    }
  }, [selectedProdutoId, produtos, setValue])

  const subTotal = (() => {
    const venda = parseFloat(valorVenda ?? '0') || 0
    const desconto = parseFloat(valorDesconto ?? '0') || 0
    const qtd = parseFloat(quantidade ?? '0') || 0
    return ((venda - desconto) * qtd).toFixed(2)
  })()

  function handleFormSubmit(data: VendaItemFormData) {
    onSubmit(data)
    reset()
  }

  return (
    <Card title="Novo Item">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Código da Venda" value={idVenda} readOnly />
          <Select
            label="Produto"
            placeholder="Selecione um produto..."
            options={produtos.map(p => ({ value: p.id, label: p.descricao }))}
            error={errors.selecionarProduto?.message}
            {...register('selecionarProduto')}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Input label="Valor Venda" type="number" step="0.01" placeholder="0,00" {...register('valor_venda')} />
          <Input label="Desconto Unit." type="number" step="0.01" placeholder="0,00" {...register('valor_desconto')} />
          <Input label="Quantidade" type="number" step="1" placeholder="1" error={errors.quantidade?.message} {...register('quantidade')} />
          <Input label="Sub Total" value={subTotal} readOnly />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Adicionando...' : 'Adicionar Item'}
        </Button>
      </form>
    </Card>
  )
}
