import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class createUser {
  @MinLength(5)
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  solvedproblems: string[];

  @IsEnum(['Java', 'Python', 'JavaScript', 'C++', 'C'])
  favoriteProgrammingLanguage: 'Java' | 'Python' | 'JavaScript' | 'C++' | 'C';

  submissions: string[];
}
