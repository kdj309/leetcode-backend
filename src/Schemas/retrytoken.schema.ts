import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserDocument, User } from './user.schema';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class Retrytoken {
  @Prop()
  token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop()
  expiryDate: Date;
}
export const RetryTokenSchema = SchemaFactory.createForClass(Retrytoken);

RetryTokenSchema.statics.generateToken = async function (user: UserDocument) {
  const expiredDate = new Date();
  expiredDate.setSeconds(expiredDate.getSeconds() + 604800);
  const _token = uuidv4();
  const _object = new this({
    token: _token,
    userId: user._id,
    expiryDate: expiredDate,
  });
  const refreshToken = await _object.save();
  return refreshToken.token;
};
RetryTokenSchema.statics.verifyExpiry = async function (token: Retrytoken) {
  return token.expiryDate.getTime() < new Date().getTime();
};
