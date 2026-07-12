import { Controller, Get, Query } from '@nestjs/common';
import { MovimentoEstoque } from '../domain/movimento_estoque';
import { EstoqueService } from '../application/estoque.service';
import { FiltroEstoqueDto } from '../application/dto/filtro-estoque.dto';
import { RequirePermission } from '../../auth/presentation/decorators/require-permission.decorator';
import { PERMISSOES } from '../../auth/application/permission-catalog';

@Controller('estoque')
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  @RequirePermission(PERMISSOES.ESTOQUE.listar)
  @Get()
  findAll(@Query() filtro: FiltroEstoqueDto): Promise<MovimentoEstoque[]> {
    return this.estoqueService.findAll(filtro);
  }
}
