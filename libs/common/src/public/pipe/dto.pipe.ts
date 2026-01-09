import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Injectable()
export class DtoPipe implements PipeTransform {
  constructor(private readonly dtoClass: any) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const instance = plainToInstance(this.dtoClass, value);

    const errors = validateSync(instance, {
      whitelist: true,
      forbidNonWhitelisted: true
    });

    console.log(errors);

    if (errors.length) {
      throw new BadRequestException({
        code: 400,
        error: 'Bad Request',
        message: errors.map((err) => Object.values(err.constraints)).flat(Infinity)
      });
    }

    return instance;
  }
}
