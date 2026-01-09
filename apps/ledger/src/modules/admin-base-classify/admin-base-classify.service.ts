import { Injectable } from '@nestjs/common';
import { AdminBaseClassifyEntity, AdminBaseClassifyRepository } from '../../entities/admin-base-classify';
import { BaseService } from '@app/common/utils/crud/crud.service';

@Injectable()
export class AdminBaseClassifyService extends BaseService<AdminBaseClassifyEntity> {
  constructor(private readonly adminBaseClassifyRepository: AdminBaseClassifyRepository) {
    super(adminBaseClassifyRepository);
  }
}
