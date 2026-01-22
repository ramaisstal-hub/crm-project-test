import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'User UUID' })
  @IsString()
  userId!: string;

  @ApiProperty()
  @IsString()
  @Length(6, 200)
  password!: string;
}
