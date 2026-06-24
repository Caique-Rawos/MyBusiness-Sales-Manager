import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContasReceberService } from '../application/contas_receber.service';
import { CreateContasReceberDto } from '../application/dto/create-contas_receber.dto';
import { UpdateContasReceberDto } from '../application/dto/update-contas_receber.dto';
import { ContasReceber } from '../domain/contas_receber';

@ApiTags('Contas a Receber')
@Controller('contas-receber')
export class ContasReceberController {
  constructor(private readonly contasReceberService: ContasReceberService) {}

  @ApiOperation({ summary: 'Criar conta a receber' })
  @Post()
  create(@Body() data: CreateContasReceberDto): Promise<ContasReceber> {
    return this.contasReceberService.create(data);
  }

  @ApiOperation({ summary: 'Listar contas a receber' })
  @Get()
  findAll(): Promise<ContasReceber[]> {
    return this.contasReceberService.findAll();
  }

  @ApiOperation({ summary: 'Buscar conta a receber por ID' })
  @Get(':id')
  findById(@Param('id') id: string): Promise<ContasReceber> {
    return this.contasReceberService.findById(Number(id));
  }

  @ApiOperation({ summary: 'Atualizar conta a receber' })
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateContasReceberDto): Promise<ContasReceber> {
    return this.contasReceberService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Remover conta a receber' })
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.contasReceberService.delete(Number(id));
  }
}
