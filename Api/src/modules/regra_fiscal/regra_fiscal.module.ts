import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegraFiscalService } from './application/regra_fiscal.service';
import { REGRA_FISCAL_REPOSITORY } from './domain/regra_fiscal.repository';
import { RegraFiscalOrmEntity } from './infra/typeorm/regra_fiscal.entity';
import { RegraFiscalTypeOrmRepository } from './infra/typeorm/regra_fiscal.repository';
import { RegraFiscalController } from './presentation/regra_fiscal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RegraFiscalOrmEntity])],
  controllers: [RegraFiscalController],
  providers: [
    RegraFiscalService,
    {
      provide: REGRA_FISCAL_REPOSITORY,
      useClass: RegraFiscalTypeOrmRepository,
    },
  ],
  exports: [RegraFiscalService],
})
export class RegraFiscalModule {}