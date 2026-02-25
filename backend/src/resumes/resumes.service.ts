import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resume } from './resume.entity';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private resumesRepository: Repository<Resume>,
  ) {}

  async create(userId: string, file: Express.Multer.File, title?: string): Promise<Resume> {
    const resume = this.resumesRepository.create({
      userId,
      filename: file.filename,
      originalName: file.originalname,
      title: title || file.originalname,
      // In a real app, we'd parse the PDF/DOCX to extract text and skills
      content: 'Resume content would be extracted here',
      skills: [],
    });
    return this.resumesRepository.save(resume);
  }

  async findByUserId(userId: string): Promise<Resume[]> {
    return this.resumesRepository.find({
      where: { userId },
      order: { uploadedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Resume> {
    const resume = await this.resumesRepository.findOne({ where: { id } });
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }
    return resume;
  }

  async findAll(): Promise<Resume[]> {
    return this.resumesRepository.find({
      relations: ['user'],
      order: { uploadedAt: 'DESC' },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const resume = await this.resumesRepository.findOne({ where: { id, userId } });
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }
    await this.resumesRepository.remove(resume);
  }
}
