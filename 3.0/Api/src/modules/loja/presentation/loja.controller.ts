import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/presentation/decorators/require-permission.decorator';
import { PERMISSOES } from '../../auth/application/permission-catalog';
import { CreateLojaDto } from '../application/dto/create-loja.dto';
import { UpdateLojaDto } from '../application/dto/update-loja.dto';
import { LojaService } from '../application/loja.service';
import { Loja } from '../domain/loja';

@ApiTags('Loja')
@Controller('loja')
export class LojaController {
  constructor(private readonly lojaService: LojaService) {}

  @ApiOperation({ summary: 'Criar loja' })
  @RequirePermission(PERMISSOES.LOJA.criar)
  @Post()
  create(@Body() data: CreateLojaDto): Promise<Loja> {
    return this.lojaService.create(data);
  }

  @ApiOperation({ summary: 'Listar lojas' })
  @RequirePermission(PERMISSOES.LOJA.listar)
  @Get()
  findAll(): Promise<Loja[]> {
    return this.lojaService.findAll();
  }

  @ApiOperation({ summary: 'Buscar loja por ID' })
  @RequirePermission(PERMISSOES.LOJA.listar)
  @Get(':id')
  findById(@Param('id') id: string): Promise<Loja> {
    return this.lojaService.findById(Number(id));
  }

  @ApiOperation({ summary: 'Atualizar loja' })
  @RequirePermission(PERMISSOES.LOJA.editar)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateLojaDto): Promise<Loja> {
    return this.lojaService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Remover loja' })
  @RequirePermission(PERMISSOES.LOJA.deletar)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.lojaService.delete(Number(id));
  }
}
