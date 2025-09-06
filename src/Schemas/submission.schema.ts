import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';
import { Problem } from './problem.schema';

@Schema({ timestamps: true })
export class Submission {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' })
    problemId: mongoose.Types.ObjectId;

    @Prop({ required: true })
    status: string;

    @Prop({ required: true })
    languageId: number;

    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    executionTime: number;

    @Prop()
    memoryUsed: number;

    @Prop()
    submittedAt: Date;

    @Prop()
    input:string

    @Prop()
    expected_output:string

    @Prop()
    actual_output:string

    @Prop()
    submissionId:string
}
export const SubmissionSchema = SchemaFactory.createForClass(Submission);
