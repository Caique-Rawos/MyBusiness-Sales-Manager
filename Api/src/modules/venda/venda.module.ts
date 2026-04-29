import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContasReceberModule } from '../contas_receber/contas_receber.module';
import { VendaService } from './application/venda.service';
import { VENDA_REPOSITORY } from './domain/venda.repository';
import { VendaOrmEntity } from './infra/typeorm/venda.entity';
import { VendaTypeOrmRepository } from './infra/typeorm/venda.repository';
import { VendaController } from './presentation/venda.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VendaOrmEntity]), ContasReceberModule],
  controllers: [VendaController],
  providers: [
    VendaService,
    {
      provide: VENDA_REPOSITORY,
      useClass: VendaTypeOrmRepository,
    },
  ],
  exports: [VendaService],
})
export class VendaModule {}