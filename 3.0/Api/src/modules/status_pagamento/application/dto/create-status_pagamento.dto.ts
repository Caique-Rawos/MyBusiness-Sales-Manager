import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStatusPagamentoDto {
  @ApiProperty({ example: 'Pago' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ example: '#00C851' })
  @IsString()
  @IsNotEmpty()
  cor: string;
}
