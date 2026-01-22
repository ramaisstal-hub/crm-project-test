import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CommentsService } from '../../comments/comments.service';

@Injectable()
export class CommentOwnerGuard implements CanActivate {
  constructor(private readonly commentsService: CommentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user as { id: string } | undefined;
    const id = req.params?.id as string | undefined;

    if (!user?.id || !id) return false;

    const comment = await this.commentsService.findByIdOrNull(id);
    if (!comment) throw new NotFoundException('Комментарий не найден');

    if (comment.userId !== user.id)
      throw new ForbiddenException(
        'Можно изменять/удалять только свой комментарий',
      );

    return true;
  }
}
