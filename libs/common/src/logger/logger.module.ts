import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as moment from 'moment-timezone';

// 时间格式
const timestampFormat = () => moment().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');

const winstonFormatPrintf = (config: any) => {
  const { timestamp, level, message, context, stack } = config;
  return `${timestamp} ${level}:[${context}] ${message} ${stack ? `\n${stack}` : ''}`;
};

@Global()
@Module({})
export class LoggerModule {
  static forRoot(serviceName?: string) {
    const dirname = serviceName ? `logs/${serviceName}` : 'logs';

    return WinstonModule.forRoot({
      format: winston.format.combine(winston.format.timestamp({ format: timestampFormat })),
      transports: [
        // 控制台输出
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf((config) => winstonFormatPrintf(config))
          )
        }),
        // error 级别日志单独存储
        new winston.transports.DailyRotateFile({
          level: 'error',
          dirname,
          filename: '%DATE%-error.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(winston.format.printf((config) => winstonFormatPrintf(config)))
        }),
        // 其他日志存储在同一个文件
        new winston.transports.DailyRotateFile({
          dirname,
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(winston.format.printf((config) => winstonFormatPrintf(config)))
        })
      ]
    });
  }
}
