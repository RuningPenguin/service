import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResBasePageDto } from '@app/common/public/dto/baseParams.dto';
import { PickType } from '@nestjs/mapped-types';
import { LedgerEntity } from '../../../entities/ledger';
import { LedgerUserEntity } from '../../../entities/ledger_user';

// PickType：选择部分字段
// PartialType：将字段变为可选

export class LedgerRes extends PickType(LedgerEntity, ['id', 'userId', 'updatedAt', 'updatedAt', 'name'] as const) {
  @ApiProperty({ description: 'id', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: '创建人id', example: 1 })
  @Expose()
  userId: number;

  @ApiProperty({ description: '账单名称', example: '账单名称' })
  @Expose()
  name: string;

  @ApiProperty({ description: '创建时间', example: '2025/12/27 20:59:01' })
  @Expose()
  createdAt: string;

  @ApiProperty({ description: '更新时间', example: '2025/12/27 20:59:01' })
  @Expose()
  updatedAt: string;
}

export class CreateLedgerRes extends LedgerRes {}

export class DetailLedgerRes extends LedgerRes {}

export class ListLedgerRes extends ResBasePageDto {
  @ApiProperty({ description: '账本信息', type: [LedgerRes] })
  @Expose()
  @Type(() => LedgerRes)
  readonly list: Array<LedgerRes>;
}

export class LedgerUserRes extends PickType(LedgerUserEntity, [
  'id',
  'userId',
  'ledgerId',
  'role',
  'isExited',
  'updatedAt',
  'updatedAt'
] as const) {
  @ApiProperty({ description: 'id', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: '用户id', example: 1 })
  @Expose()
  userId: number;

  @ApiProperty({ description: '账本id', example: 1 })
  @Expose()
  ledgerId: number;

  @ApiProperty({ description: '角色', example: 'owner' })
  @Expose()
  role: 'owner' | 'member';

  @ApiProperty({ description: '是否退出', example: false })
  @Expose()
  isExited: boolean;

  @ApiProperty({ description: '创建时间', example: '2025/12/27 20:59:01' })
  @Expose()
  createdAt: string;

  @ApiProperty({ description: '更新时间', example: '2025/12/27 20:59:01' })
  @Expose()
  updatedAt: string;
}
export class DetailLedgerAndUsersRes extends LedgerRes {
  @ApiProperty({ description: '账本成员信息', type: [LedgerUserRes] })
  @Expose()
  @Type(() => LedgerUserRes)
  readonly users: Array<LedgerUserRes>;
}
