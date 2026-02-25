import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './job.entity';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {}

  async create(recruiterId: string, createJobDto: CreateJobDto): Promise<Job> {
    const job = this.jobsRepository.create({
      ...createJobDto,
      recruiterId,
    });
    return this.jobsRepository.save(job);
  }

  async findAll(): Promise<Job[]> {
    return this.jobsRepository.find({
      relations: ['recruiter'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByRecruiterId(recruiterId: string): Promise<Job[]> {
    return this.jobsRepository.find({
      where: { recruiterId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['recruiter'],
    });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async update(id: string, recruiterId: string, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.findOne(id);
    if (job.recruiterId !== recruiterId) {
      throw new ForbiddenException('You can only edit your own job postings');
    }
    Object.assign(job, updateJobDto);
    return this.jobsRepository.save(job);
  }

  async delete(id: string, recruiterId: string): Promise<void> {
    const job = await this.findOne(id);
    if (job.recruiterId !== recruiterId) {
      throw new ForbiddenException('You can only delete your own job postings');
    }
    await this.jobsRepository.remove(job);
  }
}
