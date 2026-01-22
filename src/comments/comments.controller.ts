import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CommentOwnerGuard } from '../common/guards/comment-owner.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsService } from './comments.service';

@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

  @Post()
  @Roles(Role.AUTHOR)
  create(@Req() req: any, @Body() dto: CreateCommentDto) {
    return this.comments.create(req.user.id, dto);
  }

  @Get()
  findByTask(@Query('task_id') taskId: string) {
    return this.comments.findByTask(taskId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comments.findById(id);
  }

  @Patch(':id')
  @UseGuards(CommentOwnerGuard)
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.comments.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(CommentOwnerGuard)
  async remove(@Param('id') id: string) {
    await this.comments.remove(id);
    return { ok: true };
  }
}
