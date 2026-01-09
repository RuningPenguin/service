import { Body, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CusReturnType } from '@app/common/public/decorator/interceptor.decorator';
import { FindManyOptions } from 'typeorm';
import { BasePageDto } from '@app/common/public/dto/baseParams.dto';
import { CusIsAuth, JwtPayload } from '@app/common/auth';
import { CrudOptions, CrudService } from './crud.type';
import { DtoPipe } from '@app/common/public/pipe/dto.pipe';
import { IdPipe } from '@app/common/public/pipe/id.pipe';

export function createCrudController<Entity, CreateDto, UpdateDto, ListDto, CreateRes, ListRes, DetailRes>(
  options: CrudOptions<Entity, CreateDto, UpdateDto, ListDto, CreateRes, ListRes, DetailRes>
) {
  const {
    tag,
    entity,
    config = {},
    req: { createDto, updateDto, listDto },
    res: { createRes = entity, listRes = entity, detailRes = entity }
  } = options;

  const { noAuth = [] } = config;

  @ApiTags(tag)
  class CrudController {
    constructor(public readonly service: CrudService<Entity, CreateDto, UpdateDto>) {}

    @ApiOperation({ summary: '新增' })
    @ApiBody({ type: createDto })
    @CusReturnType(createRes)
    @CusIsAuth()
    @Post()
    add(@Req() req: { user: JwtPayload }, @Body(new DtoPipe(createDto)) dto: CreateDto) {
      const userId = req.user.id;
      return this.service.add({ ...dto, userId }, options.config?.unique, { userId });
    }

    @ApiOperation({ summary: '更新' })
    @ApiParam({ name: 'id', type: Number, description: '数据id' })
    @ApiBody({ type: updateDto })
    @CusReturnType(Boolean, { isBoolean: true })
    @CusIsAuth()
    @Put(':id')
    update(
      @Req() req: { user: JwtPayload },
      @Param('id', new IdPipe()) id: number,
      @Body(new DtoPipe(updateDto)) dto: UpdateDto
    ) {
      const userId = req.user.id;
      return this.service.update(id, dto, options.config?.unique, { userId });
    }

    @ApiOperation({ summary: '详情' })
    @ApiParam({ name: 'id', type: Number, description: '数据id' })
    @CusReturnType(detailRes)
    @CusIsAuth()
    @Get(':id')
    detail(@Param('id', new IdPipe()) id: number) {
      return this.service.detail(id);
    }

    @ApiOperation({ summary: '删除' })
    @ApiParam({ name: 'id', type: Number, description: '数据id' })
    @CusReturnType(Boolean, { isBoolean: true })
    @CusIsAuth()
    @Delete(':id')
    remove(@Param('id', new IdPipe()) id: number) {
      return this.service.remove(id);
    }

    @ApiOperation({ summary: '分页列表' })
    @ApiQuery({ type: listDto })
    @CusReturnType(listRes)
    @CusIsAuth()
    @Get()
    list(@Query(new DtoPipe(listDto)) query: ListDto & BasePageDto) {
      // return this.service.list(query);
      const pageDto = { page: query.page || 1, size: query.size || 10 };
      const optionsDto = { ...query };
      delete optionsDto.page;
      delete optionsDto.size;
      const where = {};
      Object.keys(optionsDto).forEach((key) => {
        if (optionsDto[key] !== undefined && optionsDto[key] !== null && optionsDto[key] !== '') {
          where[key] = optionsDto[key];
        }
      });
      const options = { where } as FindManyOptions<Entity>;
      return this.service.list(pageDto, options);
    }
  }

  // ⭐ 动态加/不加权限
  const methods: ('add' | 'update' | 'remove' | 'detail' | 'list')[] = ['add', 'update', 'remove', 'detail', 'list'];
  methods.forEach((methodName) => {
    if (!noAuth.includes(methodName)) {
      const descriptor = Object.getOwnPropertyDescriptor(CrudController.prototype, methodName);
      if (descriptor) {
        CusIsAuth()(CrudController.prototype, methodName, descriptor);
      }
    }
  });

  return CrudController;
}
