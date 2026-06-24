export enum TipoMovimento {
  SAIDA = 'SAIDA',
  ESTORNO_SAIDA = 'ESTORNO_SAIDA',
  ENTRADA = 'ENTRADA',
}

export interface MovimentoEstoque {
  id: number;
  tipo: TipoMovimento;
  quantidade: number;
  idProduto: number;
  produto?: { id: number; descricao: string };
  motivo?: string;
  idVenda?: number;
  idVendaItem?: number;
  dataMovimento: Date;
}
