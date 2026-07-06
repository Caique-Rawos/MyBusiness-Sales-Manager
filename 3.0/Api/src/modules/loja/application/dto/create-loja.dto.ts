import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateLojaDto {
  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  id?: number;

  @ApiProperty({ example: 'Minha Loja' })
  @IsString()
  @IsNotEmpty()
  nomeFantasia: string;

  @ApiProperty({ example: '12.345.678/0001-00' })
  @IsString()
  @IsNotEmpty()
  cpfCnpj: string;

  @ApiPropertyOptional({ example: '123456789' })
  @IsString()
  @IsOptional()
  ie?: string;

  @ApiProperty({ example: 'Rua Principal, 123 - Centro' })
  @IsString()
  @IsNotEmpty()
  endereco: string;
}
