import { Module } from '@nestjs/common';
import { ProdutoModule } from 'src/modules/produto/produto.module';
import { RegraFiscalService } from './application/regra_fiscal.service';
import { REGRA_FISCAL_REPOSITORY } from './domain/regra_fiscal.repository';
import { RegraFiscalTypeOrmRepository } from './infra/typeorm/regra_fiscal.repository';
import { RegraFiscalController } from './presentation/regra_fiscal.controller';

@Module({
  imports: [ProdutoModule],
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
