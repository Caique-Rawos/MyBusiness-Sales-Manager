export const QUEUE_NAMES = {
  VENDA: 'venda',
  ESTOQUE: 'estoque',
  CONTAS_RECEBER: 'contas-receber',
} as const;

export const JOB_NAMES = {
  VENDA: {
    CALCULAR_TOTAL: 'calcular-total',
  },
  ESTOQUE: {
    SAIDA: 'saida',
    ESTORNO: 'estorno',
    ENTRADA: 'entrada',
  },
  CONTAS_RECEBER: {
    CRIAR: 'criar',
    ATUALIZAR_TOTAL: 'atualizar-total',
  },
} as const;
