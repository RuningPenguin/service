/**
 * 自定义错误代码从60000开始~69999
 * 60000 位默认错误代码
 */
import { HttpException } from '@nestjs/common';

interface ErrorType {
  code: number;
  data: any;
  message: string;
}

const CustomHttpStatus = {
  60024: 624 // 第三方接口异常
};

const CustomErrorType = {
  60001: {
    code: 60001,
    data: null,
    message: 'token已过期'
  },
  60024: {
    code: 60024,
    data: null,
    message: 'API 请求异常'
  }
};

export const CustomErrorMsgMap = {
  60001: 'token已过期',
  60024: 'API 请求异常',
  60998: '数据不存在',
  60999: '数据已存在',
  // user 服务自定义错误码
  // sys
  61000: 'user Internal server error',
  61001: '用户名已存在',
  61002: '用户不存在',
  61003: '账号或密码错误',
  61004: '非应用用户，无法登录',
  61201: '应用不存在',
  61202: '应用名称或应用code已存在',
  61203: '应用code存在非法数据',
  // user end
  // food 服务自定义错误码
  62000: 'food Internal server error',
  62001: '分类已存在',
  62002: '分类不存在',
  62003: '无分类数据',
  // food end
  // ledger 服务自定义错误码
  63000: 'ledger Internal server error',
  63001: '账单分类已存在',
  63002: '账单分类不存在',
  63101: '账单记录不存在',
  63201: '无该账本权限',
  63202: '已加入改账本'
  // ledger end
};

type CustomErrorCodeType = keyof typeof CustomErrorType | keyof typeof CustomErrorMsgMap;

export const CustomErrorCode: { [K in CustomErrorCodeType]: K } = Object.assign(
  {},
  ...Object.keys(CustomErrorType).map((k) => ({ [k]: Number(k) })),
  ...Object.keys(CustomErrorMsgMap).map((k) => ({ [k]: Number(k) }))
);

export class CusHttpException {
  static get(code: number): ErrorType {
    return CustomErrorType[code] || { code, data: null, message: CustomErrorMsgMap[code] || '' };
  }

  static getStatus(code: number): number {
    return CustomHttpStatus[code] || 200;
  }

  static error(code: string | number | object | CustomErrorCodeType, message?: string): HttpException {
    switch (typeof code) {
      case 'number':
        return new HttpException({ ...CusHttpException.get(code), message }, CusHttpException.getStatus(code));
      case 'string':
        return new HttpException({ code: 60000, data: null, message: code }, 200);
      case 'object':
        return new HttpException({ ...code, code: 60000 }, 200);
      default:
    }
  }
}
