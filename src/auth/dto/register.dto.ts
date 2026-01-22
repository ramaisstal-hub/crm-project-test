import { IsString, IsIn, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(6)
  password: string;

  @IsIn(['author', 'user'])
  role: 'author' | 'user';
}
