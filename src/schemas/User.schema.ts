import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true })
  password: string;
  @Prop({
    default: 'user',
    enum: ['admin', 'mod', 'user'],
  })
  role: string;
  @Prop({
    default: Date.now(),
  })
  createdAt: Date;

  @Prop({
    default: Date.now(),
  })
  updatedAt: Date;
  // @Prop()
  // devices: string[];
  // @Prop()
  // token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
