import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto, EnrollDto, UpdateGroupDto } from './dto/group.dto';

const WEEKS_PER_MONTH = 4;

function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return Math.max(0, eh * 60 + em - (sh * 60 + sm));
}

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const groups = await this.prisma.group.findMany({ orderBy: { name: 'asc' } });
    return Promise.all(groups.map((g) => this.buildProfitability(g.id)));
  }

  findOne(id: string) {
    return this.buildProfitability(id);
  }

  async create(dto: CreateGroupDto) {
    const { schedule, studentIds, ...rest } = dto;
    return this.prisma.group.create({
      data: {
        ...rest,
        scheduleSlots: schedule ? { create: schedule } : undefined,
        enrollments: studentIds?.length ? { create: studentIds.map((studentId) => ({ studentId })) } : undefined,
      },
      include: { scheduleSlots: true },
    });
  }

  async update(id: string, dto: UpdateGroupDto) {
    await this.ensure(id);
    const { schedule, studentIds, ...rest } = dto;
    if (schedule) {
      await this.prisma.scheduleSlot.deleteMany({ where: { groupId: id } });
    }
    const group = await this.prisma.group.update({
      where: { id },
      data: { ...rest, scheduleSlots: schedule ? { create: schedule } : undefined },
      include: { scheduleSlots: true },
    });

    // синхронизация состава группы под переданный список
    if (studentIds) {
      const current = await this.prisma.groupStudent.findMany({ where: { groupId: id, isActive: true } });
      const currentIds = current.map((c) => c.studentId);
      const toRemove = current.filter((c) => !studentIds.includes(c.studentId));
      const toAdd = studentIds.filter((sid) => !currentIds.includes(sid));
      for (const r of toRemove) {
        await this.prisma.groupStudent.update({ where: { id: r.id }, data: { isActive: false, leftAt: new Date() } });
      }
      for (const sid of toAdd) {
        const existing = await this.prisma.groupStudent.findUnique({
          where: { groupId_studentId: { groupId: id, studentId: sid } },
        });
        if (existing) await this.prisma.groupStudent.update({ where: { id: existing.id }, data: { isActive: true, leftAt: null } });
        else await this.prisma.groupStudent.create({ data: { groupId: id, studentId: sid } });
      }
    }
    return group;
  }

  async remove(id: string) {
    await this.ensure(id);
    return this.prisma.group.delete({ where: { id } });
  }

  async enroll(groupId: string, dto: EnrollDto) {
    await this.ensure(groupId);
    const existing = await this.prisma.groupStudent.findUnique({
      where: { groupId_studentId: { groupId, studentId: dto.studentId } },
    });
    if (existing) {
      return this.prisma.groupStudent.update({ where: { id: existing.id }, data: { isActive: true, leftAt: null } });
    }
    return this.prisma.groupStudent.create({ data: { groupId, studentId: dto.studentId } });
  }

  async unenroll(groupId: string, studentId: string) {
    const existing = await this.prisma.groupStudent.findUnique({
      where: { groupId_studentId: { groupId, studentId } },
    });
    if (!existing) throw new BadRequestException('Студент не состоит в группе');
    return this.prisma.groupStudent.update({ where: { id: existing.id }, data: { isActive: false, leftAt: new Date() } });
  }

  /**
   * Автоматический расчёт прибыли группы:
   *   Доход − Зарплата преподавателя (за часы группы) − Расходы группы = Чистая прибыль
   *   Рентабельность = Чистая прибыль / Доход × 100
   */
  async buildProfitability(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        teacher: true,
        classroom: true,
        scheduleSlots: true,
        enrollments: { where: { isActive: true }, include: { student: true } },
      },
    });
    if (!group) throw new NotFoundException('Группа не найдена');

    const studentsCount = group.enrollments.length;
    const income = Number(group.monthlyPrice) * studentsCount;

    const minutesPerWeek = group.scheduleSlots.reduce((s, slot) => s + minutesBetween(slot.startTime, slot.endTime), 0);
    const hoursPerWeek = +(minutesPerWeek / 60).toFixed(2);
    const hoursPerMonth = +(hoursPerWeek * WEEKS_PER_MONTH).toFixed(2);
    const hourlyRate = group.teacher ? Number(group.teacher.hourlyRate) : 0;
    const teacherCost = Math.round(hoursPerMonth * hourlyRate);

    const otherExpensesAgg = await this.prisma.transaction.aggregate({
      where: { groupId: id, type: 'EXPENSE' },
      _sum: { amount: true },
    });
    const otherExpenses = Number(otherExpensesAgg._sum.amount ?? 0);

    const netProfit = income - teacherCost - otherExpenses;
    const margin = income > 0 ? +((netProfit / income) * 100).toFixed(1) : 0;

    return {
      id: group.id,
      name: group.name,
      language: group.language,
      level: group.level,
      studyType: group.studyType,
      monthlyPrice: Number(group.monthlyPrice),
      isActive: group.isActive,
      teacher: group.teacher ? { id: group.teacher.id, fullName: group.teacher.fullName, hourlyRate } : null,
      classroom: group.classroom,
      scheduleSlots: group.scheduleSlots,
      students: group.enrollments.map((e) => ({ id: e.student.id, fullName: e.student.fullName })),
      studentsCount,
      hoursPerWeek,
      hoursPerMonth,
      income,
      teacherCost,
      otherExpenses,
      netProfit,
      margin,
    };
  }

  private async ensure(id: string) {
    const g = await this.prisma.group.findUnique({ where: { id } });
    if (!g) throw new NotFoundException('Группа не найдена');
  }
}
