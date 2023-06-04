// import { Expose } from 'class-transformer';
import { baseDto } from '../common/baseDto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AzukiDocument = HydratedDocument<Azuki>;

@Schema()
export class Azuki extends baseDto {
  @Prop({ type: {} })
  attributes: any;

  @Prop()
  public_id: string;
}

export const AzukiSchema = SchemaFactory.createForClass(Azuki);
