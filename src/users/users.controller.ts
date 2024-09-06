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
import { getSuccessResponse } from 'src/utils';

@Controller('users')
export class UsersController {
  constructor(private readonly userSrvice: UsersService) {}
  @Get('/')
  async getUsers() {
    return await this.userSrvice.getAllUsers();
  }

  @UseGuards(AuthGuard)
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
      //@ts-ignore
      const usermessage = await this.userSrvice.createUser(newUser);
      if (typeof usermessage === 'string') {
        return getSuccessResponse(null, usermessage);
      } else {
        //@ts-ignore
        response.cookie('access-token', usermessage.data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          domain: 'localhost',
          path: '/',
        });
        //@ts-ignore
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

    //@ts-ignore
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateUserBody: UpdateUserDto,
  ) {
    try {
      return await this.userSrvice.updateUser(id, updateUserBody);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGaurd)
  @Delete(':id/:userId')
  async deleteUser(@Param('id') id: number) {
    try {
      return await this.userSrvice.deleteUser(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
