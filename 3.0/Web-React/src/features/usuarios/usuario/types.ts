export interface PapelResumo {
  id: number
  nome: string
}

export interface Usuario {
  id: number
  nome: string
  email: string
  tenantId: number
  ativo: boolean
  isOwner: boolean
  criadoEm: string
  papeis: PapelResumo[]
}

export interface CreateUsuarioData {
  nome: string
  email: string
  senha: string
  papelIds: number[]
}
