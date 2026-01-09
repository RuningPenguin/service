import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { DatabaseEntity } from '@app/common';
import { UserEntity } from '../user';
import { ApplicationEntity } from '../application';

@Index(['user_id', 'application_id'], { unique: true })
@Entity('user_application')
export class UserApplicationEntity extends DatabaseEntity {
  @Column({ comment: '用户id' })
  user_id: string;

  @Column({ comment: '应用id' })
  application_id: string;

  @ManyToOne(() => UserEntity, (user) => user.userApplications)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ApplicationEntity, (app) => app.userApplications)
  @JoinColumn({ name: 'application_id' })
  application: ApplicationEntity;
}
