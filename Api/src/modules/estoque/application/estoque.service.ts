import { Inject, Injectable } from '@nestjs/common';
import { ProdutoService } from 'src/modules/produto/application/produto.service';
import { MovimentoEstoque, TipoMovimento } from '../domain/movimento_estoque';
import {
  MOVIMENTO_ESTOQUE_REPOSITORY,
  MovimentoEstoqueFiltro,
  MovimentoEstoqueRepository,
} from '../domain/movimento_estoque.repository';

@Injectable()
export class EstoqueService {
  constructor(
    @Inject(MOVIMENTO_ESTOQUE_REPOSITORY)
    private readonly repository: MovimentoEstoqueRepository,
    private readonly produtoService: ProdutoService,
  ) {}

  async registrarEntrada(data: {
    idProduto: number;
    quantidade: number;
    motivo: string;
  }): Promise<void> {
    await this.repository.registrar({
      tipo: TipoMovimento.ENTRADA,
      quantidade: data.quantidade,
      idProduto: data.idProduto,
      motivo: data.motivo,
    });
  }

  async registrarSaida(data: {
    idProduto: number;
    quantidade: number;
    idVenda: number;
    idVendaItem: number;
  }): Promise<void> {
    await this.repository.registrar({
      tipo: TipoMovimento.SAIDA,
      quantidade: data.quantidade,
      idProduto: data.idProduto,
      idVenda: data.idVenda,
      idVendaItem: data.idVendaItem,
    });
    await this.produtoService.ajustarEstoque(data.idProduto, -Number(data.quantidade));
  }

  findAll(filtro: MovimentoEstoqueFiltro): Promise<MovimentoEstoque[]> {
    return this.repository.findAll(filtro);
  }

  async registrarEstorno(idVendaItem: number): Promise<void> {
    const movimento = await this.repository.findSaidaPorVendaItem(idVendaItem);
    if (!movimento) return;

    await this.repository.registrar({
      tipo: TipoMovimento.ESTORNO_SAIDA,
      quantidade: movimento.quantidade,
      idProduto: movimento.idProduto,
      idVenda: movimento.idVenda,
      idVendaItem,
    });

    await this.produtoService.ajustarEstoque(movimento.idProduto, Number(movimento.quantidade));
  }
}
