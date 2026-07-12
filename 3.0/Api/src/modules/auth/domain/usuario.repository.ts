import { Usuario, UsuarioComPapeis, UsuarioComPermissoes } from './usuario';

export const USUARIO_REPOSITORY = 'USUARIO_REPOSITORY';

export interface CreateUsuarioData {
  nome: string;
  email: string;
  senhaHash: string;
  tenantId: number;
  isOwner?: boolean;
}

export interface UsuarioRepository {
  create(data: CreateUsuarioData): Promise<Usuario>;
  findById(id: number): Promise<Usuario | null>;
  findByEmailComPermissoes(email: string): Promise<UsuarioComPermissoes | null>;
  findByIdComPermissoes(id: number): Promise<UsuarioComPermissoes | null>;
  findAllByTenantId(tenantId: number): Promise<UsuarioComPapeis[]>;
  findByIdAndTenantId(id: number, tenantId: number): Promise<Usuario | null>;
  findByIdComPapeis(id: number): Promise<UsuarioComPapeis | null>;
  attachPapel(usuarioId: number, papelId: number): Promise<void>;
  setPapeis(usuarioId: number, papelIds: number[]): Promise<void>;
  existsByPapelId(papelId: number): Promise<boolean>;
  delete(id: number): Promise<void>;
}
