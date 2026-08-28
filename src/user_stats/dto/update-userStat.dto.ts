import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    description: 'Difficulty level of user',
  })
  @IsIn(['easy', 'medium', 'hard'])
  @IsNotEmpty()
  difficult: string;

  @ApiProperty({
    type: String,
    description: 'The MongoDB ObjectId of the problem',
    example: '64b7c2f5e4b0a2a1b2c3d4e5',
  })
  @IsNotEmpty()
  @IsMongoId()
  problemId: string;
}
