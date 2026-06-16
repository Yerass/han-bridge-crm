import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationStatus, NotificationType, StudentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const PACKAGE_SIZE = 12; // занятий в пакете после оплаты

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
// JS: 0=Sun..6=Sat → наши weekday: 1=Mon..7=Sun
function jsWeekday(d: Date) {
  return ((d.getDay() + 6) % 7) + 1;
}
function atTime(day: Date, hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  const dt = new Date(day);
  dt.setHours(h, m, 0, 0);
  return dt;
}

type Slot = { weekday: number; startTime: string };

/** Сколько занятий по недельной сетке уже прошло с даты старта пакета до now. */
function countPassedLessons(slots: Slot[], anchor: Date, now: Date): number {
  let count = 0;
  const day = startOfDay(anchor);
  const end = startOfDay(now);
  while (day <= end) {
    const wd = jsWeekday(day);
    for (const s of slots) {
      if (s.weekday === wd) {
        const dt = atTime(day, s.startTime);
        if (dt >= anchor && dt <= now) count++;
      }
    }
    if (count >= PACKAGE_SIZE) break; // дальше остаток всё равно 0
    day.setDate(day.getDate() + 1);
  }
  return count;
}

/** Ближайшее будущее занятие по недельной сетке. */
function nextLesson(slots: Slot[], now: Date): Date | null {
  for (let i = 0; i < 21; i++) {
    const day = new Date(now);
    day.setDate(day.getDate() + i);
    const wd = jsWeekday(day);
    const todays = slots
      .filter((s) => s.weekday === wd)
      .map((s) => atTime(day, s.startTime))
      .filter((dt) => dt > now)
      .sort((a, b) => a.getTime() - b.getTime());
    if (todays.length) return todays[0];
  }
  return null;
}

export interface PackageReminder {
  studentId: string;
  fullName: string;
  phone: string | null;
  groupName: string | null;
  used: number;
  remaining: number;
  nextLesson: Date | null;
  statusLabel: string;
  message: string | null;
  amount: number;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Пакет 12 занятий: остаток = 12 − прошедшие по недельной сетке группы занятия
   * (с даты последней оплаты, иначе с даты старта студента). Без календаря и отметок.
   * Возвращает студентов, по которым нужно уведомление (осталось ≤ 1).
   */
  async paymentReminders(): Promise<PackageReminder[]> {
    const students = await this.prisma.student.findMany({
      where: { status: StudentStatus.ACTIVE },
      include: {
        payments: { orderBy: { paidAt: 'desc' } },
        enrollments: { where: { isActive: true }, include: { group: { include: { scheduleSlots: true } } } },
      },
    });

    const now = new Date();
    const out: PackageReminder[] = [];

    for (const s of students) {
      const slots: Slot[] = s.enrollments.flatMap((e) =>
        (e.group?.scheduleSlots ?? []).map((sl) => ({ weekday: sl.weekday, startTime: sl.startTime })),
      );
      if (slots.length === 0) continue; // нет расписания — пакет не считаем

      const lastPaidAt = s.payments.find((p) => p.paidAt)?.paidAt;
      const anchor = startOfDay(lastPaidAt ?? s.startDate ?? s.createdAt);

      const used = countPassedLessons(slots, anchor, now);
      const remaining = Math.max(0, PACKAGE_SIZE - used);

      if (remaining > 1) continue; // уведомление только при 1 и 0

      const statusLabel = remaining === 0 ? 'Ожидает оплату' : 'Последнее занятие';
      const message =
        remaining === 0 ? 'Требуется оплата следующего пакета.' : 'У студента осталось последнее занятие.';
      const amount = s.payments[0]
        ? Number(s.payments[0].amount)
        : s.enrollments[0]?.group
          ? Number(s.enrollments[0].group.monthlyPrice)
          : 0;

      out.push({
        studentId: s.id,
        fullName: s.fullName,
        phone: s.phone ?? null,
        groupName: s.enrollments[0]?.group?.name ?? null,
        used,
        remaining,
        nextLesson: nextLesson(slots, now),
        statusLabel,
        message,
        amount,
      });
    }

    out.sort((a, b) => a.remaining - b.remaining);
    return out;
  }

  list() {
    return this.prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async remind(studentId: string) {
    const s = await this.prisma.student.findUnique({ where: { id: studentId } });
    if (!s) throw new NotFoundException('Студент не найден');
    return this.prisma.notification.create({
      data: {
        type: NotificationType.PAYMENT_REMINDER,
        status: NotificationStatus.SENT,
        channel: 'manual',
        recipient: s.phone,
        message: `Напоминание об оплате пакета отправлено: ${s.fullName}`,
        sentAt: new Date(),
        payload: { studentId },
      },
    });
  }
}
