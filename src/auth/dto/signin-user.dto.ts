import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class signInDto {
  @ApiProperty({
    type: String,
    description:
      'The email address of the user (required). Must be a valid email format.',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description:
      'The password for the user account (required). Must be at least 8 characters long.',
    example: 'securePassword123',
  })
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
