import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResBasePageDto } from '@app/common/public/dto/baseParams.dto';
import { PickType } from '@nestjs/mapped-types';
import { BillEntity } from '../../../entities/bill';
import { ClassifyRes } from '../../classify/dto';
import { LedgerRes } from '../../ledger/dto';

// PickType：选择部分字段
// PartialType：将字段变为可选

export class BillRes extends PickType(BillEntity, [
  'id',
  'userId',
  'createdAt',
  'updatedAt',
  'name',
  'amount',
  'classifyId',
  'billDate'
] as const) {
  @ApiProperty({ description: 'id', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: '账单名称', example: '账单名称' })
  @Expose()
  name: string;

  @ApiProperty({ description: '账单金额', example: 100 })
  @Expose()
  amount: number;

  @ApiProperty({ description: '账单类型id', example: 1 })
  @Expose()
  classifyId: number;

  @ApiProperty({ description: '创建人id', example: 1 })
  @Expose()
  userId: number;

  @ApiProperty({ description: '记账日期', example: '2025/12/27' })
  @Expose()
  billDate: string;

  @ApiProperty({ description: '创建时间', example: '2025/12/27 20:59:01' })
  @Expose()
  createdAt: string;

  @ApiProperty({ description: '更新时间', example: '2025/12/27 20:59:01' })
  @Expose()
  updatedAt: string;
}

export class CreateBillRes extends BillRes {}

export class DetailBillRes extends BillRes {}

export class BillJoinRes extends BillRes {
  @ApiProperty({ description: '分类信息', type: [ClassifyRes] })
  @Expose()
  @Type(() => ClassifyRes)
  classify: ClassifyRes;

  @ApiProperty({ description: '账本信息', type: [LedgerRes] })
  @Expose()
  @Type(() => LedgerRes)
  ledger: LedgerRes;
}
export class ListBillRes extends ResBasePageDto {
  @ApiProperty({ description: 'bill信息', type: [BillJoinRes] })
  @Expose()
  @Type(() => BillJoinRes)
  readonly list: Array<BillJoinRes>;
}
