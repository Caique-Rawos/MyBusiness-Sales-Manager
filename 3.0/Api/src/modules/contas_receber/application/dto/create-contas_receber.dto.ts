import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateContasReceberDto {
  @ApiProperty({ example: 'Venda #001' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ example: 500.00 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valorTotal: number;

  @ApiPropertyOptional({ example: 0 })
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

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idPagamento: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idStatusPagamento: number;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  idVenda?: number;
}

// idPagamento/idStatusPagamento só ficam opcionais aqui -- usado pelo ContasReceberProcessor
// pra criar a conta ainda sem forma de pagamento/status definidos. Nunca exposto via HTTP:
// o controller usa CreateContasReceberDto (ambos obrigatórios), validado pelo ValidationPipe.
export type CreateContasReceberInterno = Omit<
  CreateContasReceberDto,
  'idPagamento' | 'idStatusPagamento'
> &
  Partial<Pick<CreateContasReceberDto, 'idPagamento' | 'idStatusPagamento'>>;
