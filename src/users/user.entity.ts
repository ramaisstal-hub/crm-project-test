import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../common/enums/role.enum';
import { Task } from '../tasks/task.entity';
import { Comment } from '../comments/comment.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  password!: string;

  @Column({ type: 'text' })
  role!: Role;

  @Column({ type: 'uuid', nullable: true })
  taskId?: string | null;

  @OneToMany(() => Task, (t) => t.user)
  tasks!: Task[];

  @OneToMany(() => Comment, (c) => c.user)
  comments!: Comment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
