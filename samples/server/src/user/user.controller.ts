import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UserService } from './services/user.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<User> {
    return this.userService.create(data);
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDto
  ): Promise<User> {
    return this.userService.update(id, data);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
