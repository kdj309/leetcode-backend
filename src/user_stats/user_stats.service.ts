import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bullmq';
import { Model, Types } from 'mongoose';
import { LeaderboardJobs } from 'src/interfaces/config.interface';
import { Submission } from 'src/Schemas/submission.schema';
import { UserStat } from 'src/Schemas/userstat.schema';
import { getSuccessResponse } from 'src/utils';
@Injectable()
export class UserStatsService {
  constructor(
    @InjectModel(UserStat.name) private userStatModule: Model<UserStat>,
    @InjectModel(Submission.name) private submissionModule: Model<Submission>,
    @InjectQueue('leaderboard') private leaderboardQueue: Queue
  ) { }
  async create(userId: Types.ObjectId) {
    const defaultStats = {
      userId,
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
      const existingStats = await this.userStatModule.findOne({ userId });

      if (existingStats) {
        return getSuccessResponse(existingStats, 'User Stats already exist');
      }
      const newStats = new this.userStatModule(defaultStats);
      const response = await newStats.save();

      return getSuccessResponse(response, 'User Stat Created Succesfully');
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`create UserStatsService ${error.message}`);
    }
  }

  async updateStats(
    userId: string | Types.ObjectId,
    difficulty: string,
    problemId: string,
  ) {
    const userObjectId =
      typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    const problemObjectId = new Types.ObjectId(problemId);
    try {
      const alreadySolved = await this.submissionModule.findOne({
        userId: userObjectId,
        problemId: problemObjectId,
        status: 'ACCEPTED',
      });
      if (alreadySolved) {
        return { message: 'Problem already solved, no points added' };
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
          userId: userObjectId,
          currentRank: 0,
          previousRank: 0,
          isOnline: false,
          lastSeen: new Date(),
        },
      };

      const response = await this.userStatModule.updateOne(
        { userId: userObjectId },
        updateData,
        { upsert: true },
      );
      await this.leaderboardQueue.add(
        LeaderboardJobs.RECALCULATE_ALL_RANKS,
        {
          triggeredBy: userId,
          reason: 'accepted_submission'
        },
        {
          priority: 5,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          jobId: `rank-calc-${Date.now()}`,
        }
      );
      console.log('Update Stats Response:', response);
      return response;
    } catch (error) {
      if (error instanceof Error)
        throw new Error(
          `Error In updateStats of UserStatsService ${error.message}`,
        );
    }
  }
  async findByUserId(userId: string) {
    try {
      const userStas = await this.userStatModule.findOne({ userId });
      return getSuccessResponse(userStas, 'User Statistics');
    } catch (error) {
      if (error instanceof Error)
        throw new Error(
          `error in findByUserId of UserStatsService ${error.message}`,
        );
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
      if (error instanceof Error) throw new Error(`error in updateOnlineStatus of UserStat module ${error.message}`);
    }
  }
  async getAllUsersSorted(includeZeroPoints = false) {
    const query = includeZeroPoints
      ? {}
      : { totalPoints: { $gt: 0 } };

    try {
      const sortedUserByPoints = await this.userStatModule
        .find(query)
        .populate('userId','username')
        .sort({ totalPoints: -1, lastUpdated: -1 })
        .lean();
      return sortedUserByPoints;
    } catch (error) {
      if (error instanceof Error) throw new Error(`error in getAllUsersSorted of userStat module ${error.message}`);
    }
  }
  async updateRanksBatch(users: UserStat[], startIndex: number) {
    try {
      const bulkOps = users.map((u, idx) => {
        const newRank = startIndex + idx + 1;

        return {
          updateOne: {
            //@ts-ignore
            filter: { _id: u._id },
            update: {
              $set: {
                previousRank: u.currentRank,
                currentRank: newRank,
                lastUpdated: new Date(),
              },
            },
          },
        };
      });
      if (bulkOps.length > 0) {
        await this.userStatModule.bulkWrite(bulkOps);
      }
    } catch (error) {
      if (error instanceof Error) throw new Error(`error in updateRanksBatch of userStat module ${error.message}`);
    }
  }
  async countRankedUsers(): Promise<number> {
    return await this.userStatModule.countDocuments({
      totalPoints: { $gt: 0 }
    });

  }
async getAllUsersSortedPaginated(page: number, limit: number) {
  const skip = (page - 1) * limit;
  
  const [users, totalCount] = await Promise.all([
    this.userStatModule
      .find({ totalPoints: { $gt: 0 } }) 
      .sort({ totalPoints: -1, lastUpdated: 1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username email')
      .lean()
      .exec(),
    
    this.userStatModule.countDocuments({ totalPoints: { $gt: 0 } })
  ]);
  
  return {
    users,
    pagination: {
      page,
      limit,
      totalUsers: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: skip + limit < totalCount,
      hasPrevPage: page > 1,
    },
  };
}
}
