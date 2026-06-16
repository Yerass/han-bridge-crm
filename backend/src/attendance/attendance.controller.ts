import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AttendanceService, MarkAttendanceDto } from './attendance.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Roles(Role.TEACHER, Role.DIRECTOR, Role.ADMINISTRATOR)
  @Post('mark')
  mark(@Body() dto: MarkAttendanceDto) {
    return this.service.mark(dto);
  }

  @Get('lesson/:lessonId')
  byLesson(@Param('lessonId') lessonId: string) {
    return this.service.byLesson(lessonId);
  }

  @Get('report/:groupId')
  report(@Param('groupId') groupId: string) {
    return this.service.report(groupId);
  }
}
