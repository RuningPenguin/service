import { PartialType } from '@nestjs/mapped-types';
import { AddDishDto } from './req-dish.dto';

export class UpdateDishDto extends PartialType(AddDishDto) {}
