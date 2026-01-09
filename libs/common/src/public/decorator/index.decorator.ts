import { Logger } from '@nestjs/common';

/**
 * Logger 装饰器
 * @param {string} context 上下文
 * @example
 *   @CusLoggerDecorator(Service.name)
 *   private readonly logger: LoggerService;
 */
export function CusLoggerDecorator(context?: string) {
  return function (target: any, key: string) {
    const loggerKey = `__logger_${key}`;

    Object.defineProperty(target, key, {
      get() {
        if (!this[loggerKey]) {
          // 创建 Logger 实例并设置上下文
          const className = context || target.constructor.name;
          this[loggerKey] = new Logger(className);
        }
        return this[loggerKey];
      }
    });
  };
}
