import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/presentation/decorators/require-permission.decorator';
import { PERMISSOES } from '../../auth/application/permission-catalog';
import { ProdutoService } from '../application/produto.service';
import { CreateProdutoDto } from '../application/dto/create-produto.dto';
import { UpdateProdutoDto } from '../application/dto/update-produto.dto';
import { Produto } from '../domain/produto';

@ApiTags('Produtos')
@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @ApiOperation({ summary: 'Criar produto' })
  @RequirePermission(PERMISSOES.PRODUTO.criar)
  @Post()
  create(@Body() data: CreateProdutoDto): Promise<Produto> {
    return this.produtoService.create(data);
  }

  @ApiOperation({ summary: 'Listar produtos' })
  @RequirePermission(PERMISSOES.PRODUTO.listar)
  @Get()
  findAll(): Promise<Produto[]> {
    return this.produtoService.findAll();
  }

  @ApiOperation({ summary: 'Buscar produto por ID' })
  @RequirePermission(PERMISSOES.PRODUTO.listar)
  @Get(':id')
  findById(@Param('id') id: string): Promise<Produto> {
    return this.produtoService.findById(Number(id));
  }

  @ApiOperation({ summary: 'Atualizar produto' })
  @RequirePermission(PERMISSOES.PRODUTO.editar)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateProdutoDto): Promise<Produto> {
    return this.produtoService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Remover produto' })
  @RequirePermission(PERMISSOES.PRODUTO.deletar)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.produtoService.delete(Number(id));
  }
}
