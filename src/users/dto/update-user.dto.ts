import { IsOptional, IsString, IsIn, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsIn(['author', 'user'])
  role?: 'author' | 'user';
}
