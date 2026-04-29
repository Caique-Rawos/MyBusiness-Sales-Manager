import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  REGRA_FISCAL_REPOSITORY,
  RegraFiscalRepository,
} from '../domain/regra_fiscal.repository';
import { CreateRegraFiscalDto } from './dto/create-regra_fiscal.dto';
import { UpdateRegraFiscalDto } from './dto/update-regra_fiscal.dto';
import { RegraFiscal } from '../domain/regra_fiscal';

@Injectable()
export class RegraFiscalService {
  constructor(
    @Inject(REGRA_FISCAL_REPOSITORY)
    private readonly repository: RegraFiscalRepository,
  ) {}

  create(data: CreateRegraFiscalDto): Promise<RegraFiscal> {
    return this.repository.create(data);
  }

  findAll(): Promise<RegraFiscal[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<RegraFiscal> {
    const regra = await this.repository.findById(id);
    if (!regra) {
      throw new NotFoundException('RegraFiscal not found');
    }
    return regra;
  }

  async update(id: number, data: UpdateRegraFiscalDto): Promise<RegraFiscal> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('RegraFiscal not found');
    }
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('RegraFiscal not found');
    }
    await this.repository.delete(id);
  }
}