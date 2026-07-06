import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ShoppingBag } from 'lucide-react'
import { Card } from '../../shared/components/ui/Card'
import { useLogin } from './hooks'
import { LoginForm } from './LoginForm'
import type { LoginFormData } from './schemas'

export function LoginPage() {
  const navigate = useNavigate()
  const loginMutation = useLogin()

  function handleSubmit(data: LoginFormData) {
    loginMutation.mutate(data, {
      onSuccess: () => navigate('/', { replace: true }),
      onError: () => toast.error('E-mail ou senha inválidos.'),
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">MyBusiness Sales Manager</h1>
        </div>
        <Card>
          <LoginForm onSubmit={handleSubmit} isPending={loginMutation.isPending} />
        </Card>
      </div>
    </div>
  )
}
