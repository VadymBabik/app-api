import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit
{
  readonly Logger = new Logger(PrismaService.name);

  async onModuleInit() {
    this.Logger.log('Prisma ModuleInit');
    await this.$connect();
  }
}
