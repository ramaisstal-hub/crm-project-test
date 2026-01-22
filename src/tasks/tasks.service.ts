import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly repo: Repository<Task>,
  ) {}

  async create(userId: string, dto: CreateTaskDto): Promise<Task> {
    const task = this.repo.create({ userId, ...dto });
    return this.repo.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.repo.find({
      order: { createdAt: 'DESC' },
      relations: { comments: true },
    });
  }

  async findById(id: string): Promise<Task> {
    const task = await this.repo.findOne({
      where: { id },
      relations: { comments: true },
    });
    if (!task) throw new NotFoundException('Задача не найдена');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findById(id);
    Object.assign(task, dto);
    return this.repo.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findById(id);
    await this.repo.remove(task);
  }

  async assertOwner(taskId: string, userId: string) {
    const task = await this.repo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Задача не найдена');
    if (task.userId !== userId)
      throw new ForbiddenException('Можно изменять/удалять только свои задачи');
  }
}
