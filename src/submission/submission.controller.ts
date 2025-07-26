import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
  ParseIntPipe
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionGuard } from 'src/sessiontoken/session.guard';
import { CreateSubmissionDto } from './dto/create-submissiondto';
import { getFailureResponse, getSuccessResponse } from 'src/utils';
import { ObjectId } from 'mongoose';
import { UpdateSubmissionDTO } from './dto/update-submissionstatusdto';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @UseGuards(AuthGuard, SessionGuard)
  @Post('create')
  async create(@Body() submissionDTO: CreateSubmissionDto) {
    try {
      const submission = await this.submissionService.createSubmission(
        submissionDTO,
      );
      return submission;
    } catch (error) {
      return getFailureResponse(error.message);
    }
  }

  @UseGuards(AuthGuard, SessionGuard)
  @Get(':id')
  async findById(@Param('id') id: ObjectId) {
    try {
      return await this.submissionService.findById(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @UseGuards(AuthGuard, SessionGuard)
  @Put(':id/status')
  async updateStatusById(
    @Param('id') id: ObjectId,
    @Body() updateStatusbody: UpdateSubmissionDTO,
  ) {
    try {
      const updatedSubmission =
        await this.submissionService.updateSubmissionStatus(
          id,
          updateStatusbody.status,
        );
      return getSuccessResponse(
        updatedSubmission,
        'Successfully updated the submission status',
      );
    } catch (error) {
      return getFailureResponse(error.message);
    }
  }

  @UseGuards(AuthGuard, SessionGuard)
  @Get(':userId/:problemId')
  async getProblemSubmissions(
    @Param('userId') userId: ObjectId,
    @Param('problemId') problemId: ObjectId,
  ) {
    try {
      return this.submissionService.findSubmissionByProblemId(
        userId,
        problemId,
      );
    } catch (error) {
      if (error instanceof Error) return getFailureResponse(error.message);
      return getFailureResponse('An unknown error occurred');
    }
  }
  @UseGuards(AuthGuard,SessionGuard)
  @Get(":userId")
  async getSubmissionsByUser( @Param('userId') userId: ObjectId,
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  @Query('status') status?: "ACCEPTED"|"WRONG_ANSWER",
  @Query('problemId') problemId?: string,
  @Query('languageId', new DefaultValuePipe(0)) languageId?: number,
  @Query('sortBy', new DefaultValuePipe('submittedAt')) sortBy?: 'status' | 'executionTime' | 'submittedAt',
  @Query('sortOrder', new DefaultValuePipe('desc')) sortOrder?: 'asc' | 'desc'){
    const filters = {
    page,
    limit,
    status,
    problemId,
    languageId: languageId || undefined,
    sortBy,
    sortOrder
  };

  const result = await this.submissionService.findByUserId(userId, filters);
  
  return {
    success: true,
    data: result.submissions,
    pagination: result.pagination,
    stats: result.stats
  };
  }
}
