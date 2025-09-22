// s3.controller.ts
import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { UploadWithPublicUrlResult } from './s3.types';
import { ConfigService } from '@nestjs/config';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
];

@Controller('files')
export class S3Controller {
  private readonly bucketName: string;

  constructor(
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET');
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileWithPublicUrl(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadWithPublicUrlResult> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('File type not allowed');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File too large');
    }

    return this.s3Service.uploadFileWithPublicUrl(
      this.bucketName,
      file.originalname,
      file.buffer,
      file.mimetype,
      'uploads',
    );
  }
}
