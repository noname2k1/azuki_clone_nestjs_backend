// import { Expose } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SongDocument = HydratedDocument<Song>;

@Schema()
export class Song {
  @Prop()
  id: string;

  @Prop({ unique: true })
  name: string;

  @Prop()
  src: string;

  @Prop()
  singer: string;

  @Prop()
  public_id: string;

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

export const SongSchema = SchemaFactory.createForClass(Song);
