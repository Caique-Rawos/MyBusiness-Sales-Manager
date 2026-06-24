import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProdutoService } from 'src/modules/produto/application/produto.service';
import { CategoriaRepository, CATEGORIA_REPOSITORY } from '../domain/categoria.repository';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from '../domain/categoria';

@Injectable()
export class CategoriaService {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly repository: CategoriaRepository,
    private readonly produtoService: ProdutoService,
  ) {}

  create(data: CreateCategoriaDto): Promise<Categoria> {
    return this.repository.create(data);
  }

  findAll(): Promise<Categoria[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<Categoria> {
    const categoria = await this.repository.findById(id);
    if (!categoria) {
      throw new NotFoundException('Categoria not found');
    }
    return categoria;
  }

  async update(id: number, data: UpdateCategoriaDto): Promise<Categoria> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('Categoria not found');
    }
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('Categoria not found');
    }

    const referenced = await this.produtoService.existsByCategoriaId(id);
    if (referenced) {
      throw new ConflictException('Categoria possui produtos vinculados e não pode ser removida');
    }

    await this.repository.delete(id);
  }
}
