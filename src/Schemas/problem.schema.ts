import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { codesnipet } from 'src/interfaces/config.interface';

export type ProblemDocument = HydratedDocument<Problem>;
const difficultyLevels = ['easy', 'medium', 'hard'];
export interface testcase {
  input: string;
  output: string;
}
@Schema()
export class Problem {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: String, enum: difficultyLevels, default: difficultyLevels[0] })
  difficulty: string;

  @Prop({ required: true })
  sampleInput: string;

  @Prop({ required: true })
  sampleOutput: string;

  @Prop()
  testCases: testcase[];

  @Prop()
  status: string;

  @Prop()
  starterCode: codesnipet[];

  @Prop()
  systemCode: codesnipet[];
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);
