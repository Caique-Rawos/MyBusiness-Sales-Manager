import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../shared/context/AuthContext'
import { AppRouter } from './router'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{ success: { duration: 2000 }, error: { duration: 4000 } }}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}
