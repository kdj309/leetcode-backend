import { Injectable } from '@nestjs/common';
import { createUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/Schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAllUsers() {
    return await this.userModel.find();
  }

  async getUser(id: string) {
    const user = await this.userModel.findById(id);
    if (user) {
      return user;
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
    const user = await this.userModel.findOne({ email: userData.email });
    if (!user) {
      const newuser = new this.userModel(userData);
      await newuser.save();
      return 'User Created Successfully';
    } else {
      return 'User Already Exists';
    }
  }

  async updateUser(id: number, updateUser: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { ...updateUser },
      { new: true },
    );
    if (user) {
      return user;
    } else {
      throw new Error('User Not Found');
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
