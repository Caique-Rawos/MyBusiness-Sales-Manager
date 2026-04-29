import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LOJA_REPOSITORY, LojaRepository } from '../domain/loja.repository';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { Loja } from '../domain/loja';

@Injectable()
export class LojaService {
  constructor(
    @Inject(LOJA_REPOSITORY)
    private readonly repository: LojaRepository,
  ) {}

  create(data: CreateLojaDto): Promise<Loja> {
    const payload = { ...data, id: data.id ?? 1 };
    return this.repository.create(payload);
  }

  findAll(): Promise<Loja[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<Loja> {
    const loja = await this.repository.findById(id);
    if (!loja) {
      throw new NotFoundException('Loja not found');
    }
    return loja;
  }

  async update(id: number, data: UpdateLojaDto): Promise<Loja> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('Loja not found');
    }
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('Loja not found');
    }
    await this.repository.delete(id);
  }
}
