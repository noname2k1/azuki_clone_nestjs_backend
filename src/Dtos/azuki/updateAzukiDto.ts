import { IsNotEmpty } from 'class-validator';
export class UpdateAzukiDto {
  @IsNotEmpty()
  attributes: string;
  @IsNotEmpty()
  image: string;
}
