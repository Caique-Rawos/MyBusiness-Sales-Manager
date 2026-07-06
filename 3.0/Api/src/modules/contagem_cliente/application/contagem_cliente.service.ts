import { Inject, Injectable } from '@nestjs/common';
import {
  CONTAGEM_CLIENTE_REPOSITORY,
  ContagemClienteRepository,
} from '../domain/contagem_cliente.repository';
import { AddContagemClienteDto } from './dto/add-contagem_cliente.dto';
import { ContagemCliente } from '../domain/contagem_cliente';

@Injectable()
export class ContagemClienteService {
  constructor(
    @Inject(CONTAGEM_CLIENTE_REPOSITORY)
    private readonly repository: ContagemClienteRepository,
  ) {}

  async add(data: AddContagemClienteDto): Promise<boolean> {
    if (data.autorizado) {
      const contagemAtual = await this.repository.findToday();
      if (contagemAtual) {
        contagemAtual.contagem += 1;
        this.repository.update(contagemAtual);
        return true;
      }
      this.repository.create();
      return true;
    }
    return false;
  }

  findToday(): Promise<ContagemCliente | null> {
    return this.repository.findToday();
  }
}
