import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model } from 'mongoose';
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

export type RetrytokenDocument = HydratedDocument<Retrytoken>;

// 1. Interface defining custom static methods
export interface RetrytokenModel extends Model<RetrytokenDocument> {
  generateToken(user: UserDocument): Promise<string>;
  verifyExpiry(token: RetrytokenDocument): boolean;
}

// 2. Standard Schema creation
export const RetryTokenSchema = SchemaFactory.createForClass(Retrytoken);

// 3. Define statics by explicitly typing 'this' as RetrytokenModel internally
RetryTokenSchema.statics.generateToken = async function (
  user: UserDocument,
): Promise<string> {
  // Cast 'this' to RetrytokenModel so TypeScript allows instantiation
  const model = this as unknown as RetrytokenModel;

  const expiredDate = new Date();
  expiredDate.setSeconds(expiredDate.getSeconds() + 604800);
  const _token = uuidv4();

  const _object = new model({
    token: _token,
    userId: user._id,
    expiryDate: expiredDate,
  });

  const refreshToken = await _object.save();
  return refreshToken.token;
};

RetryTokenSchema.statics.verifyExpiry = function (
  token: RetrytokenDocument,
): boolean {
  return token.expiryDate.getTime() < new Date().getTime();
};
