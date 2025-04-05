import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagamentoEntity } from './entity/pagamento.entity';
import { PagamentoController } from './pagamento.controller';
import { PagamentoService } from './pagamento.service';

@Module({
  imports: [TypeOrmModule.forFeature([PagamentoEntity])],
  providers: [PagamentoService],
  controllers: [PagamentoController],
  exports: [PagamentoService],
})
export class PagamentoModule {}
