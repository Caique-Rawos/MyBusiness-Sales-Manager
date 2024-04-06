import { Controller, Get } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoEntity } from './entity/produtos.entity';

@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Get()
  findAll(): Promise<ProdutoEntity[]> {
    return this.produtoService.findAll();
  }
}
