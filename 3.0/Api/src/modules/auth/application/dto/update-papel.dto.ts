import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdatePapelDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  permissaoIds?: number[];
}
