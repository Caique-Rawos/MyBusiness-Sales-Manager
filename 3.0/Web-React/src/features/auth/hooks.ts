import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../../shared/context/AuthContext'
import type { LoginFormData } from './schemas'

export function useLogin() {
  const { login } = useAuth()
  return useMutation({
    mutationFn: ({ email, senha }: LoginFormData) => login(email, senha),
  })
}
