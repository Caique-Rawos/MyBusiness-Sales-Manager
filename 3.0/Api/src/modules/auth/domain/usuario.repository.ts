import { Usuario, UsuarioComPermissoes } from './usuario';

export const USUARIO_REPOSITORY = 'USUARIO_REPOSITORY';

export interface CreateUsuarioData {
  email: string;
  senhaHash: string;
  tenantId: number;
}

export interface UsuarioRepository {
  create(data: CreateUsuarioData): Promise<Usuario>;
  findById(id: number): Promise<Usuario | null>;
  findByEmailComPermissoes(email: string): Promise<UsuarioComPermissoes | null>;
  findByIdComPermissoes(id: number): Promise<UsuarioComPermissoes | null>;
  attachPapel(usuarioId: number, papelId: number): Promise<void>;
}
