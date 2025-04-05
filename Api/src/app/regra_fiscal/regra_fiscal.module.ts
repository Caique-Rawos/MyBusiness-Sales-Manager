import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegraFiscalEntity } from './entity/regra_fiscal.entity';
import { RegraFiscalController } from './regra_fiscal.controller';
import { RegraFiscalService } from './regra_fiscal.service';

@Module({
  imports: [TypeOrmModule.forFeature([RegraFiscalEntity])],
  providers: [RegraFiscalService],
  controllers: [RegraFiscalController],
  exports: [RegraFiscalService],
})
export class RegraFiscalModule {}
