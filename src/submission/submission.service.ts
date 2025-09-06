import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Submission } from 'src/Schemas/submission.schema';
import { CreateSubmissionDto } from './dto/create-submissiondto';
import { getSuccessResponse } from 'src/utils';
import { SubmissionFilters } from 'src/interfaces/config.interface';
import { User } from 'src/Schemas/user.schema';
import batchwiseSubmission from 'src/services/batchwiseSubmission';
import { UpdateSubmissionDTO } from './dto/update-submissionstatusdto';
interface IBatchSubmissionDTO extends UpdateSubmissionDTO {
  submissionId: Types.ObjectId;
}
@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name) private submissionModule: Model<Submission>,
    @InjectModel(User.name) private userModule: Model<User>,
  ) {}

  async createSubmission(createSubmissionDTO: CreateSubmissionDto) {
    try {
      const submission = new this.submissionModule({
        ...createSubmissionDTO,
        status: 'PENDING',
      });
      submission.problemId
      const userUpdatedSubmissions = await this.userModule.findByIdAndUpdate(
        createSubmissionDTO.userId,
        { $push: { submissions: submission.id } },
      );
      await submission.save();
      return getSuccessResponse(submission, 'Problem submitted Succesfully');
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`[createSubmission] ${error.message}`);
    }
  }

  async createSubmissions(submissions: CreateSubmissionDto[]) {
    try {
      const submissionsWithStatus = await submissions.map((s) => ({
        ...s,
        status: 'PENDING',
        actual_output: '',
      }));
      const judgeSubmissions = submissions.map((s) => ({
        language_id: s.languageId,
        stdin: s.input,
        source_code: s.code,
        expected_output: s.expected_output,
      }));
      const judgeResponses = await batchwiseSubmission(judgeSubmissions);
      const submissionsData = judgeResponses.map((s, index) => ({
        ...submissionsWithStatus[index],
        submissionId: s.token,
      }));
      const dbResults = await this.submissionModule.insertMany(submissionsData);
      return getSuccessResponse(
        dbResults,
        'Successfully submitted batch submission',
      );
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`[createSubmissions] ${error.message}`);
    }
  }
  async findById(submissionId: Types.ObjectId,userId:Types.ObjectId) {
    try {
      const submission = await this.submissionModule.find({userId,_id:submissionId});
      if (!submission) {
        return null;
      }
      return getSuccessResponse(
        submission,
        'Successfully fetched the submission',
      );
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`[Submiision findById] ${error.message}`);
    }
  }

  async updateSubmission(
    submissionId: Types.ObjectId,
    userId:Types.ObjectId,
    updateBody: UpdateSubmissionDTO,
  ) {
    try {
      const updatedSubmission = await this.submissionModule.findByIdAndUpdate(
        submissionId,
        {
          $set: {
            status: updateBody.status,
            actual_output: updateBody?.actual_output,
            executionTime: updateBody?.executionTime,
            memoryUsed: updateBody?.memoryUsed,
          },
        },
        { new: true },
      );
      return updatedSubmission;
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`[updateSubmissionStatus] ${error.message}`);
    }
  }

  // Batch update method
  async updateSubmissionsBatch(batchUpdateBody: IBatchSubmissionDTO[]) {
    try {
      const bulkOperations = batchUpdateBody.map((update) => ({
        updateOne: {
          filter: { _id: update.submissionId },
          update: {
            $set: {
              ...(update.status && { status: update.status }),
              ...(update.actual_output && {
                actual_output: update.actual_output,
              }),
              ...(update.executionTime && {
                executionTime: update.executionTime,
              }),
              ...(update.memoryUsed && { memoryUsed: update.memoryUsed }),
            },
          },
        },
      }));

      const result = await this.submissionModule.bulkWrite(bulkOperations, {
        ordered: false,
      });

      return getSuccessResponse(
        {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
          upsertedCount: result.upsertedCount,
          errors: result.getWriteErrors() || [],
        },
        'successfully updated the sumbimissions',
      );
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`[updateSubmissionsBatch] ${error.message}`);
    }
  }

  async findSubmissionByProblemId(
    userId: Types.ObjectId,
    problemId: Types.ObjectId,
  ) {
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
      if (error instanceof Error)
        throw new Error(`[findSubmissionByProblemId] ${error.message}`);
    }
  }

  async findByUserId(userId: Types.ObjectId, filters?: SubmissionFilters) {
    try {
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
      return (
        result[0] || {
          submissions: [],
          pagination: {
            page,
            limit,
            totalSubmissions: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
          stats: null,
        }
      );
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`[findByUserId] ${error.message}`);
    }
  }
}
