import { IsArray, IsInt } from 'class-validator';

export class UpdateUsuarioPapeisDto {
  @IsArray()
  @IsInt({ each: true })
  papelIds!: number[];
}
