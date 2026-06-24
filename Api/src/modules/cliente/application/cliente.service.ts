import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VendaService } from 'src/modules/venda/application/venda.service';
import {
  CLIENTE_REPOSITORY,
  ClienteRepository,
} from '../domain/cliente.repository';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from '../domain/cliente';

@Injectable()
export class ClienteService {
  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly repository: ClienteRepository,
    private readonly vendaService: VendaService,
  ) {}

  create(data: CreateClienteDto): Promise<Cliente> {
    return this.repository.create(data);
  }

  findAll(): Promise<Cliente[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<Cliente> {
    const cliente = await this.repository.findById(id);
    if (!cliente) {
      throw new NotFoundException('Cliente not found');
    }
    return cliente;
  }

  async update(id: number, data: UpdateClienteDto): Promise<Cliente> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('Cliente not found');
    }
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('Cliente not found');
    }

    const referenced = await this.vendaService.existsByClienteId(id);
    if (referenced) {
      throw new ConflictException('Cliente possui vendas vinculadas e não pode ser removido');
    }

    await this.repository.delete(id);
  }
}
