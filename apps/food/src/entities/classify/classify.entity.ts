import { Column, Entity } from 'typeorm';
import { DatabaseEntity } from '@app/common';

@Entity('classify')
export class ClassifyEntity extends DatabaseEntity {
  @Column({ comment: '分类名称', unique: true, nullable: true })
  name: string;

  @Column({ comment: '分类主图', type: 'longtext', nullable: true })
  pic: string;
}
