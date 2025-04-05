import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContasPagarController } from './contas_pagar.controller';
import { ContasPagarService } from './contas_pagar.service';
import { ContasPagarEntity } from './entity/contas_pagar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContasPagarEntity])],
  providers: [ContasPagarService],
  controllers: [ContasPagarController],
  exports: [ContasPagarService],
})
export class ContasPagarModule {}
