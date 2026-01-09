import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseColumnOption, DatabaseEntity } from '@app/common';
import { LedgerEntity } from '../ledger';

@Entity('classify')
export class ClassifyEntity extends DatabaseEntity {
  @Column({ comment: '账本id' })
  ledgerId: number;

  @Column({ comment: '创建用户id' })
  userId: number;

  @Column({ ...BaseColumnOption, comment: '分类名称' })
  name: string;

  @ManyToOne(() => LedgerEntity, (ledger) => ledger.classifies)
  @JoinColumn({ name: 'ledgerId' })
  ledger: LedgerEntity;
}
