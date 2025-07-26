import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, PipelineStage, Types } from 'mongoose';
import { Submission } from 'src/Schemas/submission.schema';
import { CreateSubmissionDto } from './dto/create-submissiondto';
import { getSuccessResponse } from 'src/utils';
import { SubmissionFilters } from 'src/interfaces/config.interface';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name) private submissionModule: Model<Submission>,
  ) {}

  async createSubmission(createSubmissionDTO: CreateSubmissionDto) {
    try {
      const submission = new this.submissionModule({
        ...createSubmissionDTO,
        status: 'PENDING',
      });
      await submission.save();
      return getSuccessResponse(submission, 'Problem submitted Succesfully');
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }
  async findById(submissionId: ObjectId) {
    try {
      const submission = await this.submissionModule.findById(submissionId);
      if (!submission) {
        return null;
      }
      return getSuccessResponse(
        submission,
        'Successfully fetched the submission',
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }
  async updateSubmissionStatus(submissionId: ObjectId, status: string) {
    try {
      const updatedSubmission = await this.submissionModule.findByIdAndUpdate(
        submissionId,
        { $set: { status } },
        { new: true },
      );
      return updatedSubmission;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async findSubmissionByProblemId(userId: ObjectId, problemId: ObjectId) {
    try {
      const submissions = await this.submissionModule.find({
        userId,
        problemId,
      });
      if (!submissions.length) {
        return getSuccessResponse([], 'No Submissions Found');
      }
      return getSuccessResponse(
        submissions,
        'Successfully Fetched Submissions',
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async findByUserId(userId: ObjectId, filters?: SubmissionFilters) {
    const {
      page = 1,
      limit = 20,
      status,
      problemId,
      languageId,
      dateFrom,
      dateTo,
      sortBy = 'submittedAt',
      sortOrder = 'desc',
    } = filters || {};
    const matchConditions: any = { userId };
    if (status) matchConditions.status = status;
    if (problemId) matchConditions.problemId = new Types.ObjectId(problemId);
    if (languageId) matchConditions.languageId = languageId;

    if (dateFrom || dateTo) {
      matchConditions.submittedAt = {};
      if (dateFrom) matchConditions.submittedAt.$gte = dateFrom;
      if (dateTo) matchConditions.submittedAt.$lte = dateTo;
    }

    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const pipeline: PipelineStage[] = [
      { $match: matchConditions },

      {
        $facet: {
          data: [
            { $sort: { [sortBy]: sortDirection } },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: 'problems',
                localField: 'problemId',
                foreignField: '_id',
                as: 'problem',
              },
            },
            { $unwind: '$problem' },
            {
              $project: {
                _id: 1,
                problemId: 1,
                status: 1,
                languageId: 1,
                executionTime: 1,
                memoryUsed: 1,
                submittedAt: 1,
                testCasesPassed: 1,
                totalTestCases: 1,
                errorMessage: 1,
                problem: {
                  title: '$problem.title',
                  difficulty: '$problem.difficulty',
                },
              },
            },
          ],

          metadata: [{ $count: 'totalSubmissions' }],

          stats: [
            {
              $group: {
                _id: null,
                totalSubmissions: { $sum: 1 },
                acceptedSubmissions: {
                  $sum: { $cond: [{ $eq: ['$status', 'ACCEPTED'] }, 1, 0] },
                },
                avgExecutionTime: { $avg: '$executionTime' },
                languages: { $addToSet: '$languageId' },
              },
            },
          ],
        },
      },

      {
        $project: {
          submissions: '$data',
          pagination: {
            $let: {
              vars: {
                total: { $arrayElemAt: ['$metadata.totalSubmissions', 0] },
              },
              in: {
                page: page,
                limit: limit,
                totalSubmissions: '$$total',
                totalPages: { $ceil: { $divide: ['$$total', limit] } },
                hasNextPage: { $gt: ['$$total', page * limit] },
                hasPrevPage: { $gt: [page, 1] },
              },
            },
          },
          stats: { $arrayElemAt: ['$stats', 0] },
        },
      },
    ];
     const result = await this.submissionModule.aggregate(pipeline);
      return result[0] || { 
    submissions: [], 
    pagination: { 
      page, limit, totalSubmissions: 0, totalPages: 0, 
      hasNextPage: false, hasPrevPage: false 
    },
    stats: null 
  };
  }
}
