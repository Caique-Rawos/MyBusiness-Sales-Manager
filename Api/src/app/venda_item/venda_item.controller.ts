import { Body, Controller, Get, Post } from '@nestjs/common';
import { VendaItemService } from './venda_item.service';
import { VendaItemEntity } from './entity/venda_item.entity';

@Controller('venda_item')
export class VendaItemController {
  constructor(private readonly vendaItemService: VendaItemService) {}

  @Post()
  async create(
    @Body() vendaItemData: VendaItemEntity,
  ): Promise<VendaItemEntity> {
    return this.vendaItemService.create(vendaItemData);
  }

  @Get()
  async findAll(): Promise<VendaItemEntity[]> {
    return this.vendaItemService.findAll();
  }
}
