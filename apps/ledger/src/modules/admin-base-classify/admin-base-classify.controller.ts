import { AdminBaseClassifyService } from './admin-base-classify.service';
import { AdminBaseClassifyEntity } from '../../entities/admin-base-classify';
import { createCrudController } from '@app/common/utils/crud/crud.controller';
import { Controller } from '@nestjs/common';
import {
  CreateAdminBaseClassifyDto,
  CreateAdminBaseClassifyRes,
  DetailAdminBaseClassifyRes,
  ListAdminBaseClassifyDto,
  ListAdminBaseClassifyRes,
  UpdateAdminBaseClassifyDto
} from './dto';

const BaseController = createCrudController({
  tag: '管理端: 账本-分类',
  entity: AdminBaseClassifyEntity,
  service: AdminBaseClassifyService,
  config: {},
  req: {
    createDto: CreateAdminBaseClassifyDto,
    updateDto: UpdateAdminBaseClassifyDto,
    listDto: ListAdminBaseClassifyDto
  },
  res: {
    createRes: CreateAdminBaseClassifyRes,
    listRes: ListAdminBaseClassifyRes,
    detailRes: DetailAdminBaseClassifyRes
  }
});

@Controller('admin-base-classify')
export class AdminBaseClassifyController extends BaseController {
  constructor(private readonly adminBaseClassifyService: AdminBaseClassifyService) {
    super(adminBaseClassifyService);
  }
}
