import { Injectable } from '@nestjs/common';
import { AttendanceStatus } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';

class MarkItemDto {
  @IsString() studentId: string;
  @IsEnum(AttendanceStatus) status: AttendanceStatus;
  @IsOptional() @IsString() comment?: string;
}

export class MarkAttendanceDto {
  @IsString() lessonId: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => MarkItemDto) records: MarkItemDto[];
}

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  /** Отметка посещаемости урока (upsert по студенту). */
  async mark(dto: MarkAttendanceDto) {
    const ops = dto.records.map((r) =>
      this.prisma.attendance.upsert({
        where: { lessonId_studentId: { lessonId: dto.lessonId, studentId: r.studentId } },
        update: { status: r.status, comment: r.comment },
        create: { lessonId: dto.lessonId, studentId: r.studentId, status: r.status, comment: r.comment },
      }),
    );
    await this.prisma.$transaction(ops);
    await this.prisma.lesson.update({ where: { id: dto.lessonId }, data: { status: 'COMPLETED' } });
    return this.byLesson(dto.lessonId);
  }

  byLesson(lessonId: string) {
    return this.prisma.attendance.findMany({ where: { lessonId }, include: { student: true } });
  }

  /** Отчёт по посещаемости группы. */
  async report(groupId: string) {
    const records = await this.prisma.attendance.findMany({
      where: { lesson: { groupId } },
      include: { student: true, lesson: true },
    });
    const byStatus = records.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const total = records.length || 1;
    return {
      total: records.length,
      byStatus,
      attendanceRate: +(((byStatus[AttendanceStatus.PRESENT] ?? 0) / total) * 100).toFixed(1),
      records,
    };
  }
}
