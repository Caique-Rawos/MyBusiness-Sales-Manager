import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateProdutoDto {
  @ApiProperty({ example: 'Notebook Dell Inspiron' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiPropertyOptional({ example: '7891234567890' })
  @IsString()
  @IsOptional()
  codigoDeBarra?: string;

  @ApiProperty({ example: 2000.00 })
  @IsNumber()
  @Min(0)
  valorCusto: number;

  @ApiProperty({ example: 2500.00 })
  @IsNumber()
  @Min(0)
  valorVenda: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  estoque: number;

  @ApiProperty({ example: 'UN' })
  @IsString()
  @IsNotEmpty()
  unidade: string;

  @ApiPropertyOptional({ example: 'notebook-dell.jpg' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  idCategoria: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  idRegraFiscal?: number;
}
