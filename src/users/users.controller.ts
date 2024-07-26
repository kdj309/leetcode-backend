import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  NotFoundException,
  ParseIntPipe,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { createUser } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userSrvice: UsersService) {}
  @Get('/')
  getUsers() {
    return this.userSrvice.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: number) {
    try {
      return this.userSrvice.getUser(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Post('/createUser')
  addUser(@Body(new ValidationPipe()) createUserDto: createUser) {
    const newUser = createUserDto;
    return this.userSrvice.createUser(newUser);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateUserBody: UpdateUserDto,
  ) {
    try {
      return this.userSrvice.updateUser(id, updateUserBody);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    try {
      return this.userSrvice.deleteUser(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
