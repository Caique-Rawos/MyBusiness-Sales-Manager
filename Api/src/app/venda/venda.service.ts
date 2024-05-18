import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendaEntity } from './entity/venda.entity';
import { Repository } from 'typeorm';
import { ContasReceberService } from '../contas_receber/contas_receber.service';
import { ContasReceberEntity } from '../contas_receber/entity/contas_receber.entity';
import { VendaUpdateDto } from './dto/atualizaTotalVenda.dto';

@Injectable()
export class VendaService {
  constructor(
    @InjectRepository(VendaEntity)
    private repository: Repository<VendaEntity>,
    private contasReceberService: ContasReceberService,
  ) {}

  async create(data: VendaEntity): Promise<VendaEntity> {
    const object = await this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<VendaEntity[]> {
    return this.repository.find({
      relations: ['cliente'],
      order: {
        id: 'DESC',
      },
    });
  }

  async atualizaTotal(vendaUpdateDto: VendaUpdateDto) {
    const venda = await this.repository.findOne({
      where: { id: vendaUpdateDto.id_venda },
    });
    venda.totalVenda = vendaUpdateDto.total;
    await this.repository.save(venda);

    this.contasReceberService.atualizaTotal(vendaUpdateDto);
    return;
  }
}
