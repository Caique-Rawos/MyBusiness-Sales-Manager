import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class AddContagemClienteDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  autorizado: boolean;
}
