import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ValueTransformer
} from 'typeorm';
import { ColumnOptions } from 'typeorm/decorator/options/ColumnOptions';

export const BaseColumnOption: ColumnOptions = {
  type: 'varchar', // 数据库列类型
  length: 50, // 长度限制(对string类型)
  nullable: true, // 是否允许为null
  unique: false, // 是否唯一
  charset: 'utf8mb4', // 字符集
  collation: 'utf8mb4_unicode_ci', // 排序规则
  select: true, // 默认查询时是否选择此列
  insert: true, // 是否可插入
  update: true // 是否可更新
};

export const dateTransformer: ValueTransformer = {
  to(value: Date | string | null) {
    return value;
  },
  from(date: Date) {
    if (date instanceof Date) {
      const pad = (num: number) => num.toString().padStart(2, '0');
      return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }
    return date;
  }
};

export class DatabaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    select: true,
    transformer: dateTransformer
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    select: true,
    transformer: dateTransformer
  })
  updatedAt: string;

  @DeleteDateColumn({ type: 'timestamp', precision: 0, select: false, transformer: dateTransformer })
  deletedAt: string;
}
