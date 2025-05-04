import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { createUser } from './create-user.dto';
import { Role } from 'src/enums/roles.enum';

export class UpdateUserDto extends PartialType(createUser) {
  @ApiProperty({
    type: String,
    description:
      'The username of the user (optional). Must be at least 5 characters long.',
    example: 'john_doe',
    required: false,
  })
  username?: string;

  @ApiProperty({
    type: String,
    description:
      'The email address of the user (optional). Must be a valid email format.',
    example: 'john.doe@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    type: String,
    description:
      'The password for the user account (optional). Must be at least 8 characters long.',
    example: 'securePassword123',
    required: false,
  })
  password?: string;

  @ApiProperty({
    type: [String],
    description: 'The roles assigned to the user (optional).',
    example: ['admin', 'user'],
    required: false,
  })
  roles?: Role[];

  @ApiProperty({
    type: Number,
    description:
      "The user's favorite programming language (optional). Must be one of the supported languages.",
    example: 50,
    required: false,
  })
  favoriteProgrammingLanguage?: number;
}
