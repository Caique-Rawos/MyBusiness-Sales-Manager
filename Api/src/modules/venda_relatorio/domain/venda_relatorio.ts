export interface IVendaRelatorio {
  idVenda: number;
  valorVenda: number;
  dataVenda: Date;
  nomeCliente: string;
  idCliente: number;
}

export interface IVendaClienteRelatorio {
  idCliente: number;
  nomeCliente: string;
  valorVendas: number;
  quantidadeVendas: number;
}

export interface IVendaDataRelatorio {
  data: Date;
  totalVendas: number;
  contagemCliente: number;
}
