import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class BasePageDto {
  @ApiProperty({ description: '页码，从 1 开始', default: 1, example: 1 })
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码不能小于 1' }) // 确保页码为正数
  page: number = 1;

  @ApiProperty({ description: '每页数量，默认为 10', default: 10, example: 10 })
  @Type(() => Number)
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量不能小于 1' }) // 确保每页数量为正数
  size: number = 10;
}

export class BaseOrderDto {
  @ApiPropertyOptional({ example: 'createdAt' })
  @IsOptional()
  orderBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  order?: 'ASC' | 'DESC';
}

export class ResBasePageDto {
  @ApiProperty({ description: '页码' })
  @Type(() => Number)
  @Expose()
  page: number;

  @ApiProperty({ description: '每页数量' })
  @Type(() => Number)
  @Expose()
  size: number;

  @ApiProperty({ description: '数据总数' })
  @Type(() => Number)
  @Expose()
  total: number;
}
