import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContagemClienteService } from './application/contagem_cliente.service';
import { CONTAGEM_CLIENTE_REPOSITORY } from './domain/contagem_cliente.repository';
import { ContagemClienteOrmEntity } from './infra/typeorm/contagem_cliente.entity';
import { ClienteTypeOrmRepository } from './infra/typeorm/contagem_cliente.repository';
import { ContagemClienteController } from './presentation/cliente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContagemClienteOrmEntity])],
  controllers: [ContagemClienteController],
  providers: [
    ContagemClienteService,
    {
      provide: CONTAGEM_CLIENTE_REPOSITORY,
      useClass: ClienteTypeOrmRepository,
    },
  ],
  exports: [ContagemClienteService],
})
export class ContagemClienteModule {}
