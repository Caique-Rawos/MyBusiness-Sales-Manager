import { Module } from '@nestjs/common';
import { PagamentoService } from './pagamento.service';
import { PagamentoController } from './pagamento.controller';
import { PagamentoEntity } from './entity/pagamento.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PagamentoEntity])],
  providers: [PagamentoService],
  controllers: [PagamentoController],
})
export class PagamentoModule {}
