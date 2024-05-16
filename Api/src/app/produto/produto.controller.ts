import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoEntity } from './entity/produtos.entity';

@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  create(@Body() produtoData: ProdutoEntity): Promise<ProdutoEntity> {
    return this.produtoService.create(produtoData);
  }

  @Get()
  findAll(): Promise<ProdutoEntity[]> {
    return this.produtoService.findAll();
  }
}
