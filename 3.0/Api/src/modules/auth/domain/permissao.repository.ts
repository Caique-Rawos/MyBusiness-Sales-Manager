import { Permissao } from './permissao';

export const PERMISSAO_REPOSITORY = 'PERMISSAO_REPOSITORY';

export interface PermissaoSeedData {
  chave: string;
  descricao: string;
}

export interface PermissaoRepository {
  findAll(): Promise<Permissao[]>;
  upsertMany(data: PermissaoSeedData[]): Promise<void>;
}
