import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto, StudentQueryDto, UpdateStudentDto } from './dto/student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(q: StudentQueryDto) {
    const page = Number(q.page) || 1;
    const pageSize = Number(q.pageSize) || 20;
    const where: Prisma.StudentWhereInput = {
      ...(q.status ? { status: q.status } : {}),
      ...(q.language ? { language: q.language } : {}),
      ...(q.search
        ? { OR: [{ fullName: { contains: q.search, mode: 'insensitive' } }, { phone: { contains: q.search } }] }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.student.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          parent: true,
          enrollments: { where: { isActive: true }, include: { group: { include: { teacher: true } } } },
        },
      }),
      this.prisma.student.count({ where }),
    ]);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        parent: true,
        enrollments: { include: { group: { include: { teacher: true, classroom: true } } } },
        payments: { orderBy: { createdAt: 'desc' } },
        attendances: { include: { lesson: true }, orderBy: { createdAt: 'desc' }, take: 50 },
        documents: true,
        notes: { include: { author: true }, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!student) throw new NotFoundException('Студент не найден');

    // средний балл + статистика посещаемости
    const attendanceStats = student.attendances.reduce(
      (acc, a) => {
        acc[a.status] = (acc[a.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { ...student, attendanceStats };
  }

  create(dto: CreateStudentDto) {
    return this.prisma.student.create({ data: this.toData(dto) });
  }

  async update(id: string, dto: UpdateStudentDto) {
    await this.ensure(id);
    return this.prisma.student.update({ where: { id }, data: this.toData(dto) });
  }

  async remove(id: string) {
    await this.ensure(id);
    return this.prisma.student.delete({ where: { id } });
  }

  private toData(dto: CreateStudentDto | UpdateStudentDto): Prisma.StudentUncheckedCreateInput {
    return {
      fullName: dto.fullName,
      phone: dto.phone,
      email: dto.email,
      level: dto.level,
      notesText: dto.notesText,
      parentId: dto.parentId,
      language: dto.language,
      studyType: dto.studyType,
      status: dto.status,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
    } as Prisma.StudentUncheckedCreateInput;
  }

  private async ensure(id: string) {
    const s = await this.prisma.student.findUnique({ where: { id } });
    if (!s) throw new NotFoundException('Студент не найден');
  }
}
