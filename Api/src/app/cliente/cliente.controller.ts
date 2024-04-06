import { Controller, Post, Get, Body } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteEntity } from './entity/cliente.entity';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  async create(@Body() clienteData: ClienteEntity): Promise<ClienteEntity> {
    return this.clienteService.create(clienteData);
  }

  @Get()
  async findAll(): Promise<ClienteEntity[]> {
    return this.clienteService.findAll();
  }
}
