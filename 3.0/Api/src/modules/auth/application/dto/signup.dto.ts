import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  senha!: string;

  @IsString()
  nomeFantasia!: string;

  @IsString()
  cpfCnpj!: string;

  @IsString()
  endereco!: string;

  @IsOptional()
  @IsString()
  ie?: string;
}
