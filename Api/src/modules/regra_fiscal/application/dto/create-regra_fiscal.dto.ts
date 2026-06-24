import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateRegraFiscalDto {
  @ApiProperty({ example: 'Regra Padrão' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ example: '8471.30.19' })
  @IsString()
  @IsNotEmpty()
  ncm: string;

  @ApiProperty({ example: 12 })
  @IsNumber()
  @Min(0)
  icms: number;

  @ApiProperty({ example: 1.65 })
  @IsNumber()
  @Min(0)
  pis: number;

  @ApiProperty({ example: 7.6 })
  @IsNumber()
  @Min(0)
  cofins: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  ipi?: number;
}
