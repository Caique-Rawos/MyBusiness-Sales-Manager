import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdatePagamentoDto {
  @ApiPropertyOptional({ example: 'Cartão de Crédito' })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiPropertyOptional({ example: 2.5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxa?: number;
}
