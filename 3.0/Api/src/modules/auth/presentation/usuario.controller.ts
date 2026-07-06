import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsuarioService } from '../application/usuario.service';
import { CreateUsuarioDto } from '../application/dto/create-usuario.dto';
import { UpdateUsuarioPapeisDto } from '../application/dto/update-usuario-papeis.dto';
import { PERMISSOES } from '../application/permission-catalog';
import { CurrentUser } from './decorators/current-user.decorator';
import { RequirePermission } from './decorators/require-permission.decorator';
import { JwtPayload } from '../domain/jwt-payload';
import { UsuarioComPapeis } from '../domain/usuario';

function toPublicUsuario(usuario: UsuarioComPapeis) {
  const { senhaHash, ...publico } = usuario;
  return publico;
}

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @RequirePermission(PERMISSOES.USUARIO.criar)
  @Post()
  async create(@Body() dto: CreateUsuarioDto, @CurrentUser() user: JwtPayload) {
    return toPublicUsuario(await this.usuarioService.create(dto, user.tenantId));
  }

  @RequirePermission(PERMISSOES.USUARIO.listar)
  @Get()
  async findAll(@CurrentUser() user: JwtPayload) {
    const usuarios = await this.usuarioService.findAllByTenant(user.tenantId);
    return usuarios.map(toPublicUsuario);
  }

  @RequirePermission(PERMISSOES.USUARIO.editar)
  @Put(':id/papeis')
  updatePapeis(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioPapeisDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usuarioService.updatePapeis(id, user.tenantId, dto.papelIds);
  }

  @RequirePermission(PERMISSOES.USUARIO.deletar)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.usuarioService.remove(id, user.tenantId, user.sub);
  }
}
