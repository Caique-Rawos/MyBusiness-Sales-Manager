import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PapelService } from '../application/papel.service';
import { CreatePapelDto } from '../application/dto/create-papel.dto';
import { UpdatePapelDto } from '../application/dto/update-papel.dto';
import { PERMISSOES } from '../application/permission-catalog';
import { CurrentUser } from './decorators/current-user.decorator';
import { RequirePermission } from './decorators/require-permission.decorator';
import { JwtPayload } from '../domain/jwt-payload';

@ApiTags('Papeis')
@Controller('papeis')
export class PapelController {
  constructor(private readonly papelService: PapelService) {}

  @RequirePermission(PERMISSOES.PAPEL.criar)
  @Post()
  create(@Body() dto: CreatePapelDto, @CurrentUser() user: JwtPayload) {
    return this.papelService.create(dto, user.tenantId);
  }

  @RequirePermission(PERMISSOES.PAPEL.listar)
  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.papelService.findAllByTenant(user.tenantId);
  }

  @RequirePermission(PERMISSOES.PAPEL.editar)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePapelDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.papelService.update(id, user.tenantId, dto);
  }

  @RequirePermission(PERMISSOES.PAPEL.deletar)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.papelService.remove(id, user.tenantId);
  }
}
