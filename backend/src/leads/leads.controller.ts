import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CreateLeadDto, LeadsService, UpdateLeadDto } from './leads.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('leads')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.DIRECTOR, Role.ADMINISTRATOR, Role.SALES_MANAGER)
@Controller('leads')
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  @Get()
  funnel() {
    return this.service.funnel();
  }

  @Post()
  create(@Body() dto: CreateLeadDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/convert')
  convert(@Param('id') id: string) {
    return this.service.convert(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
