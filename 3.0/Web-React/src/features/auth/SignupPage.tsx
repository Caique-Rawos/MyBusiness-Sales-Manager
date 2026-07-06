import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ShoppingBag } from 'lucide-react'
import { Card } from '../../shared/components/ui/Card'
import { useSignup } from './hooks'
import { SignupForm } from './SignupForm'
import type { SignupFormData } from './schemas'

export function SignupPage() {
  const navigate = useNavigate()
  const signupMutation = useSignup()

  function handleSubmit(data: SignupFormData) {
    signupMutation.mutate(data, {
      onSuccess: () => navigate('/', { replace: true }),
      onError: () => toast.error('Não foi possível criar sua loja. Verifique os dados e tente novamente.'),
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Criar minha loja</h1>
        </div>
        <Card>
          <SignupForm onSubmit={handleSubmit} isPending={signupMutation.isPending} />
        </Card>
        <p className="text-center text-sm text-gray-500">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
