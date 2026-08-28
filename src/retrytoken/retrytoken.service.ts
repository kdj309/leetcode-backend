import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  Retrytoken,
  RetrytokenDocument,
  RetrytokenModel,
} from 'src/Schemas/retrytoken.schema';
import { UserDocument } from 'src/Schemas/user.schema';

@Injectable()
export class RetrytokenService {
  constructor(
    @InjectModel(Retrytoken.name) private retryModule: RetrytokenModel,
  ) {}

  async createToken(user: UserDocument) {
    try {
      return this.retryModule.generateToken(user);
    } catch (error) {
      throw error;
    }
  }

  async findTokenByUserId(userId: mongoose.Schema.Types.ObjectId) {
    try {
      const token = await this.retryModule.findOne({ userId });
      return token;
    } catch (error) {
      throw error;
    }
  }

  async findToken(token: string) {
    try {
      const refreshtoken = await this.retryModule
        .findOne({ token })
        .populate('userId', '-hashedpassword');
      return refreshtoken;
    } catch (error) {
      throw error;
    }
  }
  async validateExpiry(token: RetrytokenDocument) {
    try {
      const refreshtoken = this.retryModule.verifyExpiry(token);
      return refreshtoken;
    } catch (error) {
      throw error;
    }
  }
  async findAndDelete(token: string) {
    try {
      const deletedToken = await this.retryModule.findOneAndDelete({ token });
      return deletedToken;
    } catch (error) {
      throw error;
    }
  }
}
