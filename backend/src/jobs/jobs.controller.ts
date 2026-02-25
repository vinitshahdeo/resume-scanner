import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  async findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(req.user.userId, createJobDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('recruiter/my')
  async getMyJobs(@Request() req) {
    return this.jobsService.findByRecruiterId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.update(id, req.user.userId, updateJobDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    await this.jobsService.delete(id, req.user.userId);
    return { message: 'Job deleted successfully' };
  }
}
