import { PartialType } from '@nestjs/mapped-types';
import { CreateWxDto } from './create-wx.dto';

export class UpdateWxDto extends PartialType(CreateWxDto) {}
