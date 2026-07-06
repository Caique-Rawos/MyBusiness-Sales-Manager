import { Module } from '@nestjs/common';
import { LojaService } from './application/loja.service';
import { LOJA_REPOSITORY } from './domain/loja.repository';
import { LojaTypeOrmRepository } from './infra/typeorm/loja.repository';
import { LojaController } from './presentation/loja.controller';

@Module({
  imports: [],
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