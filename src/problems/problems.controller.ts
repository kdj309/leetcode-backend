import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGaurd } from 'src/roles/roles.guard';
import { ObjectId } from 'mongoose';
import { getFailureResponse } from 'src/utils';
import { SessionGuard } from 'src/sessiontoken/session.guard';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @UseGuards(AuthGuard, RolesGaurd, SessionGuard)
  @Post('createProblem/:userId')
  @Roles(Role.Admin)
  async create(@Body() createProblemDto: CreateProblemDto) {
    try {
      return await this.problemsService.create(createProblemDto);
    } catch (error) {
      if (error instanceof Error) return getFailureResponse(error.message);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.problemsService.findAll();
    } catch (error) {
      if (error instanceof Error) return getFailureResponse(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: ObjectId) {
    try {
      const problem = await this.problemsService.findOne(id);
      if (problem == -1) {
        throw new NotFoundException();
      }
      return problem;
    } catch (error) {
      if (error instanceof Error) return getFailureResponse(error.message);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGaurd, SessionGuard)
  @Patch(':id/:userId')
  async update(
    @Param('id') id: ObjectId,
    @Body() updateProblemDto: UpdateProblemDto,
  ) {
    try {
      return await this.problemsService.update(id, updateProblemDto);
    } catch (error) {
      if (error instanceof Error) return getFailureResponse(error.message);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGaurd, SessionGuard)
  @Delete(':id/:userId')
  async remove(@Param('id') id: ObjectId) {
    try {
      return await this.problemsService.remove(id);
    } catch (error) {
      if (error instanceof Error) return getFailureResponse(error.message);
    }
  }
}
