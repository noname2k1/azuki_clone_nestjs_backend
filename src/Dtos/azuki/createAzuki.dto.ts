import { IsNotEmpty } from 'class-validator';
export class CreateAzukiDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  attributes: string;
  @IsNotEmpty()
  image: string;
}
