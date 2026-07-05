import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateStatusPagamentoDto {
  @ApiPropertyOptional({ example: 'Pago' })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiPropertyOptional({ example: '#00C851' })
  @IsString()
  @IsOptional()
  cor?: string;
}
