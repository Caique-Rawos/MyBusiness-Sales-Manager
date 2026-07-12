import { Papel, PapelComPermissoes } from './papel';

export const PAPEL_REPOSITORY = 'PAPEL_REPOSITORY';

export interface CreatePapelData {
  nome: string;
  tenantId: number;
  permissaoIds: number[];
}

export interface UpdatePapelData {
  nome?: string;
  permissaoIds?: number[];
}

export interface PapelRepository {
  create(data: CreatePapelData): Promise<Papel>;
  findAllByTenantId(tenantId: number): Promise<PapelComPermissoes[]>;
  findByIdAndTenantId(id: number, tenantId: number): Promise<PapelComPermissoes | null>;
  update(id: number, data: UpdatePapelData): Promise<Papel>;
  delete(id: number): Promise<void>;
}
