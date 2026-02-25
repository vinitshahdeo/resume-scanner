import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  company: string;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  description: string;

  @IsArray()
  requirements: string[];

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsOptional()
  salaryRange?: string;
}

export class UpdateJobDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  company?: string;

  @IsOptional()
  location?: string;

  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  requirements?: string[];

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsOptional()
  salaryRange?: string;

  @IsOptional()
  status?: string;
}
