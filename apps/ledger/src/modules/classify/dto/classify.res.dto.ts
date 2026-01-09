import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResBasePageDto } from '@app/common/public/dto/baseParams.dto';
import { PickType } from '@nestjs/mapped-types';
import { ClassifyEntity } from '../../../entities/classify';

// PickType：选择部分字段
// PartialType：将字段变为可选

export class ClassifyRes extends PickType(ClassifyEntity, [
  'id',
  'ledgerId',
  'userId',
  'updatedAt',
  'updatedAt',
  'name'
] as const) {
  @ApiProperty({ description: '应用id', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: '应用名称', example: '应用名称' })
  @Expose()
  name: string;

  @ApiProperty({ description: '创建人id', example: 1 })
  @Expose()
  userId: number;

  @ApiProperty({ description: '账本id', example: 1 })
  @Expose()
  ledgerId: number;

  @ApiProperty({ description: '创建时间', example: '2025/12/27 20:59:01' })
  @Expose()
  createdAt: string;

  @ApiProperty({ description: '更新时间', example: '2025/12/27 20:59:01' })
  @Expose()
  updatedAt: string;
}

export class CreateClassifyRes extends ClassifyRes {}

export class DetailClassifyRes extends ClassifyRes {}

export class ListClassifyRes extends ResBasePageDto {
  @ApiProperty({ description: '分类信息', type: [ClassifyRes] })
  @Expose()
  @Type(() => ClassifyRes)
  readonly list: Array<ClassifyRes>;
}
