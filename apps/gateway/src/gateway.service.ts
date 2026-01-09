import { HttpStatus, Injectable, LoggerService } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AccessRecordRepository } from './entities';
import { Request } from 'express';
import { CusLoggerDecorator } from '@app/common/public/decorator/index.decorator';

@Injectable()
export class GatewayService {
  @CusLoggerDecorator()
  private readonly logger: LoggerService;

  constructor(
    private readonly httpService: HttpService,
    private readonly accessRecordRepository: AccessRecordRepository
  ) {}

  // 判断接口是否可用
  async checkApiAvailability(url: string): Promise<boolean> {
    try {
      const response = await this.httpService.get(url).toPromise();
      if (response.status === HttpStatus.OK) {
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }

  // 储存接口访问记录到数据库
  saveApiAccessRecord(req: Request, data: any) {
    const { method, originalUrl, body, query, headers } = req;

    const forwardedFor = req.headers['x-forwarded-for'] as string;
    const ip = forwardedFor ? forwardedFor.split(',')[0] : req.ip;
    const clientIp = ip.slice(ip.lastIndexOf(':') + 1);
    const [serviceName, ...uriList] = originalUrl.replace('/api/', '').split('/');

    // 存储到数据库
    this.accessRecordRepository.save({
      serviceName,
      clientIp,
      uri: uriList.join('/'),
      method,
      header: JSON.stringify(headers),
      params: JSON.stringify({ ...query, ...body }),
      data: JSON.stringify(data)
    });
  }
}
