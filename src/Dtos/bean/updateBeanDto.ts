import { IsNotEmpty } from 'class-validator';
export class UpdateBeanDto {
  @IsNotEmpty()
  attributes: string;
  @IsNotEmpty()
  image: string;
}
