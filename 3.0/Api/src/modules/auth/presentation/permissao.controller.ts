import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PERMISSAO_REPOSITORY, PermissaoRepository } from '../domain/permissao.repository';
import { PERMISSOES } from '../application/permission-catalog';
import { RequirePermission } from './decorators/require-permission.decorator';

@ApiTags('Permissoes')
@Controller('permissoes')
export class PermissaoController {
  constructor(
    @Inject(PERMISSAO_REPOSITORY)
    private readonly permissaoRepository: PermissaoRepository,
  ) {}

  @RequirePermission(PERMISSOES.PAPEL.listar)
  @Get()
  findAll() {
    return this.permissaoRepository.findAll();
  }
}
