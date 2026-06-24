import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class UpdateVendaItemDto {
  @ApiPropertyOptional({ example: 100.00 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  precoUnitario?: number;

  @ApiPropertyOptional({ example: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  desconto?: number;

  @ApiPropertyOptional({ example: 2 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantidade?: number;

  @ApiPropertyOptional({ example: 200.00 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  subTotal?: number;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  idVenda?: number;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  idProduto?: number;
}
