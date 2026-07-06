import { Papel } from './papel';

export const PAPEL_REPOSITORY = 'PAPEL_REPOSITORY';

export interface CreatePapelData {
  nome: string;
  tenantId: number;
  permissaoIds: number[];
}

export interface PapelRepository {
  create(data: CreatePapelData): Promise<Papel>;
}
