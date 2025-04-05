import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusPagamentoEntity } from './entity/status_pagamento.entity';
import { StatusPagamentoController } from './status_pagamento.controller';
import { StatusPagamentoService } from './status_pagamento.service';

@Module({
  imports: [TypeOrmModule.forFeature([StatusPagamentoEntity])],
  providers: [StatusPagamentoService],
  controllers: [StatusPagamentoController],
  exports: [StatusPagamentoService],
})
export class StatusPagamentoModule {}
