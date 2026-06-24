import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateVendaItemDto } from '../application/dto/create-venda_item.dto';
import { UpdateVendaItemDto } from '../application/dto/update-venda_item.dto';
import { VendaItemService } from '../application/venda_item.service';
import { VendaItem } from '../domain/venda_item';

@ApiTags('Itens de Venda')
@Controller('venda-item')
export class VendaItemController {
  constructor(private readonly vendaItemService: VendaItemService) {}

  @ApiOperation({ summary: 'Criar item de venda' })
  @Post()
  async create(@Body() data: CreateVendaItemDto): Promise<VendaItem> {
    return await this.vendaItemService.create(data);
  }

  @ApiOperation({ summary: 'Listar todos os itens de venda' })
  @Get()
  findAll(): Promise<VendaItem[]> {
    return this.vendaItemService.findAll();
  }

  @ApiOperation({ summary: 'Listar itens por venda' })
  @ApiQuery({ name: 'id_venda', required: true, type: Number })
  @Get('venda')
  findByIdVenda(@Query('id_venda') idVenda: number): Promise<VendaItem[]> {
    return this.vendaItemService.findByIdVenda(Number(idVenda));
  }

  @ApiOperation({ summary: 'Buscar item de venda por ID' })
  @Get(':id')
  findById(@Param('id') id: string): Promise<VendaItem> {
    return this.vendaItemService.findById(Number(id));
  }

  @ApiOperation({ summary: 'Atualizar item de venda' })
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateVendaItemDto): Promise<VendaItem> {
    return this.vendaItemService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Remover item de venda' })
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.vendaItemService.delete(Number(id));
  }
}
