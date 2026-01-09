import { Controller, Delete, Param } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationRes, DetailApplicationRes, ListApplicationRes } from './dto/res-application.dto';
import { CreateApplicationDto, ListApplicationDto, UpdateApplicationDto } from './dto/req-application.dto';
import { createCrudController } from '@app/common/utils/crud/crud.controller';
import { ApplicationEntity, UserApplicationEntity } from '@user/entities';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { CusReturnType } from '@app/common/public/decorator/interceptor.decorator';
import { CusIsAuth } from '@app/common';
import { IdPipe } from '@app/common/public/pipe/id.pipe';

const BaseController = createCrudController({
  tag: '用户-应用',
  entity: ApplicationEntity,
  service: ApplicationService,
  config: {
    unique: [
      {
        fields: ['name', 'code'],
        on: ['add', 'update'],
        where: (dto) => [{ name: dto.name }, { code: dto.code }]
      }
    ]
  },
  req: {
    createDto: CreateApplicationDto,
    updateDto: UpdateApplicationDto,
    listDto: ListApplicationDto
  },
  res: {
    createRes: CreateApplicationRes,
    listRes: ListApplicationRes,
    detailRes: DetailApplicationRes
  }
});

@Controller('application')
export class ApplicationController extends BaseController {
  constructor(private readonly applicationService: ApplicationService) {
    super(applicationService);
  }

  @ApiOperation({ summary: '删除' })
  @ApiParam({ name: 'id', type: Number, description: '数据id' })
  @CusReturnType(Boolean, { isBoolean: true })
  @CusIsAuth()
  @Delete(':id')
  remove(@Param('id', new IdPipe()) id: number) {
    return this.applicationService.removeWithRelations(id, [
      { field: 'application_id', entity: UserApplicationEntity }
    ]);
  }
}
