import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../../shared/components/ui/Input'
import Button from '../../shared/components/ui/Button'
import { loginSchema, type LoginFormData } from './schemas'

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void
  isPending: boolean
}

export function LoginForm({ onSubmit, isPending }: LoginFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        autoComplete="current-password"
        error={errors.senha?.message}
        {...register('senha')}
      />
      <Button type="submit" disabled={isPending} className="w-full justify-center">
        {isPending ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
