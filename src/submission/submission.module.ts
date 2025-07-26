import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from 'src/Schemas/submission.schema';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Submission.name, schema: SubmissionSchema }])],
    controllers: [SubmissionController],
    providers: [SubmissionService],
    exports: [SubmissionService],
})
export class SubmissionModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        
    }
}
