// s3.module.ts
import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  imports: [ConfigModule],
  controllers: [S3Controller],
  providers: [
    S3Service,
    {
      provide: 'S3_CLIENT',
      useFactory: (config: ConfigService) =>
        new S3Client({
          region: config.get<string>('MINIO_REGION'),
          endpoint: config.get<string>('MINIO_ENDPOINT'),
          credentials: {
            accessKeyId: config.getOrThrow<string>('MINIO_ROOT_USER'),
            secretAccessKey: config.getOrThrow<string>('MINIO_ROOT_PASSWORD'),
          },
          forcePathStyle: true,
          maxAttempts: 3,
          retryMode: 'standard',
        }),
      inject: [ConfigService],
    },
  ],
  exports: [S3Service],
})
export class S3Module {}
