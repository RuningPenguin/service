import { Column, Entity, OneToMany } from 'typeorm';
import { BaseColumnOption, DatabaseEntity } from '@app/common';
import { UserApplicationEntity } from '../user_application';

@Entity('application')
export class ApplicationEntity extends DatabaseEntity {
  @Column({ ...BaseColumnOption, comment: '应用名称', unique: true })
  name: string;

  @Column({ ...BaseColumnOption, comment: '应用名称代码', unique: true })
  code: string;

  @OneToMany(() => UserApplicationEntity, (ua) => ua.application)
  userApplications: UserApplicationEntity[];
}
