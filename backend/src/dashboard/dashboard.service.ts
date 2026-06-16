import { Injectable } from '@nestjs/common';
import { LessonStatus, StudentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FinanceService } from '../finance/finance.service';
import { TeachersService } from '../teachers/teachers.service';
import { GroupsService } from '../groups/groups.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private finance: FinanceService,
    private teachers: TeachersService,
    private groups: GroupsService,
    private notifications: NotificationsService,
  ) {}

  async overview() {
    const now = new Date();
    const in7days = new Date(now.getTime() + 7 * 24 * 3600 * 1000);

    const [activeStudents, groupsCount, teachersCount, analytics, upcomingLessons, overdueRows] = await Promise.all([
      this.prisma.student.count({ where: { status: StudentStatus.ACTIVE } }),
      this.prisma.group.count({ where: { isActive: true } }),
      this.prisma.teacher.count(),
      this.finance.analytics(),
      this.prisma.lesson.findMany({
        where: { date: { gte: now, lte: in7days }, status: LessonStatus.SCHEDULED },
        include: { group: true, teacher: true, classroom: true },
        orderBy: { date: 'asc' },
        take: 10,
      }),
      this.prisma.payment.findMany({
        where: { OR: [{ status: 'OVERDUE' }, { status: 'PENDING', periodEnd: { lt: now } }] },
        select: { studentId: true },
      }),
    ]);

    // computed analytics (single source: the same services Groups/Teachers pages use)
    const [groupList, teacherList] = await Promise.all([this.groups.findAll(), this.teachers.findAll()]);

    const topGroup = [...groupList].sort((a, b) => b.netProfit - a.netProfit)[0] ?? null;
    const topTeacher = [...teacherList].sort((a, b) => b.profit - a.profit)[0] ?? null;
    const overdueStudents = new Set(overdueRows.map((p) => p.studentId)).size;

    // напоминания об оплате (следующая оплата в ближайшие 7 дней или просрочена)
    const paymentReminders = await this.notifications.paymentReminders(7);

    return {
      kpis: {
        activeStudents,
        groupsCount,
        teachersCount,
        monthlyRevenue: analytics.revenue,
        monthlyExpenses: analytics.expenses,
        netProfit: analytics.profit,
        margin: analytics.margin,
        overduePayments: overdueRows.length,
        overdueStudents,
        upcomingPayments: paymentReminders.length,
      },
      paymentReminders: paymentReminders.slice(0, 8),
      topGroup: topGroup ? { id: topGroup.id, name: topGroup.name, netProfit: topGroup.netProfit, margin: topGroup.margin } : null,
      topTeacher: topTeacher ? { id: topTeacher.id, fullName: topTeacher.fullName, profit: topTeacher.profit, salary: topTeacher.salary } : null,
      revenueByLanguage: analytics.revenueByLanguage,
      upcomingLessons,
      teacherLoad: teacherList.map((t) => ({
        id: t.id,
        fullName: t.fullName,
        groupsCount: t.groupsCount,
        studentsCount: t.studentsCount,
        hoursPerWeek: t.hoursPerWeek,
        hoursPerMonth: t.hoursPerMonth,
        salary: t.salary,
      })),
      finance: analytics,
    };
  }
}
