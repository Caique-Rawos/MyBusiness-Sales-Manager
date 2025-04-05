import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContasReceberController } from './contas_receber.controller';
import { ContasReceberService } from './contas_receber.service';
import { ContasReceberEntity } from './entity/contas_receber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContasReceberEntity])],
  providers: [ContasReceberService],
  controllers: [ContasReceberController],
  exports: [ContasReceberService],
})
export class ContasReceberModule {}
