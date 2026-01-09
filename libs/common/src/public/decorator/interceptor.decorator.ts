import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiExtraModels, ApiHeader, ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ClassConstructor } from 'class-transformer';

export class ApiOkResponseRes {
  @ApiProperty({ example: 0 })
  code: number;

  @ApiProperty()
  data: any;

  @ApiProperty({ example: 'success' })
  message: string;

  @ApiProperty({ example: '/api/user/list' })
  path: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  timestamp: string;
}

export interface ReturnTypeOptions {
  isArray?: boolean;
  isBoolean?: boolean;
}

const getPropertiesData = (type: ClassConstructor<any>, options?: ReturnTypeOptions) => {
  if (options?.isArray) {
    return {
      type: 'array',
      items: { $ref: getSchemaPath(type) }
    };
  }

  if (options?.isBoolean) {
    return { type: 'boolean' };
  }

  return { $ref: getSchemaPath(type) };
};

// 自定义 返回值类型
export const RETURN_TYPE = Symbol('return_type');
export const CusReturnType = (type: ClassConstructor<any>, options?: ReturnTypeOptions) => {
  return applyDecorators(
    SetMetadata(RETURN_TYPE, { type, options }),
    ApiExtraModels(ApiOkResponseRes, ...(options?.isBoolean ? [] : [type])),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          code: { type: 'number', example: 0 },
          message: { type: 'string', example: 'success' },
          path: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          data: getPropertiesData(type, options)
        }
      }
    })
  );
};

// 自定义 请求头
export const CUS_HEADER_KEY = Symbol('cus_header_fields');
export const CusHeader = (fields: string[] = ['appCode']) => {
  return applyDecorators(
    SetMetadata(CUS_HEADER_KEY, fields),

    ...fields.map((field) =>
      ApiHeader({
        name: field,
        description: `${field} 请求头`,
        required: true,
        example: 'admin'
      })
    )
  );
};
