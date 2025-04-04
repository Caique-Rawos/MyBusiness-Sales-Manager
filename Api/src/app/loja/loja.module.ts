import { Module } from '@nestjs/common';
import { LojaService } from './loja.service';
import { LojaController } from './loja.controller';
import { LojaEntity } from './entity/loja.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LojaEntity])],
  providers: [LojaService],
  controllers: [LojaController],
  exports: [LojaService],
})
export class LojaModule {}
