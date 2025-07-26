import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class UserStat {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: User;
    totalPoints: Number;
    easyProblems: Number;
    mediumProblems: Number;
    hardProblems: Number;
    totalSolved: Number;
    currentRank: Number;
    previousRank: Number;
    lastUpdated: Date;
    isOnline: Boolean;
    lastSeen: Date
}
export const UserStatSchema = SchemaFactory.createForClass(UserStat);
