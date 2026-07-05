import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateRegraFiscalDto {
  @ApiPropertyOptional({ example: 'Regra Padrão' })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiPropertyOptional({ example: '8471.30.19' })
  @IsString()
  @IsOptional()
  ncm?: string;

  @ApiPropertyOptional({ example: 12 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  icms?: number;

  @ApiPropertyOptional({ example: 1.65 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  pis?: number;

  @ApiPropertyOptional({ example: 7.6 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  cofins?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  ipi?: number;
}
