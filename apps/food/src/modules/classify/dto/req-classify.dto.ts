import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddClassifyDto {
  @ApiProperty({ description: '分类名称' })
  @IsNotEmpty({ message: '分类名称不能为空' })
  @IsString({ message: '分类名称必须为字符串' })
  name: string;
}
