import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class UpdateContasPagarDto {
  @ApiPropertyOptional({ example: 'Conta de luz' })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiPropertyOptional({ example: 250.00 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  valorTotal?: number;

  @ApiPropertyOptional({ example: 250.00 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  valorPago?: number;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dataVencimento?: Date;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  idPagamento?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  idStatusPagamento?: number;
}
