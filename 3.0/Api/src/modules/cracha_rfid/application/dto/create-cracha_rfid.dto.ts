import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCrachaRfidDto {
  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @ApiProperty({ example: 'a3f5c9e1b7d24f60' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  hash: string;
}
