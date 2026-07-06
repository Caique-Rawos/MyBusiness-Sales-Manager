import { EntitySchema } from 'typeorm';
import { CategoriaOrmEntity } from '../../modules/categoria/infra/typeorm/categoria.entity';
import { ClienteOrmEntity } from '../../modules/cliente/infra/typeorm/cliente.entity';
import { ContagemClienteOrmEntity } from '../../modules/contagem_cliente/infra/typeorm/contagem_cliente.entity';
import { ContasPagarOrmEntity } from '../../modules/contas_pagar/infra/typeorm/contas_pagar.entity';
import { ContasReceberOrmEntity } from '../../modules/contas_receber/infra/typeorm/contas_receber.entity';
import { MovimentoEstoqueOrmEntity } from '../../modules/estoque/infra/typeorm/movimento_estoque.entity';
import { LojaOrmEntity } from '../../modules/loja/infra/typeorm/loja.entity';
import { PagamentoOrmEntity } from '../../modules/pagamento/infra/typeorm/pagamento.entity';
import { PaginasOrmEntity } from '../../modules/paginas/infra/typeorm/paginas.entity';
import { ProdutoOrmEntity } from '../../modules/produto/infra/typeorm/produto.entity';
import { RegraFiscalOrmEntity } from '../../modules/regra_fiscal/infra/typeorm/regra_fiscal.entity';
import { StatusPagamentoOrmEntity } from '../../modules/status_pagamento/infra/typeorm/status_pagamento.entity';
import { VendaOrmEntity } from '../../modules/venda/infra/typeorm/venda.entity';
import { VendaItemOrmEntity } from '../../modules/venda_item/infra/typeorm/venda_item.entity';

export const tenantEntities: (Function | string | EntitySchema)[] = [
  CategoriaOrmEntity,
  ClienteOrmEntity,
  ContagemClienteOrmEntity,
  ContasPagarOrmEntity,
  ContasReceberOrmEntity,
  MovimentoEstoqueOrmEntity,
  LojaOrmEntity,
  PagamentoOrmEntity,
  PaginasOrmEntity,
  ProdutoOrmEntity,
  RegraFiscalOrmEntity,
  StatusPagamentoOrmEntity,
  VendaOrmEntity,
  VendaItemOrmEntity,
];
