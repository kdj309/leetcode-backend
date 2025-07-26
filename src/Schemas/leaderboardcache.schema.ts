import {Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class LeadBoardCache {

  rankings: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      username: String,
      totalPoints: Number,
      rank: Number,
      easyCount: Number,
      mediumCount: Number,
      hardCount: Number,
      isOnline: Boolean
    }
  ];
  generatedAt: Date;
  expiresAt: Date
}
export const LeadBoardCacheSchema = SchemaFactory.createForClass(LeadBoardCache);
