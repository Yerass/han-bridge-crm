import { Injectable, NotFoundException } from '@nestjs/common';
import { Language, LeadSource, LeadStage, StudentStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

export class CreateLeadDto {
  @IsString() fullName: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsEnum(Language) language?: Language;
  @IsOptional() @IsEnum(LeadStage) stage?: LeadStage;
  @IsOptional() @IsEnum(LeadSource) source?: LeadSource;
  @IsOptional() @IsNumber() acquisitionCost?: number;
  @IsOptional() @IsString() managerId?: string;
  @IsOptional() @IsString() comment?: string;
}

export class UpdateLeadDto extends CreateLeadDto {
  @IsOptional() @IsString() declare fullName: string;
}

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  /** Возвращает воронку, сгруппированную по этапам (для kanban). */
  async funnel() {
    const leads = await this.prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
    const stages = Object.values(LeadStage);
    const board = stages.map((stage) => ({
      stage,
      leads: leads.filter((l) => l.stage === stage),
      count: leads.filter((l) => l.stage === stage).length,
    }));

    // конверсия по этапам
    const total = leads.length || 1;
    const converted = leads.filter((l) => l.stage === LeadStage.ACTIVE || l.stage === LeadStage.GRADUATE).length;
    return { board, total: leads.length, conversionRate: +((converted / total) * 100).toFixed(1) };
  }

  create(dto: CreateLeadDto) {
    return this.prisma.lead.create({ data: dto });
  }

  async update(id: string, dto: UpdateLeadDto) {
    await this.ensure(id);
    return this.prisma.lead.update({ where: { id }, data: dto });
  }

  /** Конвертация лида в активного студента. */
  async convert(id: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Лид не найден');

    const student = await this.prisma.student.create({
      data: {
        fullName: lead.fullName,
        phone: lead.phone,
        email: lead.email,
        language: lead.language,
        status: StudentStatus.ACTIVE,
        startDate: new Date(),
      },
    });
    await this.prisma.lead.update({ where: { id }, data: { stage: LeadStage.ACTIVE, studentId: student.id } });
    return student;
  }

  async remove(id: string) {
    await this.ensure(id);
    return this.prisma.lead.delete({ where: { id } });
  }

  private async ensure(id: string) {
    const l = await this.prisma.lead.findUnique({ where: { id } });
    if (!l) throw new NotFoundException('Лид не найден');
  }
}
