import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendaModule } from 'src/modules/venda/venda.module';
import { ClienteService } from './application/cliente.service';
import { CLIENTE_REPOSITORY } from './domain/cliente.repository';
import { ClienteOrmEntity } from './infra/typeorm/cliente.entity';
import { ClienteTypeOrmRepository } from './infra/typeorm/cliente.repository';
import { ClienteController } from './presentation/cliente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteOrmEntity]), VendaModule],
  controllers: [ClienteController],
  providers: [
    ClienteService,
    {
      provide: CLIENTE_REPOSITORY,
      useClass: ClienteTypeOrmRepository,
    },
  ],
  exports: [ClienteService],
})
export class ClienteModule {}
