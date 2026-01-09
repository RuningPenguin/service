import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class IdPipe implements PipeTransform {
  transform(value: any) {
    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException({
        code: 400,
        message: '非法 id',
        data: value
      });
    }

    return id;
  }
}
