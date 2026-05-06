import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateVendaItemDto } from '../application/dto/create-venda_item.dto';
import { UpdateVendaItemDto } from '../application/dto/update-venda_item.dto';
import { VendaItemService } from '../application/venda_item.service';
import { VendaItem } from '../domain/venda_item';

@Controller('venda_item')
export class VendaItemController {
  constructor(private readonly vendaItemService: VendaItemService) {}

  @Post()
  async create(@Body() data: CreateVendaItemDto): Promise<VendaItem> {
    return await this.vendaItemService.create(data);
  }

  @Get()
  findAll(): Promise<VendaItem[]> {
    return this.vendaItemService.findAll();
  }

  @Get('venda')
  findByIdVenda(@Query('id_venda') idVenda: number): Promise<VendaItem[]> {
    return this.vendaItemService.findByIdVenda(Number(idVenda));
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<VendaItem> {
    return this.vendaItemService.findById(Number(id));
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateVendaItemDto,
  ): Promise<VendaItem> {
    return this.vendaItemService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.vendaItemService.delete(Number(id));
  }
}
