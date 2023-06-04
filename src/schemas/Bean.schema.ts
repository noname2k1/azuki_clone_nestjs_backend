// import { Expose } from 'class-transformer';
import { baseDto } from '../common/baseDto';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BeanDocument = HydratedDocument<Bean>;

@Schema()
export class Bean extends baseDto {
  @Prop({ type: {} })
  attributes: any;

  @Prop()
  public_id: string;
}

export const BeanSchema = SchemaFactory.createForClass(Bean);
