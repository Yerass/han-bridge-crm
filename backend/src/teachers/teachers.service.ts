import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';

// weeks per month for hours/month projection (4 lessons-weeks per month)
const WEEKS_PER_MONTH = 4;

function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return Math.max(0, eh * 60 + em - (sh * 60 + sm));
}

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const teachers = await this.prisma.teacher.findMany({ orderBy: { fullName: 'asc' } });
    return Promise.all(teachers.map((t) => this.buildWorkload(t.id)));
  }

  async findOne(id: string) {
    return this.buildWorkload(id);
  }

  create(dto: CreateTeacherDto) {
    return this.prisma.teacher.create({ data: dto });
  }

  async update(id: string, dto: UpdateTeacherDto) {
    await this.ensure(id);
    return this.prisma.teacher.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensure(id);
    return this.prisma.teacher.delete({ where: { id } });
  }

  /**
   * Computes the full workload card for a teacher:
   * groups, students, hours/week, hours/month, salary, income, profit.
   * (Replaces the manual Excel "Нагрузка учителя" sheet.)
   */
  async buildWorkload(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        groups: {
          include: {
            scheduleSlots: true,
            enrollments: { where: { isActive: true } },
          },
        },
      },
    });
    if (!teacher) throw new NotFoundException('Преподаватель не найден');

    const hourlyRate = Number(teacher.hourlyRate);
    let minutesPerWeek = 0;
    let studentsCount = 0;
    let groupsIncome = 0;

    const groups = teacher.groups.map((g) => {
      const groupMinutes = g.scheduleSlots.reduce((sum, s) => sum + minutesBetween(s.startTime, s.endTime), 0);
      const activeStudents = g.enrollments.length;
      const groupIncome = Number(g.monthlyPrice) * activeStudents;

      minutesPerWeek += groupMinutes;
      studentsCount += activeStudents;
      groupsIncome += groupIncome;

      return {
        id: g.id,
        name: g.name,
        students: activeStudents,
        hoursPerWeek: +(groupMinutes / 60).toFixed(2),
        income: groupIncome,
      };
    });

    const hoursPerWeek = +(minutesPerWeek / 60).toFixed(2);
    const hoursPerMonth = +(hoursPerWeek * WEEKS_PER_MONTH).toFixed(2);
    const salary = Math.round(hoursPerMonth * hourlyRate);
    const profit = groupsIncome - salary;

    return {
      id: teacher.id,
      fullName: teacher.fullName,
      phone: teacher.phone,
      email: teacher.email,
      specialization: teacher.specialization,
      languages: teacher.languages,
      paymentType: teacher.paymentType,
      hourlyRate,
      rating: teacher.rating,
      groupsCount: groups.length,
      studentsCount,
      hoursPerWeek,
      hoursPerMonth,
      salary,
      groupsIncome,
      profit,
      groups,
    };
  }

  private async ensure(id: string) {
    const t = await this.prisma.teacher.findUnique({ where: { id } });
    if (!t) throw new NotFoundException('Преподаватель не найден');
  }
}
