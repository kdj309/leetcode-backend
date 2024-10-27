import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { SessionToken } from 'src/Schemas/session.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SessiontokenService {
  constructor(
    @InjectModel(SessionToken.name) private sessionModel: Model<SessionToken>,
  ) {}

  async createToken(userId: mongoose.Types.ObjectId) {
    try {
      const token = new this.sessionModel({
        userId,
        token: uuidv4(),
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
      const savedtoken = await token.save();
      return savedtoken.token;
    } catch (error) {
      return error;
    }
  }
  async validateSession(token: string): Promise<SessionToken | null> {
    const response = await this.sessionModel
      .findOne({ token, expiryDate: { $gt: new Date().toISOString() } })
      .populate('userId','-hashedpassword');
    return response;
  }

  async invalidateSession(token: string): Promise<void> {
    await this.sessionModel.deleteOne({ token });
  }
}
