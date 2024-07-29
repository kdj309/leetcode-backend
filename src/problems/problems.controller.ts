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

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @UseGuards(AuthGuard, RolesGaurd)
  @Post('createProblem/:userId')
  @Roles(Role.Admin)
  async create(@Body() createProblemDto: CreateProblemDto) {
    return await this.problemsService.create(createProblemDto);
  }

  @Get()
  async findAll() {
    return await this.problemsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const problem = await this.problemsService.findOne(+id);
    if (problem) {
      return problem;
    } else {
      throw new NotFoundException();
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGaurd)
  @Patch(':id/:userId')
  async update(
    @Param('id') id: string,
    @Body() updateProblemDto: UpdateProblemDto,
  ) {
    return await this.problemsService.update(+id, updateProblemDto);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGaurd)
  @Delete(':id/:userId')
  async remove(@Param('id') id: string) {
    return await this.problemsService.remove(+id);
  }
}
