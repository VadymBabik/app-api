// s3.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3UploadResult, UploadWithPublicUrlResult } from './s3.types';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);

  constructor(@Inject('S3_CLIENT') private readonly s3: S3Client) {}

  async uploadFileWithPublicUrl(
    bucket: string,
    originalName: string,
    buffer: Buffer,
    mimetype: string,
    prefix?: string,
  ): Promise<UploadWithPublicUrlResult> {
    const filename = this.generateFilename(originalName, prefix);

    try {
      // Завантажуємо файл і отримуємо ETag з відповіді
      const response = await this.s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: filename,
          Body: buffer,
          ContentType: mimetype,
        }),
      );

      const publicUrl = `https://s3.sotas.life/${bucket}/${filename}`;

      const uploadResult: S3UploadResult = {
        bucket,
        key: filename,
        originalName,
        mimetype,
        size: buffer.length,
        url: publicUrl,
        etag: response.ETag || '', // Додаємо ETag з відповіді S3
        timestamp: new Date().toISOString(),
      };

      return {
        uploadResult,
        publicUrl,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to upload file: ${error.message || error}`);
        throw error;
      } else {
        this.logger.error(`Failed to upload file: ${String(error)}`);
        throw new Error('Unknown error occurred during file upload');
      }
    }
  }

  private generateFilename(originalName: string, prefix?: string): string {
    const extension = path.extname(originalName);
    const name = path.basename(originalName, extension);
    const uniqueId = uuidv4().substring(0, 8);
    const sanitizedName = name.replace(/[^a-zA-Z0-9_-]/g, '_');

    const filename = `${sanitizedName}_${uniqueId}${extension}`;

    return prefix ? `${prefix}/${filename}` : filename;
  }
}
