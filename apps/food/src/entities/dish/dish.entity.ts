import { Column, Entity } from 'typeorm';
import { DatabaseEntity } from '@app/common';

@Entity('dish')
export class DishEntity extends DatabaseEntity {
  @Column({ comment: '菜品名称', nullable: true })
  name: string;

  @Column({ comment: '菜品价格', type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  price: number;

  @Column({ comment: '菜品简介', nullable: true })
  brief: string;

  @Column({ comment: '菜品主图', nullable: true })
  pic: string;

  @Column({ comment: '菜品头图', type: 'longtext', nullable: true })
  pics: string;

  @Column({ comment: '菜品详情', type: 'longtext', nullable: true })
  detail: string;

  @Column({ comment: '分类ID', nullable: false })
  classifyIds: string;
}
