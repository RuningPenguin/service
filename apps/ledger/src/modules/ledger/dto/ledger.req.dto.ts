import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BasePageDto } from '@app/common/public/dto/baseParams.dto';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { LedgerEntity } from '../../../entities/ledger';

// PickType：选择部分字段
// PartialType：将字段变为可选

export class CreateLedgerDto extends PickType(LedgerEntity, ['name'] as const) {
  @ApiProperty({ description: '账本名称', example: '账本名称' })
  @IsNotEmpty({ message: '账本名称不能为空' })
  @IsString()
  name: string;
}

export class UpdateLedgerDto extends PartialType(CreateLedgerDto) {
  @ApiProperty({ description: '账本名称', example: '账本名称' })
  @IsString()
  @IsOptional()
  name: string;
}

export class ListLedgerDto extends BasePageDto {}
