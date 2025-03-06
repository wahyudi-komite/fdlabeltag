import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '../auth/auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const salt = Math.random().toString(36).substr(2, 10);
    const password = await bcrypt.hash(salt + createUserDto.password, 12);

    const { role_id, ...data } = createUserDto;
    console.log(data);

    return this.usersService.create({
      ...data,
      password,
      salt: salt,
      role: { id: role_id },
    });
  }

  @Get()
  async findAll(@Request() request) {
    return this.usersService.paginate('users', [['users.role', 'role']], {
      limit: request.query.limit,
      page: request.query.page,
      sort: request.query.sort,
      direction: request.query.direction,
      keyword: request.query.keyword,
      column: ['users.name'],
    });
  }
}
