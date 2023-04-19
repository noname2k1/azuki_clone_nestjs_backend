import { IsNotEmpty } from 'class-validator';

export class SongDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  singer: string;
}
