import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationStatus, NotificationType, StudentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Следующая ежемесячная дата оплаты от якоря (дата старта): первый платёж через месяц, далее ежемесячно. */
function computeNextDue(anchor: Date, today: Date): Date {
  const due = new Date(anchor);
  due.setMonth(due.getMonth() + 1);
  while (startOfDay(due) < today) due.setMonth(due.getMonth() + 1);
  return due;
}

export interface PaymentReminder {
  studentId: string;
  fullName: string;
  phone: string | null;
  groupName: string | null;
  nextDue: Date;
  daysLeft: number;
  amount: number;
  overdue: boolean;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  /** Активные студенты, у кого следующая оплата в пределах `days` дней (или просрочена). */
  async paymentReminders(days = 7): Promise<PaymentReminder[]> {
    const students = await this.prisma.student.findMany({
      where: { status: StudentStatus.ACTIVE },
      include: {
        payments: { orderBy: { periodEnd: 'desc' } },
        enrollments: { where: { isActive: true }, include: { group: true } },
      },
    });

    const today = startOfDay(new Date());
    const reminders: PaymentReminder[] = [];

    for (const s of students) {
      const lastWithPeriod = s.payments.find((p) => p.periodEnd);
      const nextDue = lastWithPeriod?.periodEnd
        ? new Date(lastWithPeriod.periodEnd)
        : computeNextDue(s.startDate ?? s.createdAt, today);

      const daysLeft = Math.ceil((startOfDay(nextDue).getTime() - today.getTime()) / 86400000);
      if (daysLeft <= days) {
        const amount = s.payments[0]
          ? Number(s.payments[0].amount)
          : s.enrollments[0]?.group
            ? Number(s.enrollments[0].group.monthlyPrice)
            : 0;
        reminders.push({
          studentId: s.id,
          fullName: s.fullName,
          phone: s.phone ?? null,
          groupName: s.enrollments[0]?.group?.name ?? null,
          nextDue,
          daysLeft,
          amount,
          overdue: daysLeft < 0,
        });
      }
    }

    reminders.sort((a, b) => a.daysLeft - b.daysLeft);
    return reminders;
  }

  list() {
    return this.prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  }

  /** Зафиксировать, что ученику отправлено напоминание об оплате. */
  async remind(studentId: string) {
    const s = await this.prisma.student.findUnique({ where: { id: studentId } });
    if (!s) throw new NotFoundException('Студент не найден');
    return this.prisma.notification.create({
      data: {
        type: NotificationType.PAYMENT_REMINDER,
        status: NotificationStatus.SENT,
        channel: 'manual',
        recipient: s.phone,
        message: `Напоминание об оплате отправлено: ${s.fullName}`,
        sentAt: new Date(),
        payload: { studentId },
      },
    });
  }
}
