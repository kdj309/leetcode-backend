import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Submission } from 'src/Schemas/submission.schema';
import { UserStat } from 'src/Schemas/userstat.schema';
import { getSuccessResponse } from 'src/utils';

@Injectable()
export class UserStatsService {
  constructor(
    @InjectModel(UserStat.name) private userStatModule: Model<UserStat>,
    @InjectModel(Submission.name) private submissionModule:Model<Submission>
  ) {}
  async create(userId: string) {
    const defaultStats = {
      userId: new Types.ObjectId(userId),
      totalPoints: 0,
      easyProblems: 0,
      mediumProblems: 0,
      hardProblems: 0,
      totalSolved: 0,
      currentRank: 0,
      previousRank: 0,
      isOnline: false,
      lastSeen: new Date(),
      lastUpdated: new Date(),
    };
    try {
      const response = await this.userStatModule.updateOne(
        { userId: new Types.ObjectId(userId) },
        { $setOnInsert: defaultStats },
        { upsert: true },
      );
      return getSuccessResponse(response, 'User Stat Created Succesfully');
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async updateStats(userId: string, difficulty: string, problemId: string) {
     const alreadySolved = await this.submissionModule.findOne({
    userId: new Types.ObjectId(userId),
    problemId: new Types.ObjectId(problemId), 
    status: 'ACCEPTED'
  });
  
  if (alreadySolved) {
    return { message: "Problem already solved, no points added" };
  }
  
  const points = { easy: 1, medium: 3, hard: 5 }[difficulty];
    const updateData = {
      $inc: {
        totalPoints: points,
        [`${difficulty}Problems`]: 1,
        totalSolved: 1,
      },
      $set: {
        lastUpdated: new Date(),
      },
      $setOnInsert: {
        userId: new Types.ObjectId(userId),
        currentRank: 0,
        previousRank: 0,
        isOnline: false,
        lastSeen: new Date(),
      },
    };

    return await this.userStatModule.updateOne(
      { userId: new Types.ObjectId(userId) },
      updateData,
      { upsert: true },
    );
  }
  async findByUserId(userId: string) {
    try {
      const userStas = await this.userStatModule.findOne({ userId });
      return getSuccessResponse(userStas, 'User Statistics');
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }
  async updateOnlineStatus(userId: string, isOnline: boolean) {
    try {
      const updateUserStat = await this.userStatModule.findOneAndUpdate(
        { userId },
        { $set: { isOnline } },
        { new: true },
      );
      if (!updateUserStat) {
        throw new Error('Update Failed');
      }
      return getSuccessResponse(
        updateUserStat,
        'Successfully updated the userstat',
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }
  async getAllForLeaderboard(page: number, limit: number) { 

   }
}
