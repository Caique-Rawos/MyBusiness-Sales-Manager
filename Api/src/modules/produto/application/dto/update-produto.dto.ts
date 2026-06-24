import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class UpdateProdutoDto {
  @ApiPropertyOptional({ example: 'Notebook Dell Inspiron' })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiPropertyOptional({ example: '7891234567890' })
  @IsString()
  @IsOptional()
  codigoDeBarra?: string;

  @ApiPropertyOptional({ example: 2000.00 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  valorCusto?: number;

  @ApiPropertyOptional({ example: 2500.00 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  valorVenda?: number;

  @ApiPropertyOptional({ example: 'UN' })
  @IsString()
  @IsOptional()
  unidade?: string;

  @ApiPropertyOptional({ example: 'notebook-dell.jpg' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  idCategoria?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  idRegraFiscal?: number;
}
