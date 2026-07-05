import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateVendaItemDto {
  @ApiProperty({ example: 100.00 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precoUnitario: number;

  @ApiPropertyOptional({ example: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  desconto?: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantidade: number;

  @ApiProperty({ example: 200.00 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  subTotal: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idVenda: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idProduto: number;
}
