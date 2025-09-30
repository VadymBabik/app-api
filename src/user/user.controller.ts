import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { ParseCuidPipe } from '../common/pipes/parse-cuid.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() input: Prisma.UserCreateInput) {
    return this.userService.create(input);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseCuidPipe) id: string) {
    return this.userService.findOne('id', id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseCuidPipe) id: string,
    @Body() input: Prisma.UserUpdateInput,
  ) {
    return this.userService.update(id, input);
  }

  @Delete(':id')
  async remove(@Param('id', ParseCuidPipe) id: string) {
    return this.userService.remove(id);
  }
}
