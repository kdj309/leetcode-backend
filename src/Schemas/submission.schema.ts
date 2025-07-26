import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';
import { Problem } from './problem.schema';

@Schema({ timestamps: true })
export class Submission {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' })
    problemId: Problem;

    @Prop({ required: true })
    status: string;

    @Prop({ required: true })
    langaugeId: string;

    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    executionTime: number;

    @Prop()
    memoryUsed: number;

    @Prop()
    submittedAt: Date;
}
export const SubmissionSchema = SchemaFactory.createForClass(Submission);
