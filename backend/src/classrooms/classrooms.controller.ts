import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

class ClassroomDto {
  @IsString() name: string;
  @IsOptional() @IsInt() capacity?: number;
  @IsOptional() @IsString() equipment?: string;
}

@ApiTags('classrooms')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('classrooms')
export class ClassroomsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  findAll() {
    return this.prisma.classroom.findMany({ orderBy: { name: 'asc' } });
  }

  @Roles(Role.DIRECTOR, Role.ADMINISTRATOR)
  @Post()
  create(@Body() dto: ClassroomDto) {
    return this.prisma.classroom.create({ data: dto });
  }

  @Roles(Role.DIRECTOR, Role.ADMINISTRATOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: ClassroomDto) {
    return this.prisma.classroom.update({ where: { id }, data: dto });
  }

  @Roles(Role.DIRECTOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prisma.classroom.delete({ where: { id } });
  }
}
