import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaginasDto {
  @ApiProperty({ example: 'Página Inicial' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ example: 'home' })
  @IsString()
  @IsNotEmpty()
  alias: string;

  @ApiProperty({ example: 'home.html' })
  @IsString()
  @IsNotEmpty()
  arquivo: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  ativo: boolean;
}
