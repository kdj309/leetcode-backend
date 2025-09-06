import {Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserStat, UserStatSchema } from './userstat.schema';

@Schema({ timestamps: true })
export class LeadBoardCache {
  @Prop({ 
    type: [UserStatSchema], 
    default: [] 
  })
  rankings: UserStat[];

  @Prop({ default: Date.now })
  generatedAt: Date;

  @Prop()
  expiresAt: Date;
}
export const LeadBoardCacheSchema = SchemaFactory.createForClass(LeadBoardCache);
