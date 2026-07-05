import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePaginasDto {
  @ApiPropertyOptional({ example: 'Página Inicial' })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiPropertyOptional({ example: 'home' })
  @IsString()
  @IsOptional()
  alias?: string;

  @ApiPropertyOptional({ example: 'home.html' })
  @IsString()
  @IsOptional()
  arquivo?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
