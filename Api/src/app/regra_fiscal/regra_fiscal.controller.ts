import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegraFiscalService } from './regra_fiscal.service';
import { RegraFiscalEntity } from './entity/regra_fiscal.entity';

@Controller('regra_fiscal')
export class RegraFiscalController {
  constructor(private readonly regraFiscalService: RegraFiscalService) {}

  @Post()
  create(
    @Body() RegraFiscalData: RegraFiscalEntity,
  ): Promise<RegraFiscalEntity> {
    return this.regraFiscalService.create(RegraFiscalData);
  }

  @Get()
  findAll(): Promise<RegraFiscalEntity[]> {
    return this.regraFiscalService.findAll();
  }
}
