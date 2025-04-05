import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LojaEntity } from './entity/loja.entity';
import { LojaController } from './loja.controller';
import { LojaService } from './loja.service';

@Module({
  imports: [TypeOrmModule.forFeature([LojaEntity])],
  providers: [LojaService],
  controllers: [LojaController],
  exports: [LojaService],
})
export class LojaModule {}
