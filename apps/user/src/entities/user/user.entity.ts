import { Column, Entity, OneToMany } from 'typeorm';
import { BaseColumnOption, DatabaseEntity } from '@app/common';
import { UserApplicationEntity } from '../user_application';

@Entity('user')
export class UserEntity extends DatabaseEntity {
  @Column({ ...BaseColumnOption, unique: true, comment: '用户名' })
  username: string;

  @Column({ ...BaseColumnOption, comment: '昵称' })
  nickname?: string;

  @Column({ ...BaseColumnOption, length: 255, comment: '头像' })
  avatar?: string;

  @Column({ ...BaseColumnOption, comment: '密码' })
  password: string;

  @Column({ ...BaseColumnOption, comment: '用户在开放平台的唯一标识符，若当前小程序已绑定到微信开放平台账号下会返回' })
  unionid: string;

  @Column({ ...BaseColumnOption, comment: '微信用户唯一标识', unique: true })
  openid: string;

  @Column({ ...BaseColumnOption, comment: '会话密钥' })
  session_key?: string;

  @OneToMany(() => UserApplicationEntity, (ua) => ua.user)
  userApplications: UserApplicationEntity[];
}
