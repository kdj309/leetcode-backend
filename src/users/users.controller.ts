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
import { signup } from 'src/interfaces/config.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly userSrvice: UsersService) {}
  @Get('/')
  async getUsers() {
    return await this.userSrvice.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: string) {
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
    //@ts-ignore
    const usermessage: signup = await this.userSrvice.createUser(newUser);
    //@ts-ignore
    response.cookie('access-token', usermessage.access_token, {
      httpOnly: true,
    });
    return usermessage.message;
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
