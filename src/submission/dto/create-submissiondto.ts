import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty({
    type: String,
    description: 'The MongoDB ObjectId of the user who made the submission.',
    example: '64b7c2f5e4b0a2a1b2c3d4e5',
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiProperty({
    type: String,
    description: 'The MongoDB ObjectId of the problem being solved.',
    example: '64b7c2f5e4b0a2a1b2c3d4e6',
  })
  @IsNotEmpty()
  @IsMongoId()
  problemId: string;

  @ApiProperty({
    type: String,
    description: 'The status of the submission (e.g., Accepted, Wrong Answer, Runtime Error).',
    example: 'Accepted',
  })
  @IsNotEmpty()
  @IsIn(["PENDING","ACCEPTED","WRONG_ANSWER"])
  status: string;

  @ApiProperty({
    type: String,
    description: 'The language ID used for the submission.',
    example: 'python',
  })
  @IsNotEmpty()
  @IsString()
  langaugeId: string;

  @ApiProperty({
    type: String,
    description: 'The code submitted by the user.',
    example: 'def two_sum(nums, target): ...',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    type: Number,
    description: 'The execution time of the submission in milliseconds.',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  executionTime: number;

  @ApiProperty({
    type: Number,
    description: 'The memory used by the submission in kilobytes (optional).',
    example: 256,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  memoryUsed?: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'The date and time when the submission was made (optional).',
    example: '2024-07-26T12:34:56.789Z',
    required: false,
  })
  @IsOptional()
  submittedAt?: Date;
}