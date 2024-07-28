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
} from '@nestjs/common';
import { createUser } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGaurd } from 'src/roles/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userSrvice: UsersService) {}
  @Get('/')
  getUsers() {
    return this.userSrvice.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getUser(@Param('id') id: string) {
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

  @UseGuards(AuthGuard)
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

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGaurd)
  @Delete(':id/:userId')
  deleteUser(@Param('id') id: number) {
    try {
      return this.userSrvice.deleteUser(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
