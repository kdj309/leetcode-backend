import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  NotFoundException,
  ValidationPipe,
  Patch,
  UseGuards,
  Res,
} from '@nestjs/common';
import { createUser } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGaurd } from 'src/roles/roles.guard';
import { ObjectId } from 'mongoose';
import { getFailureResponse, getSuccessResponse } from 'src/utils';
import { submission } from 'src/interfaces/config.interface';
import { Response } from 'express';
import { SessionGuard } from 'src/sessiontoken/session.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userSrvice: UsersService) {}
  @Get('/')
  async getUsers() {
    return await this.userSrvice.getAllUsers();
  }

  @UseGuards(AuthGuard, SessionGuard)
  @Get(':id')
  async getUser(@Param('id') id: ObjectId) {
    try {
      return await this.userSrvice.getUser(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Post('/createUser')
  async addUser(
    @Body(new ValidationPipe()) createUserDto: createUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const newUser = createUserDto;
    try {
      const usermessage = await this.userSrvice.createUser(newUser);
      if (typeof usermessage === 'string') {
        return getSuccessResponse(null, usermessage);
      } else {
        response.cookie('access-token', usermessage.data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          domain: 'localhost',
          path: '/',
        });
        response.cookie('id', usermessage.data.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          domain: 'localhost',
          path: '/',
        });
        delete usermessage.data.access_token;
        return usermessage;
      }
    } catch (error) {
      return {
        status: 'Failure',
        error: error.message,
      };
    }
  }

  @UseGuards(AuthGuard, SessionGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateUserBody: UpdateUserDto,
  ) {
    try {
      return await this.userSrvice.updateUser(id, updateUserBody);
    } catch (error) {
      return getFailureResponse(error.message);
    }
  }

  @UseGuards(AuthGuard, SessionGuard)
  @Patch(':id/submission')
  async addSubmission(
    @Param('id') id: number,
    @Body(new ValidationPipe()) newsubmission: submission,
  ) {
    try {
      return await this.userSrvice.addSubmission(id, newsubmission);
    } catch (error) {
      return getFailureResponse(error.message);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGaurd, SessionGuard)
  @Delete(':id/:userId')
  async deleteUser(@Param('id') id: number) {
    try {
      return await this.userSrvice.deleteUser(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
