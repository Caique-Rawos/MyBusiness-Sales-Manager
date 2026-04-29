export class CreateProdutoDto {
  descricao: string;
  codigoDeBarra?: string;
  valorCusto: number;
  valorVenda: number;
  estoque: number;
  unidade: string;
  image?: string;
  idCategoria: number;
  idRegraFiscal?: number;
}