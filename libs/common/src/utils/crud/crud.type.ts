import { Type } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { BasePageDto } from '@app/common/public/dto/baseParams.dto';
import { CustomErrorCode } from '@app/common/public/custom/HttpException.custom';
import { DatabaseRepository } from '@app/common/database';

export interface CrudReq<CreateDto, UpdateDto, ListDto> {
  createDto: Type<CreateDto>;
  updateDto: Type<UpdateDto>;
  listDto: Type<ListDto>;
}

export interface CrudRes<CreateRes, ListRes, DetailRes> {
  createRes?: Type<CreateRes>;
  listRes?: Type<ListRes>;
  detailRes?: Type<DetailRes>;
}

export interface CrudOptions<Entity, CreateDto, UpdateDto, ListDto, CreateRes, ListRes, DetailRes> {
  tag: string; // swagger 标签
  config?: {
    noAuth?: ('add' | 'update' | 'remove' | 'detail' | 'list')[]; // 不加权限的方法
    unique?: UniqueRule<Entity>[]; // 唯一性校验
    // unique:
    // [
    //   {
    //     fields: ['name'];
    //     on: ['add', 'update'];
    //     errorCode: '60999';
    //   }
    // ]
    // [
    //   {
    //     on: ['add', 'update'];
    //     where: (
    //       dto,
    //       options
    //     ) => {
    //       name: dto.name;
    //       userId: options.userId;
    //     };
    //     errorCode: '60999';
    //   }
    // ]
  };
  entity: Type<Entity>; // 数据库实体
  service: Type<CrudService<Entity, CreateDto, UpdateDto> & { [x: string]: any }>; // service
  req: CrudReq<CreateDto, UpdateDto, ListDto>; // 请求参数
  res?: CrudRes<CreateRes, ListRes, DetailRes>; // 响应参数
}

export interface CrudService<Entity, CreateDto, UpdateDto> {
  [x: string]: any;
  addWithRelations(repository: DatabaseRepository<any>, relations: { [x: string]: any }[]): Promise<any[]>;
  checkIdExist(id: number): Promise<Entity>;
  checkExist(options: FindManyOptions<Entity>): Promise<Entity>;
  checkUnique(
    rule: UniqueRule<Entity>,
    dto: any,
    options: {
      mode: 'add' | 'update';
      id?: number;
      userId?: number;
    }
  ): Promise<Entity>;
  add(
    dto: CreateDto, // 数据
    uniqueRules?: UniqueRule<Entity>[], // 唯一性校验
    ctx?: { userId?: number } // 上下文
  ): Promise<Entity>;
  update(id: number, dto: UpdateDto, uniqueRules?: UniqueRule<Entity>[], ctx?: { userId?: number }): Promise<boolean>;
  remove(id: number, options?: FindManyOptions<Entity>): Promise<boolean>;
  removeWithRelations(id: number, relations?: Array<{ entity: any; field: string }>): Promise<boolean>;
  detail(id: number): Promise<Entity>;
  list(
    listDto: BasePageDto,
    options?: FindManyOptions<Entity>
  ): Promise<{
    page: number;
    size: number;
    total: number;
    list: Array<Entity>;
  }>;
}

export type UniqueCheckMode = 'add' | 'update';

export interface UniqueRule<Entity = any> {
  /** 需要校验的字段（支持多个 = 联合唯一） */
  fields: (keyof Entity | string)[];

  /** 在哪些操作下生效 */
  on: UniqueCheckMode[];

  /** 可选：自定义 where 生成 */
  where?: (dto: any, ctx: { id?: number; userId?: number }) => Record<string, any>;

  /** 可选：错误码 */
  errorCode?: keyof typeof CustomErrorCode;
}
