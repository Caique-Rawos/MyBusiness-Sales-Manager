import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CrachaRfid } from '../domain/cracha_rfid';
import { CRACHA_RFID_REPOSITORY, CrachaRfidRepository } from '../domain/cracha_rfid.repository';
import { CreateCrachaRfidDto } from './dto/create-cracha_rfid.dto';

@Injectable()
export class CrachaRfidService {
  constructor(
    @Inject(CRACHA_RFID_REPOSITORY)
    private readonly repository: CrachaRfidRepository,
  ) {}

  async create(data: CreateCrachaRfidDto): Promise<CrachaRfid> {
    const existente = await this.repository.findByHash(data.hash);
    if (existente) {
      throw new ConflictException('Hash já cadastrado em outro crachá');
    }
    return this.repository.create(data);
  }

  findAll(): Promise<CrachaRfid[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<CrachaRfid> {
    const cracha = await this.repository.findById(id);
    if (!cracha) {
      throw new NotFoundException('Crachá não encontrado');
    }
    return cracha;
  }

  async findByHash(hash: string): Promise<CrachaRfid> {
    const cracha = await this.repository.findByHash(hash);
    if (!cracha) {
      throw new NotFoundException('Crachá não encontrado');
    }
    return cracha;
  }
}
