import { Language, TeacherPaymentType } from '@prisma/client';
import { IsArray, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTeacherDto {
  @IsString() fullName: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() specialization?: string;
  @IsOptional() @IsArray() @IsEnum(Language, { each: true }) languages?: Language[];
  @IsOptional() @IsNumber() hourlyRate?: number;
  @IsOptional() @IsEnum(TeacherPaymentType) paymentType?: TeacherPaymentType;
  @IsOptional() @IsNumber() rating?: number;
}

export class UpdateTeacherDto extends CreateTeacherDto {
  @IsOptional() @IsString() declare fullName: string;
}
