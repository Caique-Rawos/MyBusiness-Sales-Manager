import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProdutoService } from '../application/produto.service';
import { CreateProdutoDto } from '../application/dto/create-produto.dto';
import { UpdateProdutoDto } from '../application/dto/update-produto.dto';
import { Produto } from '../domain/produto';

@ApiTags('Produtos')
@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @ApiOperation({ summary: 'Criar produto' })
  @Post()
  create(@Body() data: CreateProdutoDto): Promise<Produto> {
    return this.produtoService.create(data);
  }

  @ApiOperation({ summary: 'Listar produtos' })
  @Get()
  findAll(): Promise<Produto[]> {
    return this.produtoService.findAll();
  }

  @ApiOperation({ summary: 'Buscar produto por ID' })
  @Get(':id')
  findById(@Param('id') id: string): Promise<Produto> {
    return this.produtoService.findById(Number(id));
  }

  @ApiOperation({ summary: 'Atualizar produto' })
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateProdutoDto): Promise<Produto> {
    return this.produtoService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Remover produto' })
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.produtoService.delete(Number(id));
  }
}
