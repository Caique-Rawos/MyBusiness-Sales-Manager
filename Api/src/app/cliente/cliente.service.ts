import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteEntity } from './entity/cliente.entity';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(ClienteEntity)
    private clienteRepository: Repository<ClienteEntity>,
  ) {}

  async create(clienteData: ClienteEntity): Promise<ClienteEntity> {
    const cliente = await this.clienteRepository.create(clienteData);
    return this.clienteRepository.save(cliente);
  }

  async findAll(): Promise<ClienteEntity[]> {
    return this.clienteRepository.find();
  }
}
