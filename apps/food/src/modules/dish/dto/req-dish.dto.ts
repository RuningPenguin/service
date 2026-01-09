import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { BasePageDto } from '@app/common/public/dto/baseParams.dto';

export class AddDishDto {
  @ApiProperty({ description: '菜品名称' })
  @IsString()
  name: string;

  @ApiProperty({
    description: '菜品价格（支持两位小数）',
    type: Number,
    example: 15.99
  })
  @IsNumber({}, { message: '价格必须是数字' })
  @Min(0.01, { message: '价格必须大于0' })
  @Max(9999.99, { message: '价格不能超过9999.99' })
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiProperty({ description: '菜品简介' })
  @IsOptional()
  @IsString()
  brief: string;

  @ApiProperty({ description: '菜品封面图片' })
  @IsString()
  pic: string;

  @ApiProperty({ description: '菜品主图片' })
  @IsOptional()
  @IsString()
  pics: string;

  @ApiProperty({ description: '菜品详情' })
  @IsString()
  detail: string;

  @ApiProperty({ description: '菜品分类id', type: [Number] })
  @IsArray()
  @ArrayNotEmpty({ message: '分类 ID 数组不能为空' })
  @IsInt({ each: true, message: '分类 ID 必须是整数' })
  @Type(() => Number)
  @IsOptional()
  classifyIds: Array<number>;
}

export class DishListDto extends BasePageDto {
  @ApiProperty({ description: '菜品分类id', type: String, example: [1, 2] })
  @Transform(({ value }) => {
    if (!value) return [];
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));
    }
    if (Array.isArray(value)) {
      return value.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
    }
    return value;
  })
  @IsArray()
  @ArrayNotEmpty({ message: '分类 ID 不能为空' })
  @IsInt({ each: true, message: '分类 ID 必须是整数' })
  @IsOptional()
  classifyIds?: number[];
}

export class DetailDishDto {
  @ApiProperty({ description: '菜品id', type: String, example: '1' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/, { message: 'id 必须是数字或数字字符串' })
  id: string;
}
