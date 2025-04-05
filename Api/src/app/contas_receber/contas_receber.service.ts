import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendaUpdateDto } from '../venda/dto/atualizaTotalVenda.dto';
import { ContasReceberEntity } from './entity/contas_receber.entity';

@Injectable()
export class ContasReceberService {
  constructor(
    @InjectRepository(ContasReceberEntity)
    private repository: Repository<ContasReceberEntity>,
  ) {}

  async create(data: ContasReceberEntity): Promise<ContasReceberEntity> {
    const object = await this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<ContasReceberEntity[]> {
    return this.repository.find({
      relations: ['pagamento', 'statusPagamento', 'venda'],
      order: {
        id: 'DESC',
      },
    });
  }

  async atualizaTotal(vendaUpdateDto: VendaUpdateDto) {
    const receber = await this.repository.findOne({
      where: { idVenda: vendaUpdateDto.id_venda },
    });
    receber.valorTotal = vendaUpdateDto.total;
    await this.repository.save(receber);
    return;
  }
}
