import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateContasPagarDto {
  @ApiProperty({ example: 'Conta de luz' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ example: 250.00 })
  @IsNumber()
  @Min(0)
  valorTotal: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  valorPago?: number;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dataVencimento?: Date;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  idPagamento: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  idStatusPagamento: number;
}
