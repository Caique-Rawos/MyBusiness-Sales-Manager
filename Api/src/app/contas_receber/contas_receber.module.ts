import { Module } from '@nestjs/common';
import { ContasReceberService } from './contas_receber.service';
import { ContasReceberController } from './contas_receber.controller';
import { ContasReceberEntity } from './entity/contas_receber.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ContasReceberEntity])],
  providers: [ContasReceberService],
  controllers: [ContasReceberController],
})
export class ContasReceberModule {}
