import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserStatDTO {
  @ApiProperty({
    type: String,
    description: 'The MongoDB ObjectId of the user (required).',
    example: '64b7c2f5e4b0a2a1b2c3d4e5',
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: Types.ObjectId;
}
