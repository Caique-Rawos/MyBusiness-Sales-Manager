import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLojaDto {
  @ApiPropertyOptional({ example: 'Minha Loja' })
  @IsString()
  @IsOptional()
  nomeFantasia?: string;

  @ApiPropertyOptional({ example: '12.345.678/0001-00' })
  @IsString()
  @IsOptional()
  cpfCnpj?: string;

  @ApiPropertyOptional({ example: '123456789' })
  @IsString()
  @IsOptional()
  ie?: string;

  @ApiPropertyOptional({ example: 'Rua Principal, 123 - Centro' })
  @IsString()
  @IsOptional()
  endereco?: string;
}
