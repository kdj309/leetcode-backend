import { Injectable } from '@nestjs/common';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { Problem } from 'src/Schemas/problem.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { getSuccessResponse } from 'src/utils';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectModel(Problem.name) private problemModule: Model<Problem>,
  ) {}
  async create(createProblemDto: CreateProblemDto) {
    try {
      const problem = new this.problemModule(createProblemDto);
      await problem.save();
      return getSuccessResponse(problem, 'Problem Created Succesfully');
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }

    return 'Problem saved successfully';
  }

  async findAll() {
    try {
      const problems = await this.problemModule
        .find()
        .select(
          '-sampleInput -sampleOutput -testCases -starterCode -systemCode',
        );
      return getSuccessResponse(problems, 'Fetched all problems');
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async findOne(id: ObjectId) {
    try {
      const problem = await this.problemModule.findById(id);
      if (!problem) {
        return null;
      }
      return getSuccessResponse(problem, 'Successfully fetched the problem');
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async update(id: ObjectId, updateProblemDto: UpdateProblemDto) {
    try {
      const problem = await this.problemModule.findByIdAndUpdate(
        id,
        updateProblemDto,
        {
          new: true,
        },
      );
      if (!problem) {
        throw new Error('Update Failed');
      }
      return getSuccessResponse(problem, 'Successfully updated the problem');
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async remove(id: ObjectId) {
    try {
      await this.problemModule.findByIdAndDelete(id);
      return getSuccessResponse(
        `Problem ${id}`,
        'Problem deleted successfully',
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }
}
