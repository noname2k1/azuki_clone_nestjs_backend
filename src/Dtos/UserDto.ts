import { baseDto } from '../common/baseDto';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class UserDto extends baseDto {
  @IsNotEmpty()
  @Expose()
  username: string;

  @IsNotEmpty()
  password: string;

  @Expose()
  role: string;
}
