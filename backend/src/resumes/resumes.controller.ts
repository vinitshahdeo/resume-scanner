import { Controller, Post, Get, Delete, Param, UseGuards, Request, UseInterceptors, UploadedFile, Body, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResumesService } from './resumes.service';

const storage = diskStorage({
  destination: './uploads/resumes',
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(private resumesService: ResumesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadResume(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title?: string,
  ) {
    return this.resumesService.create(req.user.userId, file, title);
  }

  @Get('my')
  async getMyResumes(@Request() req) {
    return this.resumesService.findByUserId(req.user.userId);
  }

  @Get('all')
  async getAllResumes() {
    return this.resumesService.findAll();
  }

  @Get(':id')
  async getResume(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Get(':id/download')
  async downloadResume(@Param('id') id: string, @Res() res: Response) {
    const resume = await this.resumesService.findOne(id);
    const filePath = join(process.cwd(), 'uploads/resumes', resume.filename);
    return res.download(filePath, resume.originalName);
  }

  @Delete(':id')
  async deleteResume(@Param('id') id: string, @Request() req) {
    await this.resumesService.delete(id, req.user.userId);
    return { message: 'Resume deleted successfully' };
  }
}
