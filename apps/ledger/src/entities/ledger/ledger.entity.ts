import { Column, Entity, OneToMany } from 'typeorm';
import { BaseColumnOption, DatabaseEntity } from '@app/common';
import { LedgerUserEntity } from '../ledger_user';
import { ClassifyEntity } from '../classify';
import { BillEntity } from '../bill';

@Entity('ledger')
export class LedgerEntity extends DatabaseEntity {
  @Column({ ...BaseColumnOption, comment: '账本名称' })
  name: string;

  @Column({ comment: '创建者用户id' })
  userId: number;

  @OneToMany(() => LedgerUserEntity, (lu) => lu.ledger)
  users: LedgerUserEntity[];

  @OneToMany(() => ClassifyEntity, (c) => c.ledger)
  classifies: ClassifyEntity[];

  @OneToMany(() => BillEntity, (b) => b.ledger)
  bills: BillEntity[];
}
