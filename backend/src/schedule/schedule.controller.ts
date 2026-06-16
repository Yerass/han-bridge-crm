import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('schedule')
@ApiBearerAuth()
@Controller('schedule')
export class ScheduleController {
  constructor(private prisma: PrismaService) {}

  /** Недельная сетка: все слоты с привязкой к аудитории/этажу (группы + индивидуальные). */
  @Get()
  async week() {
    const [slots, classrooms] = await Promise.all([
      this.prisma.scheduleSlot.findMany({
        include: { group: { include: { teacher: true, classroom: true } }, classroom: true },
        orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }],
      }),
      this.prisma.classroom.findMany({ orderBy: { name: 'asc' } }),
    ]);

    return {
      classrooms,
      slots: slots.map((s) => {
        // floor = аудитория слота, иначе аудитория группы
        const room = s.classroom ?? s.group.classroom;
        return {
          id: s.id,
          groupId: s.groupId,
          groupName: s.group.name,
          studyType: s.group.studyType,
          teacherName: s.group.teacher?.fullName ?? null,
          classroomId: room?.id ?? null,
          classroomName: room?.name ?? null,
          weekday: s.weekday,
          startTime: s.startTime,
          endTime: s.endTime,
        };
      }),
    };
  }
}
