import { ContagemCliente } from './contagem_cliente';

export const CONTAGEM_CLIENTE_REPOSITORY = 'CONTAGEM_CLIENTE_REPOSITORY';

export interface ContagemClienteRepository {
  create(): Promise<void>;
  update(data: ContagemCliente): Promise<void>;
  findToday(): Promise<ContagemCliente | null>;
}
