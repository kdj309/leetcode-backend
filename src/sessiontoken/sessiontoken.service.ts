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
        expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 7 days
      });
      const savedtoken = await token.save();
      return savedtoken.token;
    } catch (error) {
      return error;
    }
  }
  async validateSession(token: string): Promise<SessionToken | null> {
      // ✅ Add these critical logs
  console.log('=== SESSION DEBUG ===');
  console.log('Token received (raw):', token);
  console.log('Token length:', token?.length);
  console.log('Token type:', typeof token);
  
  // Check if ANY sessions exist
  const totalSessions = await this.sessionModel.countDocuments();
  console.log('Total sessions in DB:', totalSessions);
  
  // Try to find token without ANY filter
  const allSessions = await this.sessionModel.find({}).lean();
  console.log('All sessions:', JSON.stringify(allSessions, null, 2));
  
  // Try exact token match only (no date filter)
  const sessionByToken = await this.sessionModel
    .findOne({ token })
    .lean();
  console.log('Session by token only:', sessionByToken);
  
  // Try date filter separately
  if (sessionByToken) {
    console.log('ExpiryDate in DB:', sessionByToken.expiryDate);
    console.log('Current time:', new Date());
    console.log('Is still valid?:', new Date(sessionByToken.expiryDate) > new Date());
  }
    const response = await this.sessionModel
      .findOne({ token, expiryDate: { $gt: new Date() } })
      .populate({
        path: 'userId',
        select: '-hashedpassword',
        populate: { path: 'submissions' },
      });
    console.log('Session validation response:', response);
    return response;
  }

  async invalidateSession(token: string): Promise<void> {
    await this.sessionModel.deleteOne({ token });
  }
}
