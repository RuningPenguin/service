import { BadRequestException, ValidationPipe } from '@nestjs/common';

// 自定义参数校验管道方法
export class CustomValidationPipe extends ValidationPipe {
  public async transform(value: any, metadata: any) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      throw new BadRequestException('Validation failed: ' + e.message);
    }
  }
}
