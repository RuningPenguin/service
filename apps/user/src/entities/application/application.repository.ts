import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { DatabaseRepository } from '@app/common';

@Injectable()
export class ApplicationRepository extends DatabaseRepository<ApplicationEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, ApplicationEntity);
  }
}
