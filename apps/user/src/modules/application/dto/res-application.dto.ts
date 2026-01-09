import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResBasePageDto } from '@app/common/public/dto/baseParams.dto';
import { PickType } from '@nestjs/mapped-types';
import { ApplicationEntity } from '@user/entities';

// PickType：选择部分字段
// PartialType：将字段变为可选

export class ResApplicationDto {}

export class ApplicationRes extends PickType(ApplicationEntity, [
  'id',
  'name',
  'code',
  'updatedAt',
  'updatedAt'
] as const) {
  @Expose()
  @ApiProperty({ description: '应用id' })
  id: number;

  @Expose()
  @ApiProperty({ description: '应用名称' })
  name: string;

  @Expose()
  @ApiProperty({ description: '应用代码' })
  code: string;

  @ApiProperty({ description: '创建时间', example: '2025/12/27 20:59:01' })
  @Expose()
  createdAt: string;

  @ApiProperty({ description: '更新时间', example: '2025/12/27 20:59:01' })
  @Expose()
  updatedAt: string;
}

export class CreateApplicationRes extends ApplicationRes {}

export class DetailApplicationRes extends ApplicationRes {}

export class ListApplicationRes extends ResBasePageDto {
  @ApiProperty({ description: '应用信息', type: [ApplicationRes] })
  @Expose()
  @Type(() => ApplicationRes)
  readonly list: Array<ApplicationRes>;
}
