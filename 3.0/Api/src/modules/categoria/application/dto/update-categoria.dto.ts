import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoriaDto {
  @ApiPropertyOptional({ example: 'Eletrônicos' })
  @IsString()
  @IsOptional()
  descricao?: string;
}
