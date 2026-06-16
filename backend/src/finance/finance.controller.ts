import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, TransactionType } from '@prisma/client';
import { CreateTransactionDto, FinanceService, UpdateTransactionDto } from './finance.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('finance')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.DIRECTOR, Role.ACCOUNTANT, Role.ADMINISTRATOR)
@Controller('finance')
export class FinanceController {
  constructor(private readonly service: FinanceService) {}

  @Get('transactions')
  list(@Query('type') type?: TransactionType, @Query('year') year?: string, @Query('month') month?: string) {
    return this.service.listTransactions(type, year ? Number(year) : undefined, month ? Number(month) : undefined);
  }

  @Get('periods')
  periods() {
    return this.service.availablePeriods();
  }

  @Post('transactions')
  create(@Body() dto: CreateTransactionDto) {
    return this.service.createTransaction(dto);
  }

  @Patch('transactions/:id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.service.updateTransaction(id, dto);
  }

  @Delete('transactions/:id')
  remove(@Param('id') id: string) {
    return this.service.removeTransaction(id);
  }

  // Текущая операционная сводка (по группам) — для дашборда и блока «Текущая сводка»
  @Get('analytics')
  analytics() {
    return this.service.analytics();
  }

  // Историческая сводка за конкретный месяц (по фактическим оплатам/операциям)
  @Get('period')
  period(@Query('year') year?: string, @Query('month') month?: string) {
    return this.service.periodAnalytics(year ? Number(year) : undefined, month ? Number(month) : undefined);
  }

  // Owner Dashboard — только директор/владелец
  @Roles(Role.DIRECTOR)
  @Get('owner-overview')
  owner() {
    return this.service.ownerOverview();
  }
}
