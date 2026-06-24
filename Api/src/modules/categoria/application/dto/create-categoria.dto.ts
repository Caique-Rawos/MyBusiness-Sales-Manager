import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({ example: 'Eletrônicos' })
  @IsString()
  @IsNotEmpty()
  descricao: string;
}
