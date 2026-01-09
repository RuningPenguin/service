/**
 * 1. 查询相关方法：
 * find(options?): 查找符合条件的多个实体。
 * findBy(where): 根据给定的条件查找多个实体。
 * findAndCount(options?): 查找符合条件的多个实体并返回总数。
 * findOne(options): 查找第一个符合条件的实体。
 * findOneBy(where): 根据给定条件查找第一个实体。
 * findOneOrFail(options): 查找第一个符合条件的实体，如果没有找到则抛出错误。
 * findOneByOrFail(where): 根据给定条件查找第一个实体，若未找到则抛出错误。
 * 2. 增、改、删除相关方法：
 * save(entity, options?): 保存实体，如果不存在则插入，否则更新。
 * remove(entities, options?): 删除一个或多个实体。
 * softRemove(entities, options?): 软删除实体（即记录删除日期）。
 * recover(entities, options?): 恢复软删除的实体。
 * insert(entity): 插入新的实体。
 * update(criteria, partialEntity): 更新符合条件的实体。
 * upsert(entityOrEntities, conflictPathsOrOptions): 插入或更新实体，若存在唯一约束冲突，则执行更新操作。
 * delete(criteria): 根据条件删除实体。
 * softDelete(criteria): 根据条件软删除实体。
 * restore(criteria): 恢复软删除的实体。
 * 3. 统计和聚合方法：
 * count(options?): 统计符合条件的实体数量。
 * countBy(where): 根据条件统计实体数量。
 * sum(columnName, where?): 计算某一列的总和。
 * average(columnName, where?): 计算某一列的平均值。
 * minimum(columnName, where?): 计算某一列的最小值。
 * maximum(columnName, where?): 计算某一列的最大值。
 * 4. 其他方法：
 * query(query, parameters?): 执行原始 SQL 查询，并返回原始数据库结果。这是直接执行 SQL 的方法，可以用于执行一些自定义的 SQL 查询。
 * clear(): 清空指定的表或集合的数据（类似于 TRUNCATE 操作）。
 * increment(conditions, propertyPath, value): 根据条件递增某列的值。
 * decrement(conditions, propertyPath, value): 根据条件递减某列的值。
 * exists(options?): 检查是否存在符合条件的实体。
 * existsBy(where): 根据条件检查实体是否存在。
 */
import { DataSource, EntityTarget, ObjectType, Repository } from 'typeorm';

export class DatabaseRepository<Entity> extends Repository<Entity> {
  constructor(
    private readonly dataSource: DataSource,
    entity: ObjectType<Entity>
  ) {
    super(entity, dataSource.createEntityManager());
  }

  /**
   * 软删除数据并删除关联表
   * @param id
   * @param relations
   */
  async softDeleteWithRelations(id: number, relations: Array<{ entity: EntityTarget<any>; field: string }>) {
    return this.dataSource.transaction(async (manager) => {
      // 1️⃣ 主表软删除（事务内）
      const mainRepo = manager.getRepository(this.target);
      const result = await mainRepo.softDelete(id);

      if (result.affected !== 1) return false;

      // 2️⃣ 关系表软删除（⚠️ 必须使用 manager）
      for (const { entity, field } of relations) {
        await manager.getRepository(entity).softDelete({ [field]: id });
      }

      return true;
    });
  }
}
