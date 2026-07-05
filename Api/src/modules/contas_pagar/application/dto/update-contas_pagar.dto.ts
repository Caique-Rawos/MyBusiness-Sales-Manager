export class UpdateContasPagarDto {
  descricao?: string;
  valorTotal?: number;
  valorPago?: number;
  dataVencimento?: Date;
  idPagamento?: number;
  idStatusPagamento?: number;
}