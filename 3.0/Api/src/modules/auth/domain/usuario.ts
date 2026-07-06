export interface Usuario {
  id: number;
  email: string;
  senhaHash: string;
  tenantId: number;
  ativo: boolean;
  criadoEm: Date;
}
