import {
  Body,
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserStatsService } from './user_stats.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionGuard } from 'src/sessiontoken/session.guard';
import { getFailureResponse } from 'src/utils';
import { UpdateUserDto } from './dto/update-userStat.dto';
import { UpdateOnlineStatusDto } from './dto/update-onlinestatus.dto';
import { Types } from 'mongoose';
import { CreateUserStatDTO } from './dto/create-userstat.dto';
import { Request as ExpressRequest } from 'express';

@Controller('user-stats')
export class UserStatsController {
  constructor(private readonly userstateService: UserStatsService) {}
  @UseGuards(AuthGuard, SessionGuard)
  @Post('create')
  async create(@Body() body:CreateUserStatDTO) {
    try {
      return await this.userstateService.create(body.userId);
    } catch (error) {
      if (error instanceof Error) return getFailureResponse(error.message);
      return getFailureResponse('An unknown error occurred');
    }
  }
  @UseGuards(AuthGuard, SessionGuard)
  @Get(':userId')
  async findOne(@Param('userId') id: string) {
    try {
      const userStats = await this.userstateService.findByUserId(id);
      if (!userStats) {
        throw new NotFoundException();
      }
      return userStats;
    } catch (error) {
      if (error instanceof Error) return getFailureResponse(error.message);
      return getFailureResponse('An unknown error occurred');
    }
  }

  @UseGuards(AuthGuard, SessionGuard)
  @Put(':userId')
  async updateStats(
    @Param('userId') userId: string,
    @Body() updateUserStatDTO: UpdateUserDto,
    @Req() request: ExpressRequest & { user?: any },
  ) {
    try {
      if (request.user?.toString() !== userId) {
        throw new UnauthorizedException(
          'You are not authorized to update this user stats',
        );
      }
      const response = await this.userstateService.updateStats(
        userId,
        updateUserStatDTO.difficult,
        updateUserStatDTO.problemId,
      );
      return response;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error instanceof Error) return getFailureResponse(error.message);
      return getFailureResponse('An unknown error occurred');
    }
  }

  @UseGuards(AuthGuard, SessionGuard)
  @Patch(':userId/online-status')
  async updateOnlineStatus(
    @Param('userId') id: string,
    @Body() updateOnlineStats: UpdateOnlineStatusDto,
  ) {
    try {
      const response = await this.userstateService.updateOnlineStatus(
        id,
        updateOnlineStats.isOnline,
      );
      return response;
    } catch (error) {
      if (error instanceof Error) return getFailureResponse(error.message);
      return getFailureResponse('An unknown error occurred');
    }
  }
}