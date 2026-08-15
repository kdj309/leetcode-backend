import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class LeadBoardCache {
  @Prop({ required: true })
  cacheKey: string;

  @Prop({ required: true })
  userCount: number;

  @Prop({ default: Date.now })
  generatedAt: Date;

  @Prop()
  expiresAt: Date;

  @Prop()
  dataHash: string;
}
export const LeadBoardCacheSchema =
  SchemaFactory.createForClass(LeadBoardCache);
