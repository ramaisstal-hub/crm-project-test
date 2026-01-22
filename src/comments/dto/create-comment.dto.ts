import { IsUUID, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  task_id: string;

  @IsString()
  @Length(1, 1000)
  text: string;
}
