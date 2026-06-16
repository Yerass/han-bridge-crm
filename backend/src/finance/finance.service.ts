import { Injectable } from '@nestjs/common';
import { FinanceCategory, PaymentStatus, Prisma, TransactionType } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
import { GroupsService } from '../groups/groups.service';

export class CreateTransactionDto {
  @IsEnum(TransactionType) type: TransactionType;
  @IsEnum(FinanceCategory) category: FinanceCategory;
  @IsNumber() amount: number;
  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsString() comment?: string;
  @IsOptional() @IsString() groupId?: string;
  @IsOptional() @IsString() teacherId?: string;
  @IsOptional() @IsString() campaignId?: string;
  @IsOptional() @IsString() documentUrl?: string;
}

export class UpdateTransactionDto {
  @IsOptional() @IsEnum(TransactionType) type?: TransactionType;
  @IsOptional() @IsEnum(FinanceCategory) category?: FinanceCategory;
  @IsOptional() @IsNumber() amount?: number;
  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsString() comment?: string;
}

function monthRange(year?: number, month?: number) {
  const now = new Date();
  const y = year && year > 2000 ? year : now.getFullYear();
  const m = month && month >= 1 && month <= 12 ? month : now.getMonth() + 1;
  return { from: new Date(y, m - 1, 1), to: new Date(y, m, 1), year: y, month: m };
}

function startOf(period: 'day' | 'week' | 'month' | 'year', ref = new Date()): Date {
  const d = new Date(ref);
  d.setHours(0, 0, 0, 0);
  if (period === 'day') return d;
  if (period === 'week') {
    const day = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - day);
    return d;
  }
  if (period === 'month') return new Date(d.getFullYear(), d.getMonth(), 1);
  return new Date(d.getFullYear(), 0, 1);
}

@Injectable()
export class FinanceService {
  constructor(
    private prisma: PrismaService,
    private groups: GroupsService,
  ) {}

  listTransactions(type?: TransactionType, year?: number, month?: number) {
    const where: Prisma.TransactionWhereInput = {};
    if (type) where.type = type;
    if (year && month) {
      const { from, to } = monthRange(year, month);
      where.date = { gte: from, lt: to };
    }
    return this.prisma.transaction.findMany({ where, orderBy: { date: 'desc' } });
  }

  createTransaction(dto: CreateTransactionDto) {
    const data: Prisma.TransactionUncheckedCreateInput = {
      type: dto.type,
      category: dto.category,
      amount: dto.amount,
      comment: dto.comment,
      groupId: dto.groupId,
      teacherId: dto.teacherId,
      campaignId: dto.campaignId,
      documentUrl: dto.documentUrl,
      date: dto.date ? new Date(dto.date) : new Date(),
    };
    return this.prisma.transaction.create({ data });
  }

  updateTransaction(id: string, dto: UpdateTransactionDto) {
    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...(dto.type !== undefined ? { type: dto.type } : {}),
        ...(dto.category !== undefined ? { category: dto.category } : {}),
        ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
        ...(dto.comment !== undefined ? { comment: dto.comment } : {}),
        ...(dto.date !== undefined ? { date: new Date(dto.date) } : {}),
      },
    });
  }

  removeTransaction(id: string) {
    return this.prisma.transaction.delete({ where: { id } });
  }

  /**
   * ТЕКУЩАЯ СВОДКА (операционная) — отражает то, что построено в системе:
   *   Доход  = Σ доход активных групп (цена × студенты)
   *   Расход = Σ зарплат преподавателей (часы × ставка) + расходные операции текущего месяца
   * Используется на Дашборде и в блоке «Текущая сводка» Финансов — реагирует на группы.
   */
  async analytics() {
    const groups = (await this.groups.findAll()).filter((g) => g.isActive);
    const income = groups.reduce((s, g) => s + g.income, 0);
    const teacherSalaries = groups.reduce((s, g) => s + g.teacherCost, 0);

    const { from, to } = monthRange();
    const expenseAgg = await this.prisma.transaction.groupBy({
      by: ['category'],
      where: { type: TransactionType.EXPENSE, date: { gte: from, lt: to } },
      _sum: { amount: true },
    });
    const otherExpenses = expenseAgg.reduce((s, r) => s + Number(r._sum.amount ?? 0), 0);

    const expenses = teacherSalaries + otherExpenses;
    const profit = income - expenses;
    const margin = income > 0 ? +((profit / income) * 100).toFixed(1) : 0;

    const revenueByLanguage = groups.reduce(
      (acc, g) => {
        acc[g.language] = (acc[g.language] ?? 0) + g.income;
        return acc;
      },
      {} as Record<string, number>,
    );
    const expensesByCategory = expenseAgg.map((r) => ({ category: r.category as string, amount: Number(r._sum.amount ?? 0) }));
    if (teacherSalaries > 0) expensesByCategory.push({ category: 'TEACHER_SALARY', amount: teacherSalaries });

    return { revenue: income, teacherSalaries, otherExpenses, expenses, profit, margin, revenueByLanguage, expensesByCategory };
  }

  /**
   * ИСТОРИЯ за конкретный месяц (фактическая, по датам):
   *   Доход  = оплаты (paidAt в месяце) + INCOME-операции
   *   Расход = EXPENSE-операции в месяце
   */
  async periodAnalytics(year?: number, month?: number) {
    const { from, to, year: y, month: m } = monthRange(year, month);
    const range = { gte: from, lt: to };
    const [payments, incomeTx, expenseAgg] = await Promise.all([
      this.prisma.payment.findMany({ where: { status: PaymentStatus.PAID, paidAt: range }, include: { student: true } }),
      this.prisma.transaction.aggregate({ where: { type: TransactionType.INCOME, date: range }, _sum: { amount: true } }),
      this.prisma.transaction.groupBy({ by: ['category'], where: { type: TransactionType.EXPENSE, date: range }, _sum: { amount: true } }),
    ]);
    const paymentsSum = payments.reduce((s, p) => s + Number(p.amount), 0);
    const revenue = paymentsSum + Number(incomeTx._sum.amount ?? 0);
    const expenses = expenseAgg.reduce((s, r) => s + Number(r._sum.amount ?? 0), 0);
    const profit = revenue - expenses;
    const margin = revenue > 0 ? +((profit / revenue) * 100).toFixed(1) : 0;
    const revenueByLanguage = payments.reduce(
      (acc, p) => {
        acc[p.student.language] = (acc[p.student.language] ?? 0) + Number(p.amount);
        return acc;
      },
      {} as Record<string, number>,
    );
    const expensesByCategory = expenseAgg.map((r) => ({ category: r.category as string, amount: Number(r._sum.amount ?? 0) }));
    return { year: y, month: m, revenue, expenses, profit, margin, revenueByLanguage, expensesByCategory };
  }

  async availablePeriods() {
    const [payments, txs] = await Promise.all([
      this.prisma.payment.findMany({ where: { status: PaymentStatus.PAID, paidAt: { not: null } }, select: { paidAt: true } }),
      this.prisma.transaction.findMany({ select: { date: true } }),
    ]);
    const set = new Set<string>();
    const add = (d: Date | null) => {
      if (d) set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    };
    payments.forEach((p) => add(p.paidAt));
    txs.forEach((t) => add(t.date));
    const now = new Date();
    set.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
    return [...set].sort().reverse();
  }

  private async sums(from: Date, to?: Date) {
    const range = { gte: from, ...(to ? { lt: to } : {}) };
    const [pay, inc, exp] = await Promise.all([
      this.prisma.payment.aggregate({ where: { status: PaymentStatus.PAID, paidAt: range }, _sum: { amount: true } }),
      this.prisma.transaction.aggregate({ where: { type: TransactionType.INCOME, date: range }, _sum: { amount: true } }),
      this.prisma.transaction.aggregate({ where: { type: TransactionType.EXPENSE, date: range }, _sum: { amount: true } }),
    ]);
    const revenue = Number(pay._sum.amount ?? 0) + Number(inc._sum.amount ?? 0);
    const expenses = Number(exp._sum.amount ?? 0);
    const profit = revenue - expenses;
    return { revenue, expenses, profit, margin: revenue > 0 ? +((profit / revenue) * 100).toFixed(1) : 0 };
  }

  async ownerOverview() {
    const [day, week, month, year] = await Promise.all([
      this.sums(startOf('day')),
      this.sums(startOf('week')),
      this.sums(startOf('month')),
      this.sums(startOf('year')),
    ]);
    return { day, week, month, year };
  }
}
