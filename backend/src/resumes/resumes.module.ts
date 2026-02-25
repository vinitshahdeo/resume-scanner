import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Resume } from './resume.entity';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resume]),
    MulterModule.register({
      dest: './uploads/resumes',
    }),
  ],
  providers: [ResumesService],
  controllers: [ResumesController],
  exports: [ResumesService],
})
export class ResumesModule {}
