import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly repo: Repository<Comment>,
  ) {}

  async create(userId: string, dto: CreateCommentDto): Promise<Comment> {
    const comment = this.repo.create({
      userId,
      taskId: dto.taskId,
      text: dto.text,
    });
    return this.repo.save(comment);
  }

  async findById(id: string): Promise<Comment> {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Комментарий не найден');
    return c;
  }

  async findByIdOrNull(id: string): Promise<Comment | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByTask(taskId: string): Promise<Comment[]> {
    return this.repo.find({ where: { taskId }, order: { createdAt: 'DESC' } });
  }

  async update(id: string, dto: UpdateCommentDto): Promise<Comment> {
    const c = await this.findById(id);
    if (dto.taskId) c.taskId = dto.taskId;
    if (dto.text) c.text = dto.text;
    return this.repo.save(c);
  }

  async remove(id: string): Promise<void> {
    const c = await this.findById(id);
    await this.repo.remove(c);
  }
}
