import toast from 'react-hot-toast'
import { useLoja, useSaveLoja } from './hooks'
import { LojaForm } from './LojaForm'
import type { LojaFormData } from './schemas'

export function LojaPage() {
  const { data: lojas = [] } = useLoja()
  const saveMutation = useSaveLoja()

  const loja = lojas[0]

  function handleSubmit(data: LojaFormData) {
    saveMutation.mutate(
      { loja, data },
      {
        onSuccess: () => toast.success('Dados da loja salvos!'),
        onError: () => toast.error('Erro ao salvar.'),
      },
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Minha Loja</h1>
      <LojaForm loja={loja} onSubmit={handleSubmit} isPending={saveMutation.isPending} />
    </div>
  )
}
