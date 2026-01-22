import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  description?: string;
}
