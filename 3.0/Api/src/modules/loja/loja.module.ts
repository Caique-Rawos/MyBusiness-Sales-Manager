import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LojaService } from './application/loja.service';
import { LOJA_REPOSITORY } from './domain/loja.repository';
import { LojaOrmEntity } from './infra/typeorm/loja.entity';
import { LojaTypeOrmRepository } from './infra/typeorm/loja.repository';
import { LojaController } from './presentation/loja.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LojaOrmEntity])],
  controllers: [LojaController],
  providers: [
    LojaService,
    {
      provide: LOJA_REPOSITORY,
      useClass: LojaTypeOrmRepository,
    },
  ],
  exports: [LojaService],
})
export class LojaModule {}