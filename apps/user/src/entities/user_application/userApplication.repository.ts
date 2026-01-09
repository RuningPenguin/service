import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DatabaseRepository } from '@app/common';
import { UserApplicationEntity } from './userApplication.entity';

@Injectable()
export class UserApplicationRepository extends DatabaseRepository<UserApplicationEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, UserApplicationEntity);
  }

  async deleteByUserId(userId: number) {
    return this.delete({ user: { id: userId } });
  }

  async deleteByApplicationId(applicationId: number) {
    return this.delete({ application: { id: applicationId } });
  }
}
