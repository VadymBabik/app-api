import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async healthCheck() {
    try {
      // Перевіряємо підключення до бази даних
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'OK',
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        platform: process.platform,
        database: 'connected',
        memory: process.memoryUsage(),
        uptime: process.uptime(),
      };
    } catch (error) {
      return {
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message,
      };
    }
  }
}
