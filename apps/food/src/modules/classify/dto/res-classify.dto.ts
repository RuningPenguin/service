import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ClassifyEntity } from '@food/entities';

export class ResClassifyDto extends ClassifyEntity {
  @ApiProperty({ description: '分类名称' })
  @Expose()
  readonly name: string;
}
