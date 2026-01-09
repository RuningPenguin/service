import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

// 自定义是否需要验证
export const IS_AUTH = Symbol('isAuth');
export const CusIsAuth = () => {
  return applyDecorators(
    SetMetadata(IS_AUTH, true),
    ApiBearerAuth('Authorization'),
    ApiHeader({
      required: true,
      name: 'Authorization',
      description: 'Bearer JWT Token'
    })
  );
};
