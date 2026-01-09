import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResBasePageDto } from '@app/common/public/dto/baseParams.dto';
import { UserEntity } from '@user/entities';
import { PickType } from '@nestjs/mapped-types';
import { ApplicationRes } from '../../application/dto/res-application.dto';

// PickType：选择部分字段
// PartialType：将字段变为可选

export class UserRes extends PickType(UserEntity, [
  'id',
  'username',
  'nickname',
  'avatar',
  'unionid',
  'openid',
  'createdAt',
  'updatedAt'
] as const) {
  @ApiProperty({ description: '用户id' })
  @Expose()
  readonly id: number;

  @ApiProperty({ description: '用户名' })
  @Expose()
  readonly username: string;

  @ApiProperty({ description: '昵称' })
  @Expose()
  readonly nickname: string;

  @ApiProperty({ description: '头像' })
  @Expose()
  readonly avatar: string;

  @ApiProperty({ description: 'unionid' })
  @Expose()
  readonly unionid: string;

  @ApiProperty({ description: 'openid' })
  @Expose()
  readonly openid: string;

  @ApiProperty({ description: '创建时间', example: '2025/12/27 20:59:01' })
  @Expose()
  createdAt: string;

  @ApiProperty({ description: '更新时间', example: '2025/12/27 20:59:01' })
  @Expose()
  updatedAt: string;

  @ApiProperty({ description: '用户应用列表', type: [ApplicationRes] })
  @Expose()
  @Type(() => ApplicationRes)
  readonly applications: ApplicationRes[];
}

export class CreateUserRes extends UserRes {}

export class DetailUserRes extends UserRes {}

export class ListUserRes extends ResBasePageDto {
  @ApiProperty({ description: '应用信息', type: [DetailUserRes] })
  @Expose()
  @Type(() => DetailUserRes)
  readonly list: Array<DetailUserRes>;
}

export class LoginRes {
  @ApiProperty({ description: '用户信息', type: () => UserRes })
  @Type(() => UserRes)
  @Transform(({ value }) => value || new UserRes()) // 如果没有值，设置为默认值
  @Expose()
  user: UserRes;

  @ApiProperty({ description: '登录凭证' })
  @Transform(({ value }) => value) // 如果没有值，设置为默认值
  @Expose()
  readonly access_token: string[];
}
