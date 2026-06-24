import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePagamentoDto {
  @ApiProperty({ example: 'Cartão de Crédito' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiPropertyOptional({ example: 2.5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxa?: number;
}
