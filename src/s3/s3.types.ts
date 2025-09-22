// s3.types.ts
export interface S3UploadResult {
  bucket: string;
  key: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  etag?: string;
  timestamp: string;
}

export interface UploadWithPublicUrlResult {
  uploadResult: S3UploadResult;
  publicUrl: string;
}
