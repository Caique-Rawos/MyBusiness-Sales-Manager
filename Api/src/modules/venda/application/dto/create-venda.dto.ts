import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateVendaDto {
  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalVenda?: number;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dataVenda?: Date;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  idCliente: number;
}
