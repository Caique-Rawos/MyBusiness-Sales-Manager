export interface PapelResumo {
  id: number
  nome: string
}

export interface PermissaoResumo {
  id: number
  chave: string
  descricao: string
}

export interface Papel {
  id: number
  nome: string
  tenantId: number
  permissoes: PermissaoResumo[]
}

export interface CreatePapelData {
  nome: string
  permissaoIds: number[]
}

export interface UpdatePapelData {
  nome?: string
  permissaoIds?: number[]
}
