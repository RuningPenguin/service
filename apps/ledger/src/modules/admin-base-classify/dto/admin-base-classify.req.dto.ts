import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BasePageDto } from '@app/common/public/dto/baseParams.dto';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { AdminBaseClassifyEntity } from '../../../entities/admin-base-classify';

// PickType：选择部分字段
// PartialType：将字段变为可选

export class CreateAdminBaseClassifyDto extends PickType(AdminBaseClassifyEntity, ['name'] as const) {
  @ApiProperty({ description: '应用名称', example: '应用名称' })
  @IsNotEmpty({ message: '应用名称不能为空' })
  @IsString()
  name: string;
}

export class UpdateAdminBaseClassifyDto extends PartialType(CreateAdminBaseClassifyDto) {
  @ApiProperty({ description: '应用名称', example: '应用名称' })
  @IsNotEmpty({ message: '应用名称不能为空' })
  @IsString()
  @IsOptional()
  name: string;
}

export class ListAdminBaseClassifyDto extends BasePageDto {}
