import { Expose } from 'class-transformer';
import { UserEntity } from '@user/entities';
import { ApiProperty } from '@nestjs/swagger';

export class Code2SessionDto extends UserEntity {
  @ApiProperty({ description: '用户在开放平台的唯一标识符，若当前小程序已绑定到微信开放平台账号下会返回' })
  @Expose()
  unionid: string;

  @ApiProperty({ description: '用户唯一标识' })
  @Expose()
  openid: string;

  @ApiProperty({ description: '会话密钥' })
  @Expose()
  session_key: string;
}
