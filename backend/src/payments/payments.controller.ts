import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentStatus, Role } from '@prisma/client';
import { CreatePaymentDto, PaymentsService } from './payments.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Get()
  findAll(@Query('status') status?: PaymentStatus) {
    return this.service.findAll(status);
  }

  @Get('overdue')
  overdue() {
    return this.service.overdue();
  }

  @Roles(Role.DIRECTOR, Role.ADMINISTRATOR, Role.ACCOUNTANT)
  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.service.create(dto);
  }

  @Roles(Role.DIRECTOR, Role.ACCOUNTANT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
