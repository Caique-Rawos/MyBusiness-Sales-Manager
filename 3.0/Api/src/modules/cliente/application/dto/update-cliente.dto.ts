import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateClienteDto {
  @ApiPropertyOptional({ example: 'João Silva' })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiPropertyOptional({ example: '123.456.789-00' })
  @IsString()
  @IsOptional()
  cpfCnpj?: string;

  @ApiPropertyOptional({ example: 'Cliente VIP' })
  @IsString()
  @IsOptional()
  observacao?: string;
}
