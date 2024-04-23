import { Module } from '@nestjs/common';
import { StatusPagamentoService } from './status_pagamento.service';
import { StatusPagamentoController } from './status_pagamento.controller';
import { StatusPagamentoEntity } from './entity/status_pagamento.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StatusPagamentoEntity])],
  providers: [StatusPagamentoService],
  controllers: [StatusPagamentoController],
})
export class StatusPagamentoModule {}
