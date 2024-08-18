import { Injectable } from '@nestjs/common';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { Problem } from 'src/Schemas/problem.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectModel(Problem.name) private problemModule: Model<Problem>,
  ) {}
  async create(createProblemDto: CreateProblemDto) {
    const problem = new this.problemModule(createProblemDto);
    await problem.save();
    return 'Problem saved successfully';
  }

  async findAll() {
    return await this.problemModule.find();
  }

  async findOne(id: ObjectId) {
    const problem = await this.problemModule.findById(id);
    if (!problem) {
      return -1;
    }
    return problem;
  }

  async update(id: number, updateProblemDto: UpdateProblemDto) {
    try {
      const problem = await this.problemModule.findByIdAndUpdate(
        id,
        updateProblemDto,
      );
      if (!problem) {
        throw new Error('Update Failed');
      }
      return problem;
    } catch (error) {
      return error;
    }
  }

  async remove(id: number) {
    try {
      const problem = await this.problemModule.findByIdAndDelete(id);
      return 'Problem deleted successfully';
    } catch (error) {
      return -1;
    }
  }
}
