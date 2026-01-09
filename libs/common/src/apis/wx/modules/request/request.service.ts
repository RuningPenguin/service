import { Injectable, LoggerService } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { CusLoggerDecorator } from '@app/common/public/decorator/index.decorator';
import { CusHttpException } from '@app/common/public/custom/HttpException.custom';

@Injectable()
export class RequestService {
  @CusLoggerDecorator()
  private readonly logger: LoggerService;

  constructor(private readonly httpService: HttpService) {}

  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const res = await firstValueFrom(
        this.httpService.request({
          url: config.url,
          ...config
        })
      );
      if (res.data.errcode && res.data.errcode !== 0) {
        throw res.data;
      }
      return res.data;
    } catch (error: any) {
      this.logger.error(`「API REQUEST URL ${config.url}」 ${JSON.stringify(error)}`);
      throw CusHttpException.error(60024, error);
    }
  }
}
