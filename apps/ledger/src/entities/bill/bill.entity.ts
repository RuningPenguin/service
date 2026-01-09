import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseColumnOption, DatabaseEntity } from '@app/common';
import { LedgerEntity } from '../ledger';
import { ClassifyEntity } from '../classify';

@Index(['ledgerId', 'consumerId'])
@Entity('bill')
export class BillEntity extends DatabaseEntity {
  @Column({ ...BaseColumnOption, comment: '账单名称' })
  name?: string;

  @Column({ type: 'float', comment: '账单金额' })
  amount: number;

  @Column({ comment: '分类id', nullable: true })
  classifyId: number | null;

  @Column({ comment: '账本id' })
  ledgerId: number;

  @Column({ comment: '记账人用户id（谁操作的）' })
  userId: number;

  @Column({ comment: '消费人id 账单所属人（谁的账）' })
  consumerId?: number;

  @Column({ type: 'date', comment: '记账日期' })
  billDate: string;

  @ManyToOne(() => LedgerEntity, (ledger) => ledger.bills)
  @JoinColumn({ name: 'ledgerId' })
  ledger: LedgerEntity;

  @ManyToOne(() => ClassifyEntity)
  @JoinColumn({ name: 'classifyId' })
  classify: ClassifyEntity;
}
