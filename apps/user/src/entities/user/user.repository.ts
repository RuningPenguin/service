import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from './user.entity';
import { DatabaseRepository } from '@app/common';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { CusHttpException, CustomErrorCode, CustomErrorMsgMap } from '@app/common/public/custom/HttpException.custom';

@Injectable()
export class UserRepository extends DatabaseRepository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, UserEntity);
  }

  async add<T extends DeepPartial<UserEntity>>(entity: T): Promise<Promise<T & UserEntity> | any> {
    entity.nickname = entity.nickname || `penguin_${Math.random().toString(36).substring(2)}`;
    entity.username = entity.username || `${Number(Date.now().toString().slice(-8))}`;
    const userData = await this.findOneBy({ username: entity.username });
    if (userData) throw CusHttpException.error(CustomErrorCode['61001'], CustomErrorMsgMap['61001']);
    return this.save(entity);
  }
}
