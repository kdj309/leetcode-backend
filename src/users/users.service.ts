import { Injectable } from '@nestjs/common';
import { createUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/Schemas/user.schema';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { getSuccessResponse } from 'src/utils';
import { submission } from 'src/interfaces/config.interface';
import { SessiontokenService } from 'src/sessiontoken/sessiontoken.service';
import { RetrytokenService } from 'src/retrytoken/retrytoken.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private sessionService: SessiontokenService,
    private retryTokenService: RetrytokenService,
  ) {}

  async getAllUsers() {
    return await this.userModel.find();
  }

  async getUser(id: Types.ObjectId) {
    const user = await this.userModel.findById(
      id,
      '-_password -hashedpassword',
    );
    if (user) {
      return getSuccessResponse(user, 'Successfully fetched the problem');
    } else {
      throw new Error('User Not Found');
    }
  }
  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      return user;
    } else {
      throw new Error('User Not Found');
    }
  }

  async createUser(userData: createUser) {
    try {
      const user = await this.userModel.findOne({ email: userData.email });
      if (!user) {
        const newuser = new this.userModel({ ...userData, submissions: [] });
        const payload = { sub: newuser.id, username: newuser.username };
        await newuser.save();
        const sessiontoken = await this.sessionService.createToken(newuser._id);
        const refreshtoken = await this.retryTokenService.createToken(
          //@ts-ignore
          newuser._id,
        );
        return getSuccessResponse(
          {
            access_token: await this.jwtService.signAsync(payload),
            id: newuser._id,
            sessiontoken,
            refreshtoken,
          },
          'User Created Successfully',
        );
      } else {
        return getSuccessResponse(null, 'User Already Exists');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`error in createUser of UserService ${error.message}`);
      }
    }
  }

  async updateUser(id: number, updateUser: UpdateUserDto) {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        id,
        { ...updateUser },
        { new: true },
      );
      if (user) {
        return getSuccessResponse(user, 'User updated Successfully');
      } else {
        throw new Error('User Not Found');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`error in updateUser of UserService ${error.message}`);
      }
    }
  }
  async addSubmission(id: number, submission: submission) {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(
          id,
          {
            $push: {
              submissions: {
                ...submission,
                problemId: new Types.ObjectId(submission.problemId),
              },
            },
          },
          { new: true },
        )
        .select('submissions');
      if (user) {
        return getSuccessResponse(user, 'User updated Successfully');
      } else {
        throw new Error('Failed To Update Submission');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `error in addSubmission of UserService ${error.message}`,
        );
      }
    }
  }

  async deleteUser(id: number) {
    const userIdx = await this.userModel.findByIdAndDelete(id);
    if (userIdx) {
      return 'User deleted successfully';
    } else {
      throw new Error('User Not Found');
    }
  }
}
