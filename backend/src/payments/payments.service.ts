import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

export class CreatePaymentDto {
  @IsString() studentId: string;
  @IsNumber() amount: number;
  @IsOptional() @IsEnum(PaymentMethod) method?: PaymentMethod;
  @IsOptional() @IsEnum(PaymentStatus) status?: PaymentStatus;
  @IsOptional() @IsDateString() paidAt?: string;
  @IsOptional() @IsDateString() periodStart?: string;
  @IsOptional() @IsDateString() periodEnd?: string;
  @IsOptional() @IsString() comment?: string;
}

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  findAll(status?: PaymentStatus) {
    return this.prisma.payment.findMany({
      where: status ? { status } : undefined,
      include: { student: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Просроченные оплаты: периодEnd в прошлом и не PAID, либо статус OVERDUE */
  overdue() {
    const now = new Date();
    return this.prisma.payment.findMany({
      where: {
        OR: [{ status: PaymentStatus.OVERDUE }, { status: PaymentStatus.PENDING, periodEnd: { lt: now } }],
      },
      include: { student: true },
      orderBy: { periodEnd: 'asc' },
    });
  }

  create(dto: CreatePaymentDto) {
    const data: Prisma.PaymentUncheckedCreateInput = {
      studentId: dto.studentId,
      amount: dto.amount,
      method: dto.method ?? PaymentMethod.KASPI,
      status: dto.status ?? PaymentStatus.PAID,
      paidAt: dto.paidAt ? new Date(dto.paidAt) : new Date(),
      periodStart: dto.periodStart ? new Date(dto.periodStart) : undefined,
      periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : undefined,
      comment: dto.comment,
    };
    return this.prisma.payment.create({ data });
  }

  async remove(id: string) {
    const p = await this.prisma.payment.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Оплата не найдена');
    return this.prisma.payment.delete({ where: { id } });
  }
}
