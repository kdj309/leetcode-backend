import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from 'src/enums/roles.enum';

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

  @IsEnum(['user', 'admin'])
  roles: Role[];

  @IsEnum(['Java', 'Python', 'JavaScript', 'C++', 'C'])
  favoriteProgrammingLanguage: 'Java' | 'Python' | 'JavaScript' | 'C++' | 'C';

  submissions: string[];
}
