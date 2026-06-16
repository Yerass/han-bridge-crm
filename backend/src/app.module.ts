import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { GroupsModule } from './groups/groups.module';
import { PaymentsModule } from './payments/payments.module';
import { FinanceModule } from './finance/finance.module';
import { AttendanceModule } from './attendance/attendance.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LeadsModule } from './leads/leads.module';
import { AuditModule } from './audit/audit.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { MaintenanceModule } from './maintenance/maintenance.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    GroupsModule,
    PaymentsModule,
    FinanceModule,
    AttendanceModule,
    DashboardModule,
    LeadsModule,
    AuditModule,
    ClassroomsModule,
    MaintenanceModule,
  ],
  providers: [
    // Every route requires a valid JWT unless marked @Public()
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Audit log for every mutating request
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class AppModule {}
