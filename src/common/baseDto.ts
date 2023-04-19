// import { IsNotEmpty } from 'class-validator';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export abstract class baseDto {
  @Prop()
  id: string;

  @Prop({ unique: true })
  name: string;

  @Prop()
  image: string;

  @Prop({
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    default: Date.now,
  })
  updatedAt: Date;

  @Prop({ default: false })
  deleted: boolean;
}
