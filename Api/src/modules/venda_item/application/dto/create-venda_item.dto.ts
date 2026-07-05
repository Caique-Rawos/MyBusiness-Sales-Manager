export class CreateVendaItemDto {
  precoUnitario: number;
  desconto?: number;
  quantidade: number;
  subTotal: number;
  idVenda: number;
  idProduto: number;
}