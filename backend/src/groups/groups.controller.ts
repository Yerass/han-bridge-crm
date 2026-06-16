import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { GroupsService } from './groups.service';
import { CreateGroupDto, EnrollDto, UpdateGroupDto } from './dto/group.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('groups')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly service: GroupsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles(Role.DIRECTOR, Role.ADMINISTRATOR)
  @Post()
  create(@Body() dto: CreateGroupDto) {
    return this.service.create(dto);
  }

  @Roles(Role.DIRECTOR, Role.ADMINISTRATOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.DIRECTOR, Role.ADMINISTRATOR)
  @Post(':id/enroll')
  enroll(@Param('id') id: string, @Body() dto: EnrollDto) {
    return this.service.enroll(id, dto);
  }

  @Roles(Role.DIRECTOR, Role.ADMINISTRATOR)
  @Delete(':id/students/:studentId')
  unenroll(@Param('id') id: string, @Param('studentId') studentId: string) {
    return this.service.unenroll(id, studentId);
  }

  @Roles(Role.DIRECTOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
