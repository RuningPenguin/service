import { ClassifyService } from './classify.service';
import { ClassifyEntity } from '../../entities/classify';
import { createCrudController } from '@app/common/utils/crud/crud.controller';
import { Controller, Delete, Param } from '@nestjs/common';
import {
  CreateClassifyDto,
  CreateClassifyRes,
  DetailClassifyRes,
  ListClassifyDto,
  ListClassifyRes,
  UpdateClassifyDto
} from './dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { CusReturnType } from '@app/common/public/decorator/interceptor.decorator';
import { CusIsAuth } from '@app/common';
import { IdPipe } from '@app/common/public/pipe/id.pipe';
import { BillEntity } from '../../entities/bill';

const BaseController = createCrudController({
  tag: '账本-分类',
  entity: ClassifyEntity,
  service: ClassifyService,
  config: {},
  req: {
    createDto: CreateClassifyDto,
    updateDto: UpdateClassifyDto,
    listDto: ListClassifyDto
  },
  res: {
    createRes: CreateClassifyRes,
    listRes: ListClassifyRes,
    detailRes: DetailClassifyRes
  }
});

@Controller('classify')
export class ClassifyController extends BaseController {
  constructor(private readonly classifyService: ClassifyService) {
    super(classifyService);
  }

  @ApiOperation({ summary: '删除' })
  @ApiParam({ name: 'id', type: Number, description: '数据id' })
  @CusReturnType(Boolean, { isBoolean: true })
  @CusIsAuth()
  @Delete(':id')
  remove(@Param('id', new IdPipe()) id: number) {
    return this.classifyService.removeWithRelations(id, [
      { field: 'id', entity: ClassifyEntity },
      { field: 'ledgerId', entity: BillEntity }
    ]);
  }
}
