import { Module } from '@nestjs/common';
import { ContasPagarService } from './contas_pagar.service';
import { ContasPagarController } from './contas_pagar.controller';
import { ContasPagarEntity } from './entity/contas_pagar.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ContasPagarEntity])],
  providers: [ContasPagarService],
  controllers: [ContasPagarController],
})
export class ContasPagarModule {}
