import { Module } from '@nestjs/common';
import { ClassroomsController } from './classrooms.controller';

@Module({
  controllers: [ClassroomsController],
})
export class ClassroomsModule {}
