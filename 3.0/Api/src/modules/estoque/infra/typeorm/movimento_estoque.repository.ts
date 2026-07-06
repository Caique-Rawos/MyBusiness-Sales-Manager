import { Injectable } from '@nestjs/common';
import { Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { TenantContextService } from '../../../../shared/tenant/tenant-context.service';
import { MovimentoEstoque, TipoMovimento } from '../../domain/movimento_estoque';
import {
  MovimentoEstoqueFiltro,
  MovimentoEstoqueRepository,
  RegistrarMovimentoDto,
} from '../../domain/movimento_estoque.repository';
import { MovimentoEstoqueOrmEntity } from './movimento_estoque.entity';

@Injectable()
export class MovimentoEstoqueTypeOrmRepository implements MovimentoEstoqueRepository {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get repository(): Repository<MovimentoEstoqueOrmEntity> {
    return this.tenantContext.getRepository(MovimentoEstoqueOrmEntity);
  }

  async registrar(data: RegistrarMovimentoDto): Promise<MovimentoEstoque> {
    return this.repository.save(data);
  }

  async findSaidaPorVendaItem(idVendaItem: number): Promise<MovimentoEstoque | null> {
    return this.repository.findOne({
      where: { idVendaItem, tipo: TipoMovimento.SAIDA },
    });
  }

  async findAll(filtro: MovimentoEstoqueFiltro): Promise<MovimentoEstoque[]> {
    const where: FindOptionsWhere<MovimentoEstoqueOrmEntity> = {};

    if (filtro.idProduto) {
      where.idProduto = filtro.idProduto;
    }

    if (filtro.dataInicio && filtro.dataFim) {
      where.dataMovimento = Between(filtro.dataInicio, filtro.dataFim);
    } else if (filtro.dataInicio) {
      where.dataMovimento = MoreThanOrEqual(filtro.dataInicio);
    } else if (filtro.dataFim) {
      where.dataMovimento = LessThanOrEqual(filtro.dataFim);
    }

    return this.repository.find({ where, relations: ['produto'], order: { dataMovimento: 'DESC' } });
  }
}
