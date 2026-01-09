import { PartialType } from '@nestjs/mapped-types';
import { AddClassifyDto } from './req-classify.dto';

export class UpdateClassifyDto extends PartialType(AddClassifyDto) {}
