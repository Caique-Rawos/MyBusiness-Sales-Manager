import { IsArray, IsEmail, IsInt, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nome!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  senha!: string;

  @IsArray()
  @IsInt({ each: true })
  papelIds!: number[];
}
