import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { VendaItemService } from './venda_item.service';
import { VendaItemEntity } from './entity/venda_item.entity';

@Controller('venda_item')
export class VendaItemController {
  constructor(private readonly vendaItemService: VendaItemService) {}

  @Post()
  async create(
    @Body() vendaItemData: VendaItemEntity,
  ): Promise<VendaItemEntity> {
    const result = await this.vendaItemService.create(vendaItemData);
    await this.vendaItemService.NovoTotalVenda(vendaItemData.idVenda);
    return result;
  }

  @Get()
  async findAll(): Promise<VendaItemEntity[]> {
    return this.vendaItemService.findAll();
  }

  @Get('venda')
  async findByIdVenda(
    @Query('id_venda') id_venda: number,
  ): Promise<VendaItemEntity[]> {
    return this.vendaItemService.findByIdVenda(id_venda);
  }
}
