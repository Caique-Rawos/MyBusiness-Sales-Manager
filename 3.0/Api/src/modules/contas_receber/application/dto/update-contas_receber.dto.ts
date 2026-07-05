import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class UpdateContasReceberDto {
  @ApiPropertyOptional({ example: 'Venda #001' })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiPropertyOptional({ example: 500.00 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  valorTotal?: number;

  @ApiPropertyOptional({ example: 500.00 })
  @Type(() => Number)
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
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  idPagamento?: number;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  idStatusPagamento?: number;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  idVenda?: number;
}
