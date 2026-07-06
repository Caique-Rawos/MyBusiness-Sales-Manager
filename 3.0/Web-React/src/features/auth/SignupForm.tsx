import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../../shared/components/ui/Input'
import Button from '../../shared/components/ui/Button'
import { signupSchema, type SignupFormData } from './schemas'

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void
  isPending: boolean
}

export function SignupForm({ onSubmit, isPending }: SignupFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome da loja"
        placeholder="Minha Loja"
        error={errors.nomeFantasia?.message}
        {...register('nomeFantasia')}
      />
      <Input
        label="CPF/CNPJ"
        placeholder="000.000.000-00"
        error={errors.cpfCnpj?.message}
        {...register('cpfCnpj')}
      />
      <Input
        label="Endereço"
        placeholder="Rua Principal, 123 - Centro"
        error={errors.endereco?.message}
        {...register('endereco')}
      />
      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Senha"
        type="password"
        autoComplete="new-password"
        error={errors.senha?.message}
        {...register('senha')}
      />
      <Button type="submit" disabled={isPending} className="w-full justify-center">
        {isPending ? 'Criando...' : 'Criar minha loja'}
      </Button>
    </form>
  )
}
