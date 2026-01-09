import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { DatabaseEntity } from '@app/common';
import { LedgerEntity } from '../ledger';

@Index(['ledgerId', 'userId'], { unique: true })
@Index(['ledgerId', 'role'])
@Entity('ledger_user')
export class LedgerUserEntity extends DatabaseEntity {
  @Column({ comment: '账本id' })
  ledgerId: number;

  @Column({ comment: '用户id（来自用户服务）' })
  userId: number;

  @Column({
    comment: '成员角色',
    type: 'varchar',
    length: 20,
    default: 'member'
  })
  role: 'owner' | 'member';

  @Column({
    comment: '是否已退出账本',
    default: false
  })
  isExited: boolean;

  @ManyToOne(() => LedgerEntity, (ledger) => ledger.users)
  @JoinColumn({ name: 'ledgerId' })
  ledger: LedgerEntity;
}
