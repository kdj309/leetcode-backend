import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateUserStatDTO {
  @ApiProperty({
    type: String,
    description: 'The MongoDB ObjectId of the user (required).',
    example: '64b7c2f5e4b0a2a1b2c3d4e5',
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiProperty({
    type: Number,
    description: 'Total points earned by the user (optional).',
    example: 1200,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  totalPoints?: number;

  @ApiProperty({
    type: Number,
    description: 'Number of easy problems solved by the user (optional).',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  easyProblems?: number;

  @ApiProperty({
    type: Number,
    description: 'Number of medium problems solved by the user (optional).',
    example: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  mediumProblems?: number;

  @ApiProperty({
    type: Number,
    description: 'Number of hard problems solved by the user (optional).',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  hardProblems?: number;

  @ApiProperty({
    type: Number,
    description: 'Total number of problems solved by the user (optional).',
    example: 55,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  totalSolved?: number;

  @ApiProperty({
    type: Number,
    description: 'Current rank of the user (optional).',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  currentRank?: number;

  @ApiProperty({
    type: Number,
    description: 'Previous rank of the user (optional).',
    example: 12,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  previousRank?: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Last updated timestamp (optional).',
    example: '2024-07-26T12:34:56.789Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  lastUpdated?: Date;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the user is currently online (optional).',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Last seen timestamp (optional).',
    example: '2024-07-25T18:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  lastSeen?: Date;
}
