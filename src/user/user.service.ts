import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { UniqueViolation } from '../common/exceptions';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prismaService: PrismaService) {}
  async create(input: Prisma.UserCreateInput): Promise<User> {
    const newUser = await this.prismaService.user.findFirst({
      where: {
        email: input.email,
      },
    });

    if (newUser) {
      this.logger.log('User already exists');
      throw new UniqueViolation('email');
    }
    const user = await this.prismaService.user.create({
      data: input,
    });

    this.logger.log('User created', user);

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async findOne(field: string, value: string): Promise<User> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          [field]: value,
        },
      });
      if (!user) {
        throw new UniqueViolation(field);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, input: Prisma.UserUpdateInput): Promise<User> {
    try {
      return this.prismaService.user.update({
        where: {
          id,
        },
        data: input,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const user = await this.findOne('id', id);
      if (!user) {
        throw new UniqueViolation('id');
      }
      await this.prismaService.user.delete({
        where: {
          id: user.id,
        },
      });
      return `This action removes a #${id} user`;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
