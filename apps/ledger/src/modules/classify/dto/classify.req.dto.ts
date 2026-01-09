import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BasePageDto } from '@app/common/public/dto/baseParams.dto';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { ClassifyEntity } from '../../../entities/classify';

// PickType：选择部分字段
// PartialType：将字段变为可选

export class CreateClassifyDto extends PickType(ClassifyEntity, ['name', 'ledgerId'] as const) {
  @ApiProperty({ description: '分类名称', example: '分类名称' })
  @IsNotEmpty({ message: '应用名称不能为空' })
  @IsString()
  name: string;

  @ApiProperty({ description: '账本id', example: 1 })
  @IsNotEmpty({ message: '账本id不能为空' })
  @IsNumber()
  ledgerId: number;
}

export class UpdateClassifyDto extends PartialType(CreateClassifyDto) {
  @ApiProperty({ description: '分类名称', example: '分类名称' })
  @IsString()
  @IsOptional()
  name?: string;
}

export class ListClassifyDto extends BasePageDto {}
