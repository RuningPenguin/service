import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { BasePageDto } from '@app/common/public/dto/baseParams.dto';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { UserEntity } from '@user/entities';

// PickType：选择部分字段
// PartialType：将字段变为可选

export class CreateUserDto extends PickType(UserEntity, ['username', 'password', 'nickname', 'avatar'] as const) {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  username: string;

  @ApiProperty({ description: '密码', example: '1234' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ description: '昵称', example: 'admin' })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional({ description: '头像', example: '' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ description: '应用ID数组', example: [1, 2] })
  @IsOptional()
  @IsArray({ message: 'applicationIds 必须是数组' })
  @ArrayMinSize(1, { message: 'applications 至少一个' })
  @IsNumber({}, { each: true, message: 'applications 中每项必须是 number' })
  @IsDefined({ message: 'applications 必须传' }) // 不允许 null / undefined
  @IsNotEmpty({ each: true, message: 'applications 中的每一项不能为空' }) // 不允许空字符串
  applications?: number[];
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsNotEmpty({ message: '用户ID不能为空' })
  @IsNumber()
  id: number;
}

export class ListUserDto extends IntersectionType(
  BasePageDto,
  PartialType(PickType(UserEntity, ['username'] as const))
) {
  @ApiPropertyOptional({ description: '用户名', example: 'admin' })
  @IsString()
  @IsOptional()
  username?: string;
}

export class LoginDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  username: string;

  @ApiProperty({ description: '密码', example: '1234' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  password: string;
}

export class RegisterDto extends LoginDto {
  // @ApiProperty({ description: '用户名', required: false })
  // @IsOptional()
  // @IsString()
  // declare username: string;
}

export class AddUserDto {
  @ApiPropertyOptional({ description: '应用ID数组', example: [1, 2] })
  @IsOptional()
  @IsArray({ message: 'applicationIds 必须是数组' })
  @ArrayMinSize(1, { message: 'applications 至少一个' })
  @IsNumber({}, { each: true, message: 'applications 中每项必须是 number' })
  @IsDefined({ message: 'applications 必须传' }) // 不允许 null / undefined
  @IsNotEmpty({ each: true, message: 'applications 中的每一项不能为空' }) // 不允许空字符串
  applications?: number[];

  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  username: string;

  @ApiProperty({ description: '密码', example: '1234' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  password: string;

  @ApiProperty({ description: '昵称', example: 'admin' })
  @IsNotEmpty({ message: '昵称不能为空' })
  @IsString()
  nickname: string;

  @ApiProperty({ description: '头像', example: '' })
  @IsString()
  @IsOptional()
  avatar?: string;
}

export class DeleteUserDto {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsNotEmpty({ message: '用户ID不能为空' })
  id: number;
}

export class WechatLoginDto {
  @ApiProperty({ description: 'code', example: '0c35hyll2OxkRg4Ikwol2joife15hylN' })
  @IsNotEmpty({ message: 'code 不能为空' })
  @IsString({ message: 'code 必须是 string' })
  code: string;
}

export class UserListPageDto extends BasePageDto {}

@ValidatorConstraint({ name: 'AtLeastOneApplication', async: false })
class AtLeastOneApplicationConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return (
      (Array.isArray(obj.applicationIds) && obj.applicationIds.length > 0) ||
      (Array.isArray(obj.applicationCodes) && obj.applicationCodes.length > 0)
    );
  }

  defaultMessage() {
    return 'applicationIds 和 applicationCodes 至少传一个';
  }
}
export class UserAddApplicationDto {
  @ApiProperty({ description: '用户id', example: 1 })
  @IsNotEmpty({ message: '用户id不能为空' })
  @IsNumber()
  userId: number;

  @ApiPropertyOptional({ description: '应用ID数组', example: [1, 2] })
  @IsOptional()
  @IsArray({ message: 'applicationIds 必须是数组' })
  @ArrayMinSize(1, { message: 'applicationIds 至少一个' })
  @IsNumber({}, { each: true, message: 'applicationIds 中每项必须是 number' })
  @IsDefined({ message: 'applicationIds 必须传' }) // 不允许 null / undefined
  @IsNotEmpty({ each: true, message: 'applicationIds 中的每一项不能为空' }) // 不允许空字符串
  applicationIds?: number[];

  @ApiPropertyOptional({ description: '应用 code 数组', example: ['admin'] })
  @IsOptional()
  @IsArray({ message: 'applicationCodes 必须是数组' })
  @ArrayMinSize(1, { message: 'applicationCodes 至少一个' })
  @IsString({ each: true, message: 'applicationCodes 中每项必须是 string' })
  @IsDefined({ message: 'applicationCodes 必须传' }) // 不允许 null / undefined
  @IsNotEmpty({ each: true, message: 'applicationCodes 中的每一项不能为空' }) // 不允许空字符串
  applicationCodes?: string[];

  /**
   * 仅用于校验：applicationIds 和 applicationCodes 至少一个
   * ⚠️ 关键：private + optional
   */
  @ValidateIf((o) => !o.applicationIds && !o.applicationCodes)
  @IsNotEmpty({ message: 'applicationIds 和 applicationCodes 必须至少传一个' })
  @Validate(AtLeastOneApplicationConstraint)
  private _atLeastOneApplication?: boolean;
}
