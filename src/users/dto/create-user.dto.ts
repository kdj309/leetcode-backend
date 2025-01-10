import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { commonLanguages } from 'src/constants';
import { Role } from 'src/enums/roles.enum';
const supportedlanguages = commonLanguages.map((l) => l.id);

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

  roles: Role[];

  @IsEnum(supportedlanguages)
  favoriteProgrammingLanguage: number;
}
