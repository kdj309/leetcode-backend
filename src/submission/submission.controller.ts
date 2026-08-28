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
  ParseIntPipe,
  Req,
  ParseArrayPipe,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionGuard } from 'src/sessiontoken/session.guard';
import { CreateSubmissionDto } from './dto/create-submissiondto';
import { getFailureResponse, getSuccessResponse } from 'src/utils';
import { ObjectId, Types } from 'mongoose';
import { UpdateSubmissionDTO } from './dto/update-submissionstatusdto';
import { Request as ExpressRequest } from 'express';

@Controller()
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @UseGuards(AuthGuard, SessionGuard)
  @Post('users/:userId/submissions')
  async create(
    @Param('userId') userId: Types.ObjectId,
    @Body() submissionDTO: CreateSubmissionDto,
  ) {
    try {
      const submission = await this.submissionService.createSubmission(
        submissionDTO,
      );

      return submission;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return getFailureResponse(error.message);
      }
    }
  }

  @UseGuards(AuthGuard, SessionGuard)
  @Post('users/:userId/submissions/batch')
  async multiSubmit(
    @Param('userId') userId: Types.ObjectId,
    @Body() submissionsData: { submissions: CreateSubmissionDto[] },
  ) {
    try {
      const submissionsResponses =
        await this.submissionService.createSubmissions(
          userId,
          submissionsData.submissions,
        );
      return submissionsResponses;
    } catch (error) {
      if (error instanceof Error) {
        return getFailureResponse(error.message);
      }
    }
  }

  @UseGuards(AuthGuard, SessionGuard)
  @Get('/users/:userId/submissions/:id')
  async findById(
    @Param('id') id: Types.ObjectId,
    @Param('userId') userId: Types.ObjectId,
  ) {
    try {
      return await this.submissionService.findById(id, userId);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @UseGuards(AuthGuard, SessionGuard)
  @Put('/users/:userId/submissions/:id')
  async updateStatusById(
    @Param('id') id: Types.ObjectId,
    @Param('userId') userId: Types.ObjectId,
    @Body() updateStatusbody: UpdateSubmissionDTO,
  ) {
    try {
      const updatedSubmission = await this.submissionService.updateSubmission(
        id,
        userId,
        updateStatusbody,
      );
      return getSuccessResponse(
        updatedSubmission,
        'Successfully updated the submission status',
      );
    } catch (error) {
      if (error instanceof Error) {
        return getFailureResponse(error.message);
      }
    }
  }

  @UseGuards(AuthGuard, SessionGuard)
  @Put('batchupdate/submission')
  async batchupdate(
    @Req() request: ExpressRequest & { user?: any },
    @Body(new ParseArrayPipe({ items: UpdateSubmissionDTO }))
    payload: UpdateSubmissionDTO[],
  ) {
    try {
      const batchupdateResponse =
        await this.submissionService.updateSubmissionsBatch(
          payload,
          request.user as ObjectId,
        );
      return batchupdateResponse;
    } catch (error) {
      if (error instanceof Error) return getFailureResponse(error.message);
      return getFailureResponse('An unknown error occurred');
    }
  }

  @UseGuards(AuthGuard, SessionGuard)
  @Get('users/:userId/problems/:problemId')
  async getProblemSubmissions(
    @Param('userId') userId: Types.ObjectId,
    @Param('problemId') problemId: Types.ObjectId,
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
  @UseGuards(AuthGuard, SessionGuard)
  @Get('users/:userId/submissions')
  async getSubmissionsByUser(
    @Param('userId') userId: Types.ObjectId,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: 'ACCEPTED' | 'WRONG_ANSWER',
    @Query('problemId') problemId?: string,
    @Query('languageId', new DefaultValuePipe(0)) languageId?: number,
    @Query('sortBy', new DefaultValuePipe('submittedAt'))
    sortBy?: 'status' | 'executionTime' | 'submittedAt',
    @Query('sortOrder', new DefaultValuePipe('desc'))
    sortOrder?: 'asc' | 'desc',
  ) {
    const filters = {
      page,
      limit,
      status,
      problemId,
      languageId: languageId || undefined,
      sortBy,
      sortOrder,
    };

    const result = await this.submissionService.findByUserId(userId, filters);

    return {
      success: true,
      data: result.submissions,
      pagination: result.pagination,
      stats: result.stats,
    };
  }
}
