import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class signInDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
