import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column()
  location: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'simple-json' })
  requirements: string[];

  @Column({ type: 'simple-json', nullable: true })
  skills: string[];

  @Column({ nullable: true })
  salaryRange: string;

  @Column({ default: 'open' })
  status: string;

  @ManyToOne(() => User, (user) => user.jobs)
  @JoinColumn({ name: 'recruiterId' })
  recruiter: User;

  @Column()
  recruiterId: string;

  @CreateDateColumn()
  createdAt: Date;
}
