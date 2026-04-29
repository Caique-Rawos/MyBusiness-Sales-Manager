import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RegraFiscalService } from '../application/regra_fiscal.service';
import { CreateRegraFiscalDto } from '../application/dto/create-regra_fiscal.dto';
import { UpdateRegraFiscalDto } from '../application/dto/update-regra_fiscal.dto';
import { RegraFiscal } from '../domain/regra_fiscal';

@Controller('regra_fiscal')
export class RegraFiscalController {
  constructor(private readonly regraFiscalService: RegraFiscalService) {}

  @Post()
  create(@Body() data: CreateRegraFiscalDto): Promise<RegraFiscal> {
    return this.regraFiscalService.create(data);
  }

  @Get()
  findAll(): Promise<RegraFiscal[]> {
    return this.regraFiscalService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<RegraFiscal> {
    return this.regraFiscalService.findById(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateRegraFiscalDto): Promise<RegraFiscal> {
    return this.regraFiscalService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.regraFiscalService.delete(Number(id));
  }
}