import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserDocument } from './user.schema';

@Schema({ timestamps: true })
export class SessionToken {
  @Prop()
  token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: UserDocument;

  @Prop()
  expiryDate: Date;
}
export const SessionTokenSchema = SchemaFactory.createForClass(SessionToken);
