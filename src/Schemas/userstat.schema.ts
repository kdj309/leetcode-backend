import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class UserStat {
   @Prop({ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  })
  userId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  totalPoints: number;

  @Prop({ type: Number, default: 0 })
  easyProblems: number;

  @Prop({ type: Number, default: 0 })
  mediumProblems: number;

  @Prop({ type: Number, default: 0 })
  hardProblems: number;

  @Prop({ type: Number, default: 0 })
  totalSolved: number;

  @Prop({ type: Number, default: 0 })
  currentRank: number;

  @Prop({ type: Number, default: 0 })
  previousRank: number;

  @Prop({ type: Date, default: Date.now })
  lastUpdated: Date;

  @Prop({ type: Boolean, default: false })
  isOnline: boolean;

  @Prop({ type: Date, default: Date.now })
  lastSeen: Date;
}
export const UserStatSchema = SchemaFactory.createForClass(UserStat);
