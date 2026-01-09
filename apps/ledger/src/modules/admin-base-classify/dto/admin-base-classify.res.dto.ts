import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResBasePageDto } from '@app/common/public/dto/baseParams.dto';
import { PickType } from '@nestjs/mapped-types';
import { AdminBaseClassifyEntity } from '../../../entities/admin-base-classify';

// PickType：选择部分字段
// PartialType：将字段变为可选

export class AdminBaseClassifyRes extends PickType(AdminBaseClassifyEntity, ['id', 'name', 'createdAt'] as const) {
  @ApiProperty({ description: '应用id', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: '应用名称', example: '应用名称' })
  @Expose()
  name: string;

  @ApiProperty({ description: '创建时间', example: '2025/12/27 20:59:01' })
  @Expose()
  createdAt: string;

  @ApiProperty({ description: '更新时间', example: '2025/12/27 20:59:01' })
  @Expose()
  updatedAt: string;
}

export class CreateAdminBaseClassifyRes extends AdminBaseClassifyRes {}

export class DetailAdminBaseClassifyRes extends AdminBaseClassifyRes {}

export class ListAdminBaseClassifyRes extends ResBasePageDto {
  @ApiProperty({ description: 'admin-base-classify信息', type: [AdminBaseClassifyRes] })
  @Expose()
  @Type(() => AdminBaseClassifyRes)
  readonly list: Array<AdminBaseClassifyRes>;
}
