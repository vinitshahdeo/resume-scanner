import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Resume } from '../resumes/resume.entity';
import { Job } from '../jobs/job.entity';

export enum UserRole {
  CANDIDATE = 'candidate',
  RECRUITER = 'recruiter',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.CANDIDATE,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Resume, (resume) => resume.user)
  resumes: Resume[];

  @OneToMany(() => Job, (job) => job.recruiter)
  jobs: Job[];
}
