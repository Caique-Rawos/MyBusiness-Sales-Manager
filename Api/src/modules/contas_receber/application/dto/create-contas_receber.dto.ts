export class CreateContasReceberDto {
  descricao: string;
  valorTotal: number;
  valorPago?: number;
  dataVencimento?: Date;
  idPagamento: number;
  idStatusPagamento: number;
  idVenda?: number;
}