import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../test/query-wrapper'
import { UsuariosPage } from './index'
import { useAuth } from '../../shared/context/AuthContext'
import { usuarioApi } from './usuario/api'
import { papelApi, permissaoApi } from './papel/api'
import type { Usuario } from './usuario/types'
import type { Papel } from './papel/types'

vi.mock('../../shared/context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('./usuario/api', () => ({
  usuarioApi: { getAll: vi.fn(), create: vi.fn(), updatePapeis: vi.fn(), delete: vi.fn() },
}))
vi.mock('./papel/api', () => ({
  papelApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  permissaoApi: { getAll: vi.fn() },
}))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

const usuario: Usuario = {
  id: 1,
  nome: 'Fulano',
  email: 'fulano@teste.com',
  tenantId: 1,
  ativo: true,
  isOwner: false,
  criadoEm: '2026-01-01',
  papeis: [],
}

const permissao = { id: 1, chave: 'venda:listar', descricao: 'Listar - Venda' }
const papel: Papel = { id: 1, nome: 'Vendedor', tenantId: 1, permissoes: [] }
const papelComPermissao: Papel = { id: 1, nome: 'Vendedor', tenantId: 1, permissoes: [permissao] }

function mockAuth(hasPermission: (permission: string) => boolean) {
  vi.mocked(useAuth).mockReturnValue({ hasPermission } as unknown as ReturnType<typeof useAuth>)
}

function renderPage() {
  const { queryClient } = createQueryWrapper()
  return render(
    <QueryClientProvider client={queryClient}>
      <UsuariosPage />
    </QueryClientProvider>,
  )
}

describe('UsuariosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usuarioApi.getAll).mockResolvedValue([usuario])
    vi.mocked(papelApi.getAll).mockResolvedValue([papel])
    vi.mocked(permissaoApi.getAll).mockResolvedValue([])
  })

  it('should hide the create form and table when the user lacks permission', () => {
    mockAuth(() => false)
    renderPage()

    expect(screen.queryByLabelText('Nome')).not.toBeInTheDocument()
    expect(screen.queryByText('Usuários da loja')).not.toBeInTheDocument()
  })

  it('should create a usuario and show a success toast', async () => {
    mockAuth(() => true)
    vi.mocked(usuarioApi.create).mockResolvedValue(usuario)
    renderPage()

    fireEvent.change(await screen.findByLabelText('Nome'), { target: { value: 'Ciclano' } })
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ciclano@teste.com' } })
    fireEvent.change(screen.getByLabelText('Senha inicial'), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar usuário' }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Usuário cadastrado com sucesso!'))
  })

  it('should switch to the papeis tab and create a papel', async () => {
    mockAuth(() => true)
    vi.mocked(permissaoApi.getAll).mockResolvedValue([{ id: 1, chave: 'venda:listar', descricao: 'Listar - Venda' }])
    vi.mocked(papelApi.create).mockResolvedValue(papel)
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: 'Papéis' }))
    fireEvent.change(screen.getByLabelText('Nome do papel'), { target: { value: 'Financeiro' } })
    fireEvent.click(screen.getAllByRole('checkbox')[0])
    fireEvent.click(screen.getByRole('button', { name: 'Criar papel' }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Papel criado!'))
  })

  it('should extract the backend error message when deleting a papel in use fails', async () => {
    mockAuth(() => true)
    const axiosError = new AxiosError('Request failed')
    axiosError.response = {
      data: { message: 'Papel está atribuído a usuários e não pode ser removido' },
      status: 409,
      statusText: 'Conflict',
      headers: {},
      config: {} as never,
    }
    vi.mocked(papelApi.delete).mockRejectedValue(axiosError)
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: 'Papéis' }))
    fireEvent.click(screen.getByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Papel está atribuído a usuários e não pode ser removido'),
    )
  })

  it('should delete a usuario', async () => {
    mockAuth(() => true)
    vi.mocked(usuarioApi.delete).mockResolvedValue(undefined)
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() => expect(usuarioApi.delete).toHaveBeenCalledWith(1))
    expect(toast.success).toHaveBeenCalledWith('Usuário excluído!')
  })

  it('should show an error toast when creating a usuario fails', async () => {
    mockAuth(() => true)
    vi.mocked(usuarioApi.create).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.change(await screen.findByLabelText('Nome'), { target: { value: 'Ciclano' } })
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ciclano@teste.com' } })
    fireEvent.change(screen.getByLabelText('Senha inicial'), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar usuário' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao cadastrar usuário.'))
  })

  it('should show an error toast when deleting a usuario fails', async () => {
    mockAuth(() => true)
    vi.mocked(usuarioApi.delete).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao excluir usuário.'))
  })

  it('should close the confirm modal when cancelling a usuario delete', async () => {
    mockAuth(() => true)
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() => expect(screen.queryByText('O usuário perderá o acesso imediatamente.')).not.toBeInTheDocument())
  })

  it('should update a usuario papeis via the table modal', async () => {
    mockAuth(() => true)
    vi.mocked(usuarioApi.updatePapeis).mockResolvedValue(usuario)
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar papéis'))
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Papéis atualizados!'))
  })

  it('should show an error toast when updating usuario papeis fails', async () => {
    mockAuth(() => true)
    vi.mocked(usuarioApi.updatePapeis).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar papéis'))
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar papéis.'))
  })

  it('should use the fallback error message when deleting a papel fails without a backend message', async () => {
    mockAuth(() => true)
    vi.mocked(papelApi.delete).mockRejectedValue(new Error('network error'))
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: 'Papéis' }))
    fireEvent.click(screen.getByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao excluir papel.'))
  })

  it('should delete a papel successfully', async () => {
    mockAuth(() => true)
    vi.mocked(papelApi.delete).mockResolvedValue(undefined)
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: 'Papéis' }))
    fireEvent.click(screen.getByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Papel excluído!'))
  })

  it('should close the confirm modal when cancelling a papel delete', async () => {
    mockAuth(() => true)
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: 'Papéis' }))
    fireEvent.click(screen.getByTitle('Excluir'))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() =>
      expect(screen.queryByText('Não é possível excluir um papel atribuído a usuários.')).not.toBeInTheDocument(),
    )
  })

  it('should edit and update an existing papel, including the error path', async () => {
    mockAuth(() => true)
    vi.mocked(papelApi.getAll).mockResolvedValue([papelComPermissao])
    vi.mocked(permissaoApi.getAll).mockResolvedValue([permissao])
    vi.mocked(papelApi.update).mockResolvedValue(papelComPermissao)
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: 'Papéis' }))
    fireEvent.click(screen.getByTitle('Editar'))
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Papel atualizado!'))
  })

  it('should show an error toast when updating a papel fails', async () => {
    mockAuth(() => true)
    vi.mocked(papelApi.getAll).mockResolvedValue([papelComPermissao])
    vi.mocked(permissaoApi.getAll).mockResolvedValue([permissao])
    vi.mocked(papelApi.update).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: 'Papéis' }))
    fireEvent.click(screen.getByTitle('Editar'))
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar papel.'))
  })

  it('should show an error toast when creating a papel fails', async () => {
    mockAuth(() => true)
    vi.mocked(permissaoApi.getAll).mockResolvedValue([permissao])
    vi.mocked(papelApi.create).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: 'Papéis' }))
    fireEvent.change(screen.getByLabelText('Nome do papel'), { target: { value: 'Financeiro' } })
    fireEvent.click(await screen.findAllByRole('checkbox').then(boxes => boxes[0]))
    fireEvent.click(screen.getByRole('button', { name: 'Criar papel' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao criar papel.'))
  })

  it('should reset editingPapel when clicking "Novo"', async () => {
    mockAuth(() => true)
    vi.mocked(papelApi.getAll).mockResolvedValue([papelComPermissao])
    vi.mocked(permissaoApi.getAll).mockResolvedValue([permissao])
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: 'Papéis' }))
    fireEvent.click(screen.getByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Nome do papel')).toHaveValue('Vendedor'))
    fireEvent.click(screen.getByRole('button', { name: 'Novo' }))

    await waitFor(() => expect(screen.getByLabelText('Nome do papel')).toHaveValue(''))
  })

  it('should not open the papel editor when the user lacks edit permission', async () => {
    mockAuth(perm => perm !== 'papel:editar')
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: 'Papéis' }))
    fireEvent.click(screen.getByTitle('Editar'))

    expect(screen.queryByRole('button', { name: 'Atualizar' })).not.toBeInTheDocument()
  })
})
