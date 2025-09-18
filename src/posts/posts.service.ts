import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.PostCreateInput): Promise<Post> {
    this.logger.log('create post');
    this.logger.debug(data);
    return this.prismaService.post.create({ data });
  }

  async findAll(): Promise<Post> {
    this.logger.log('get all post');
    return this.prismaService.post.findMany();
  }

  // async findOne(id: number) {
  //   return `This action returns a #${id} post`;
  // }
  //
  // async update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }
  //
  // async remove(id: number) {
  //   return `This action removes a #${id} post`;
  // }
}
