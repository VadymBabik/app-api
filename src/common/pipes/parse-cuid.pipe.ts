// pipes/parse-cuid.pipe.ts
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isCuid } from 'cuid';

@Injectable()
export class ParseCuidPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isCuid(value)) {
      throw new BadRequestException(
        'Validation failed (cuid string is expected)',
      );
    }
    return value;
  }
}
