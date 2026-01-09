import { Column, Entity } from 'typeorm';
import { DatabaseEntity } from '@app/common';

@Entity('access-record')
export class AccessRecordEntity extends DatabaseEntity {
  @Column({ comment: '服务名称', nullable: true })
  serviceName: string;

  @Column({ comment: '客户端Ip', nullable: true })
  clientIp: string;

  @Column({ comment: '请求方式', nullable: true })
  method: string;

  @Column({ comment: '请求接口 ', nullable: true })
  uri: string;

  @Column({ comment: '请求头', type: 'longtext', nullable: true })
  header: string;

  @Column({ comment: '请求参数', type: 'longtext', nullable: true })
  params: string;

  @Column({ comment: '响应数据', type: 'longtext', nullable: true })
  data: string;
}
