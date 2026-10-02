import { Body, Controller, Get, Post } from '@nestjs/common';
import { CrachaRfidService } from '../application/cracha_rfid.service';
import { CreateCrachaRfidDto } from '../application/dto/create-cracha_rfid.dto';

export interface CrachaRfidResposta {
  id: number;
  nome: string;
}

@Controller('cracha-rfid')
export class CrachaRfidController {
  constructor(private readonly crachaRfidService: CrachaRfidService) {}

  @Post()
  async create(@Body() data: CreateCrachaRfidDto): Promise<CrachaRfidResposta> {
    const { id, nome } = await this.crachaRfidService.create(data);
    return { id, nome };
  }

  @Get()
  async findAll(): Promise<CrachaRfidResposta[]> {
    const crachas = await this.crachaRfidService.findAll();
    return crachas.map(({ id, nome }) => ({ id, nome }));
  }
}