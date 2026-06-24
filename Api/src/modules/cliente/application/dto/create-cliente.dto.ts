import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: '123.456.789-00' })
  @IsString()
  @IsNotEmpty()
  cpfCnpj: string;

  @ApiPropertyOptional({ example: 'Cliente VIP' })
  @IsString()
  @IsOptional()
  observacao?: string;
}
