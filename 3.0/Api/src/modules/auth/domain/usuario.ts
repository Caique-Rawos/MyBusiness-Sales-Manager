export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senhaHash: string;
  tenantId: number;
  ativo: boolean;
  isOwner: boolean;
  criadoEm: Date;
}

export interface UsuarioComPermissoes extends Usuario {
  permissions: string[];
}

export interface UsuarioComPapeis extends Usuario {
  papeis: { id: number; nome: string }[];
}
