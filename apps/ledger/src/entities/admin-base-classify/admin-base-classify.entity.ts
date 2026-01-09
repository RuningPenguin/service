import { Column, Entity } from 'typeorm';
import { BaseColumnOption, DatabaseEntity } from '@app/common';

@Entity('admin-base-classify')
export class AdminBaseClassifyEntity extends DatabaseEntity {
  @Column({ ...BaseColumnOption, comment: '应用名称' })
  name: string;
}
