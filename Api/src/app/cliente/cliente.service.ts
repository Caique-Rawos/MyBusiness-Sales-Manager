import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteEntity } from './entity/cliente.entity';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(ClienteEntity)
    private repository: Repository<ClienteEntity>,
  ) {}

  async create(data: ClienteEntity): Promise<ClienteEntity> {
    const object = await this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<ClienteEntity[]> {
    return this.repository.find();
  }
}
