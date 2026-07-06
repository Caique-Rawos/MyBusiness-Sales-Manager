export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senhaHash: string;
  tenantId: number;
  ativo: boolean;
  criadoEm: Date;
}

export interface UsuarioComPermissoes extends Usuario {
  permissions: string[];
}
