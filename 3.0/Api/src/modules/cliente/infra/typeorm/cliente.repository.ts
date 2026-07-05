import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from '../../application/dto/create-cliente.dto';
import { UpdateClienteDto } from '../../application/dto/update-cliente.dto';
import { Cliente } from '../../domain/cliente';
import { ClienteRepository } from '../../domain/cliente.repository';
import { ClienteOrmEntity } from './cliente.entity';

@Injectable()
export class ClienteTypeOrmRepository implements ClienteRepository {
  constructor(
    @InjectRepository(ClienteOrmEntity)
    private readonly repository: Repository<ClienteOrmEntity>,
  ) {}

  async create(data: CreateClienteDto): Promise<Cliente> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<Cliente[]> {
    return this.repository.find({ order: { id: 'DESC' } });
  }

  async findById(id: number): Promise<Cliente | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, data: UpdateClienteDto): Promise<Cliente> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}