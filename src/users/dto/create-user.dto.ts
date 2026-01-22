import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'P@ssw0rd!' })
  @IsString()
  @Length(6, 200)
  password!: string;

  @ApiProperty({ enum: Role, example: Role.USER })
  @IsEnum(Role)
  role!: Role;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  taskId?: string;
}
