import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCrachaRfidDto } from '../../application/dto/create-cracha_rfid.dto';
import { CrachaRfid } from '../../domain/cracha_rfid';
import { CrachaRfidRepository } from '../../domain/cracha_rfid.repository';
import { CrachaRfidOrmEntity } from './cracha_rfid.entity';

@Injectable()
export class CrachaRfidTypeOrmRepository implements CrachaRfidRepository {
  constructor(
    @InjectRepository(CrachaRfidOrmEntity)
    private readonly repository: Repository<CrachaRfidOrmEntity>,
  ) {}

  async create(data: CreateCrachaRfidDto): Promise<CrachaRfid> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<CrachaRfid[]> {
    return this.repository.find({ order: { id: 'DESC' } });
  }

  async findById(id: number): Promise<CrachaRfid | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByHash(hash: string): Promise<CrachaRfid | null> {
    return this.repository.findOne({ where: { hash } });
  }
}