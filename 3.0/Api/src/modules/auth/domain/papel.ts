export interface Papel {
  id: number;
  nome: string;
  tenantId: number;
}

export interface PapelComPermissoes extends Papel {
  permissoes: { id: number; chave: string; descricao: string }[];
}
