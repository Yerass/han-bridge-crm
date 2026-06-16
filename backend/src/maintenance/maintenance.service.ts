import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { wipeData, seedFactoryData } from './factory-data';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  /** Сброс до заводских: удалить все данные и восстановить исходный демо-набор. */
  async factoryReset() {
    await wipeData(this.prisma, { classrooms: true });
    await seedFactoryData(this.prisma);
    return { ok: true, action: 'factory-reset', message: 'Восстановлены заводские демо-данные' };
  }

  /** Очистить всё: пустой старт (сохраняются логины и аудитории). */
  async clearAll() {
    await wipeData(this.prisma, { classrooms: false });
    return { ok: true, action: 'clear', message: 'Все данные очищены' };
  }
}
