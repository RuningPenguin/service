import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DatabaseRepository } from '@app/common';
import { FileEntity } from './file.entity';

@Injectable()
export class FileRepository extends DatabaseRepository<FileEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, FileEntity);
  }
}
