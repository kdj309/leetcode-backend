import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from 'src/enums/roles.enum';
import { supportedlanguages } from 'src/interfaces/config.interface';

export class createUser {
  @ApiProperty({
    type: String,
    description:
      'The username of the user (required). Must be at least 5 characters long.',
    example: 'john_doe',
  })
  @MinLength(5)
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: String,
    description:
      'The email address of the user (required). Must be a valid email format.',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
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

  @ApiProperty({
    type: [String],
    description: 'The roles assigned to the user (optional).',
    example: ['admin', 'user'],
    required: false,
  })
  roles: Role[];

  @ApiProperty({
    type: Number,
    description:
      "The user's favorite programming language (required). Programming language id.",
    example: 50,
  })
  @IsEnum(supportedlanguages)
  favoriteProgrammingLanguage: number;
}
