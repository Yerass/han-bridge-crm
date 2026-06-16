import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { NotificationsService } from './notifications.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.DIRECTOR, Role.ADMINISTRATOR, Role.ACCOUNTANT)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get('payment-reminders')
  reminders(@Query('days') days?: string) {
    return this.service.paymentReminders(days ? Number(days) : 7);
  }

  @Get()
  list() {
    return this.service.list();
  }

  @Post('remind/:studentId')
  remind(@Param('studentId') studentId: string) {
    return this.service.remind(studentId);
  }
}
