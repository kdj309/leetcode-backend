import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from 'src/enums/roles.enum';
import { supportedlanguages } from 'src/interfaces/config.interface';

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
