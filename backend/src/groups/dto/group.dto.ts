import { Language, StudyType } from '@prisma/client';
import { IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ScheduleSlotDto {
  @IsInt() weekday: number; // 1..7
  @IsString() startTime: string;
  @IsString() endTime: string;
  @IsOptional() @IsString() classroomId?: string;
}

export class CreateGroupDto {
  @IsString() name: string;
  @IsOptional() @IsEnum(Language) language?: Language;
  @IsOptional() @IsString() level?: string;
  @IsOptional() @IsEnum(StudyType) studyType?: StudyType;
  @IsOptional() @IsNumber() monthlyPrice?: number;
  @IsOptional() @IsString() teacherId?: string;
  @IsOptional() @IsString() classroomId?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ScheduleSlotDto) schedule?: ScheduleSlotDto[];
  @IsOptional() @IsArray() @IsString({ each: true }) studentIds?: string[];
}

export class UpdateGroupDto extends CreateGroupDto {
  @IsOptional() @IsString() declare name: string;
}

export class EnrollDto {
  @IsString() studentId: string;
}
