import { CusHttpException, CustomErrorCode, CustomErrorMsgMap } from '@app/common/public/custom/HttpException.custom';
import { DatabaseRepository } from '@app/common/database';
import { BasePageDto } from '@app/common/public/dto/baseParams.dto';
import { FindManyOptions } from 'typeorm';
import { UniqueRule } from '@app/common/utils/crud/crud.type';

export class BaseService<Entity> {
  constructor(protected readonly repo: DatabaseRepository<Entity>) {}

  async add(
    dto: Partial<Entity>, // 数据
    uniqueRules?: UniqueRule<Entity>[], // 唯一性校验
    ctx?: { userId?: number } // 上下文
  ) {
    // 唯一数据性校验
    if (uniqueRules) {
      for (const rule of uniqueRules) {
        await this.checkUnique(rule, dto, { mode: 'add', userId: ctx?.userId });
      }
    }

    // 创建数据
    const entity = this.repo.create(dto as Entity);

    // 保存数据
    return this.repo.save(entity);
  }

  async update(id: number, dto: Partial<Entity>, uniqueRules?: UniqueRule<Entity>[], ctx?: { userId?: number }) {
    await this.checkIdExist(id);

    // 唯一数据性校验
    if (uniqueRules) {
      for (const rule of uniqueRules) {
        await this.checkUnique(rule, dto, { mode: 'update', id, userId: ctx?.userId });
      }
    }

    const { affected } = await this.repo.update(id, dto as any);

    return Boolean(affected);
  }

  async remove(id: number, options?: FindManyOptions<Entity>) {
    await this.checkIdExist(id);

    const filter = { id };
    if (options) {
      Object.assign(filter, options);
    }

    const { affected } = await this.repo.softDelete(filter as any);

    return Boolean(affected);
  }

  async removeWithRelations(id: number, relations?: Array<{ entity: any; field: string }>) {
    await this.checkIdExist(id);

    return this.repo.softDeleteWithRelations(id, relations || []);
  }

  async detail(id: number) {
    return this.repo.findOne({ where: { id } as any });
  }

  async list(pageDto: BasePageDto, options: FindManyOptions<Entity>) {
    const { page = 1, size = 10 } = pageDto;

    const filter = {
      skip: (page - 1) * size,
      take: size
    };
    Object.assign(filter, options);

    const list = await this.repo.find(filter);

    // 再单独查询总数
    const total = await this.repo.count({
      where: options.where
    });

    return {
      list,
      total,
      page,
      size
    };
  }

  // 显式中间表添加关联数据
  public async addWithRelations(repository: DatabaseRepository<any>, relations: { [x: string]: any }[]) {
    return await repository.save(relations);
  }

  // 校验id是否存在
  public async checkIdExist(id: number) {
    const entity = await this.repo.findOne({ where: { id } as any });
    if (!entity) {
      throw CusHttpException.error(CustomErrorCode['60998'], CustomErrorMsgMap['60998']);
    }
    return entity;
  }

  // 校验数据是否存在
  public async checkExist(options: FindManyOptions<Entity>) {
    const entity = await this.repo.findOne(options);
    if (!entity) {
      throw CusHttpException.error(CustomErrorCode['60998'], CustomErrorMsgMap['60998']);
    }
    return entity;
  }

  // 唯一数据性校验
  public async checkUnique(
    rule: UniqueRule<Entity>,
    dto: any,
    options: {
      mode: 'add' | 'update';
      id?: number;
      userId?: number;
    }
  ) {
    if (!rule.on.includes(options.mode)) return;

    let where: any = {};

    if (rule.where) {
      where = rule.where(dto, options);
    } else {
      rule.fields.forEach((field) => {
        if (dto[field] !== undefined) {
          where[field as string] = dto[field];
        }
      });
    }

    if (Object.keys(where).length === 0) return;

    const exist = await this.repo.findOne({ where });

    // update 时排除自身
    if (exist && options.mode === 'update') {
      if ((exist as any).id === options.id) return;
    }

    if (exist) {
      const code = rule.errorCode ?? '60999';
      throw CusHttpException.error(CustomErrorCode[code], CustomErrorMsgMap[code] ?? '数据已存在');
    }

    return exist;
  }
}
