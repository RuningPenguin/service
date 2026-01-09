import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { BillEntity } from '../../../entities/bill';
import { BasePageDto } from '@app/common/public/dto/baseParams.dto';
import { Type } from 'class-transformer';

// PickType：选择部分字段
// PartialType：将字段变为可选

export class CreateBillDto extends PickType(BillEntity, [
  'name',
  'amount',
  'classifyId',
  'ledgerId',
  'consumerId',
  'billDate'
] as const) {
  @ApiPropertyOptional({ description: '账单名称', example: '账单名称' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '账单金额', example: 100 })
  @IsNotEmpty({ message: '账单金额不能为空' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: '账单类型id', example: 100 })
  @IsNotEmpty({ message: '账单类型id不能为空' })
  @IsNumber()
  classifyId: number;

  @ApiProperty({ description: '账本id', example: 100 })
  @IsNotEmpty({ message: '账本id不能为空' })
  @IsNumber()
  ledgerId: number;

  @ApiPropertyOptional({ description: '消费人id', example: 1 })
  @IsNumber()
  @IsOptional()
  consumerId?: number;

  @ApiProperty({ example: '2025-01-01', description: '记账日期' })
  @IsDateString() // ISO 格式校验
  billDate: string;
}

export class UpdateBillDto extends PartialType(CreateBillDto) {}

export class ListBillDto extends IntersectionType(
  BasePageDto,
  PartialType(PickType(BillEntity, ['name', 'ledgerId', 'classifyId', 'consumerId', 'billDate'] as const))
) {
  @ApiPropertyOptional({ description: '账单名称', example: '账单名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '账本id', example: 1 })
  @IsInt()
  @Type(() => Number)
  ledgerId: number;

  @ApiPropertyOptional({ description: '账单分类id', example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  classifyId?: number;

  @ApiPropertyOptional({ description: '消费人id', example: 1 })
  @IsNumber()
  @IsOptional()
  consumerId?: number;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  billDate?: string;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-01-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
