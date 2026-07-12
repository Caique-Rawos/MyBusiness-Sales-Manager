import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usuarioSchema, type UsuarioFormData } from './schemas'
import type { PapelResumo } from '../papel/types'
import Input from '../../../shared/components/ui/Input'
import Button from '../../../shared/components/ui/Button'
import { Card } from '../../../shared/components/ui/Card'

interface UsuarioFormProps {
  papeis: PapelResumo[]
  onSubmit: (data: UsuarioFormData) => void
  isPending: boolean
}

export function UsuarioForm({ papeis, onSubmit, isPending }: UsuarioFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: { nome: '', email: '', senha: '', papelIds: [] },
  })

  return (
    <Card title="Cadastrar usuário">
      <form
        onSubmit={handleSubmit(data => {
          onSubmit(data)
          reset({ nome: '', email: '', senha: '', papelIds: [] })
        })}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input label="Nome" placeholder="Nome do usuário" error={errors.nome?.message} {...register('nome')} />
          <Input label="E-mail" type="email" placeholder="email@exemplo.com" error={errors.email?.message} {...register('email')} />
          <Input label="Senha inicial" type="password" placeholder="Mínimo 6 caracteres" error={errors.senha?.message} {...register('senha')} />
        </div>

        <Controller
          name="papelIds"
          control={control}
          render={({ field }) => (
            <div>
              <span className="text-sm font-medium text-gray-700">Papéis</span>
              <div className="mt-1 flex flex-wrap gap-3">
                {papeis.length === 0 ? (
                  <span className="text-sm text-gray-400">Nenhum papel cadastrado ainda.</span>
                ) : (
                  papeis.map(papel => (
                    <label key={papel.id} className="flex items-center gap-1.5 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={field.value.includes(papel.id)}
                        onChange={e => {
                          field.onChange(
                            e.target.checked
                              ? [...field.value, papel.id]
                              : field.value.filter(id => id !== papel.id),
                          )
                        }}
                      />
                      {papel.nome}
                    </label>
                  ))
                )}
              </div>
            </div>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Cadastrando...' : 'Cadastrar usuário'}
        </Button>
      </form>
    </Card>
  )
}
