import { IsArray, IsInt, IsString } from 'class-validator';

export class CreatePapelDto {
  @IsString()
  nome!: string;

  @IsArray()
  @IsInt({ each: true })
  permissaoIds!: number[];
}
