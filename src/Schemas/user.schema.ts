import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Problem } from './problem.schema';

export type UserDocument = HydratedDocument<User>;
const commonLanguages = ['Java', 'Python', 'JavaScript', 'C++', 'C'];
@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    default: [],
  })
  solvedproblems: Problem[];

  @Prop({ type: String, enum: commonLanguages })
  favoriteProgrammingLanguage: string;

  @Prop({ default: [] })
  submissions: {
    problemId: mongoose.Schema.Types.ObjectId;
    submissionId: string;
    status: string;
    submittedAt: Date;
  }[];
}

export const Userschema = SchemaFactory.createForClass(User);
