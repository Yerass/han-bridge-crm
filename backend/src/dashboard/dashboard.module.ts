import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { FinanceModule } from '../finance/finance.module';
import { TeachersModule } from '../teachers/teachers.module';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [FinanceModule, TeachersModule, GroupsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
