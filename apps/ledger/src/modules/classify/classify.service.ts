import { Injectable } from '@nestjs/common';
import { ClassifyEntity, ClassifyRepository } from '../../entities/classify';
import { BaseService } from '@app/common/utils/crud/crud.service';

@Injectable()
export class ClassifyService extends BaseService<ClassifyEntity> {
  constructor(private readonly classifyRepository: ClassifyRepository) {
    super(classifyRepository);
  }
}
