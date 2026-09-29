import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PERMISSOES } from '../../auth/application/permission-catalog';
import { RequirePermission } from '../../auth/presentation/decorators/require-permission.decorator';
import { CrachaRfidService } from '../application/cracha_rfid.service';
import { CreateCrachaRfidDto } from '../application/dto/create-cracha_rfid.dto';

export interface CrachaRfidResposta {
  id: number;
  nome: string;
}

@ApiTags('Crachás RFID')
@Controller('cracha-rfid')
export class CrachaRfidController {
  constructor(private readonly crachaRfidService: CrachaRfidService) {}

  @ApiOperation({ summary: 'Cadastrar crachá RFID' })
  @RequirePermission(PERMISSOES.CRACHA_RFID.criar)
  @Post()
  async create(@Body() data: CreateCrachaRfidDto): Promise<CrachaRfidResposta> {
    const { id, nome } = await this.crachaRfidService.create(data);
    return { id, nome };
  }

  @ApiOperation({ summary: 'Listar crachás RFID' })
  @RequirePermission(PERMISSOES.CRACHA_RFID.listar)
  @Get()
  async findAll(): Promise<CrachaRfidResposta[]> {
    const crachas = await this.crachaRfidService.findAll();
    return crachas.map(({ id, nome }) => ({ id, nome }));
  }
}
