import { IsNotEmpty } from 'class-validator';
export class CreateBeanDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  attributes: string;
  @IsNotEmpty()
  image: string;
}
