import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BasePageDto } from '@app/common/public/dto/baseParams.dto';
import { ApplicationEntity } from '@user/entities';
import { PartialType, PickType } from '@nestjs/mapped-types';

// PickType：选择部分字段
// PartialType：将字段变为可选

export class CreateApplicationDto extends PickType(ApplicationEntity, ['name', 'code'] as const) {
  @ApiProperty({ description: '应用名称', example: '管理员' })
  @IsNotEmpty({ message: '应用名称不能为空' })
  @IsString()
  name: string;

  @ApiProperty({ description: '应用代码', example: 'admin' })
  @IsNotEmpty({ message: '应用代码不能为空' })
  @IsString()
  code: string;
}

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @ApiProperty({ description: '应用id', example: 1 })
  @IsNotEmpty({ message: '应用id不能为空' })
  @IsNumber()
  id: number;
}

export class ListApplicationDto extends BasePageDto {}
