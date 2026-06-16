import { ApiPropertyOptional } from '@nestjs/swagger';
import { Language, StudentStatus, StudyType } from '@prisma/client';
import { IsDateString, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString() fullName: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsDateString() birthDate?: string;
  @IsOptional() @IsEnum(Language) language?: Language;
  @IsOptional() @IsString() level?: string;
  @IsOptional() @IsEnum(StudyType) studyType?: StudyType;
  @IsOptional() @IsEnum(StudentStatus) status?: StudentStatus;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsString() parentId?: string;
  @IsOptional() @IsString() notesText?: string;
}

export class UpdateStudentDto extends CreateStudentDto {
  @IsOptional() @IsString() declare fullName: string;
}

export class StudentQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ enum: StudentStatus }) @IsOptional() @IsEnum(StudentStatus) status?: StudentStatus;
  @ApiPropertyOptional({ enum: Language }) @IsOptional() @IsEnum(Language) language?: Language;
  @ApiPropertyOptional() @IsOptional() @IsNumber() page?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() pageSize?: number;
}
