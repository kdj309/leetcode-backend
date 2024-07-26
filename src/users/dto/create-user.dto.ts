import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class createUser {
  @MinLength(5)
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(8)
  @IsNotEmpty()
  password: string;

  solvedproblems: string[];

  @IsEnum(['Java', 'Python', 'JavaScript', 'C++', 'C'])
  favoriteProgrammingLanguage: 'Java' | 'Python' | 'JavaScript' | 'C++' | 'C';

  submissions: string[];
}
