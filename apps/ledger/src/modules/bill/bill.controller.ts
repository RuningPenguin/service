import { BillService } from './bill.service';
import { BillEntity } from '../../entities/bill';
import { createCrudController } from '@app/common/utils/crud/crud.controller';
import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { CreateBillDto, CreateBillRes, DetailBillRes, ListBillDto, ListBillRes, UpdateBillDto } from './dto';
import { CusIsAuth, JwtPayload } from '@app/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CusReturnType } from '@app/common/public/decorator/interceptor.decorator';
import { IdPipe } from '@app/common/public/pipe/id.pipe';
import { DtoPipe } from '@app/common/public/pipe/dto.pipe';
import { Between, FindManyOptions } from 'typeorm';

const BaseController = createCrudController({
  tag: '账本-账单',
  entity: BillEntity,
  service: BillService,
  config: {},
  req: {
    createDto: CreateBillDto,
    updateDto: UpdateBillDto,
    listDto: ListBillDto
  },
  res: {
    createRes: CreateBillRes,
    listRes: ListBillRes,
    detailRes: DetailBillRes
  }
});

@Controller('bill')
export class BillController extends BaseController {
  constructor(private readonly billService: BillService) {
    super(billService);
  }

  @ApiOperation({ summary: '新增' })
  @ApiBody({ type: CreateBillDto })
  @CusReturnType(CreateBillRes)
  @CusIsAuth()
  @Post()
  async add(@Req() req: { user: JwtPayload }, @Body(new DtoPipe(CreateBillDto)) dto: CreateBillDto) {
    const userId = req.user.id;
    const { ledgerId } = dto;

    // 判断账本权限
    await this.billService.checkUserIsLedgerMember(userId, ledgerId);

    // 新增
    return this.service.add({ ...dto, userId, consumerId: dto.consumerId ?? userId }, null, { userId });
  }

  @ApiOperation({ summary: '更新' })
  @ApiParam({ name: 'id', type: Number, description: '数据id' })
  @ApiBody({ type: UpdateBillDto })
  @CusReturnType(Boolean, { isBoolean: true })
  @CusIsAuth()
  @Put(':id')
  async update(
    @Req() req: { user: JwtPayload },
    @Param('id', new IdPipe()) id: number,
    @Body(new DtoPipe(UpdateBillDto)) dto: UpdateBillDto
  ) {
    const userId = req.user.id;
    const { ledgerId } = dto;

    // 判断账本权限
    await this.billService.checkUserIsLedgerMember(userId, ledgerId);

    // 更新
    return this.billService.update(id, dto, null, { userId });
  }

  @ApiOperation({ summary: '分页列表' })
  @ApiQuery({ type: ListBillDto })
  @CusIsAuth()
  @CusReturnType(ListBillRes)
  @Get()
  list(@Query(new DtoPipe(ListBillDto)) query: ListBillDto) {
    const pageDto = { page: query.page || 1, size: query.size || 10 };
    const optionsDto = { ...query };
    delete optionsDto.page;
    delete optionsDto.size;

    const where: FindManyOptions<BillEntity>['where'] = {};

    if (optionsDto.startDate && optionsDto.endDate) {
      const { startDate, endDate } = query;
      where.billDate = Between(startDate, endDate);
      delete optionsDto.startDate;
      delete optionsDto.endDate;
    }

    Object.keys(optionsDto).forEach((key) => {
      if (optionsDto[key] !== undefined && optionsDto[key] !== null && optionsDto[key] !== '') {
        where[key] = optionsDto[key];
      }
    });

    const options = { where, relations: ['ledger', 'classify'] } as FindManyOptions<BillEntity>;
    return this.service.list(pageDto, options);
  }
}
