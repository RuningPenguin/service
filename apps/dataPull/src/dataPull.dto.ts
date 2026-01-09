import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export class DataPullDto {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsIn(['dev', 'prd'])
  @IsOptional()
  env: string = 'dev';
}
