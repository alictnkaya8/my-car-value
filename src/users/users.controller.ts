import {
  Post,
  Get,
  Body,
  Controller,
  Patch,
  Param,
  Query,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(
      createUserDto.email,
      createUserDto.password,
    );
  }
  @UseInterceptors(SerializeInterceptor)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  getUserByEmail(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(parseInt(id), updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
