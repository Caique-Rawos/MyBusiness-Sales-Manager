import { Module } from '@nestjs/common';
import { RegraFiscalService } from './regra_fiscal.service';
import { RegraFiscalController } from './regra_fiscal.controller';
import { RegraFiscalEntity } from './entity/regra_fiscal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RegraFiscalEntity])],
  providers: [RegraFiscalService],
  controllers: [RegraFiscalController],
})
export class RegraFiscalModule {}
