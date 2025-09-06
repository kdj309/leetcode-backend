import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateSubmissionDTO {
  submissionId: Types.ObjectId;

  @ApiProperty({
    type: String,
    description:
      'The status of the submission (e.g., Accepted, Wrong Answer, Runtime Error).',
    example: 'Accepted',
  })
  @IsNotEmpty()
  @IsIn(['ACCEPTED', 'WRONG_ANSWER'])
  status: string;

  @IsNotEmpty()
  actual_output: string;

  @IsOptional()
  @IsNumber()
  memoryUsed?: number;

  @IsNotEmpty()
  @IsNumber()
  executionTime: number;

  @IsNotEmpty()
  @IsMongoId()
  problemId: string;

  @IsNotEmpty()
  @IsNumber()
  languageId: number;

  @IsOptional()
  submittedAt?: Date;
}
