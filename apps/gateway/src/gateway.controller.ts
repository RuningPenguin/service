import { All, Controller, HttpException, LoggerService, NotFoundException, RawBodyRequest, Req } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { GatewayService } from './gateway.service';
import { CusLoggerDecorator } from '@app/common/public/decorator/index.decorator';
import * as FormData from 'form-data';
import { AxiosRequestConfig } from 'axios';

@Controller('api')
export class GatewayController {
  @CusLoggerDecorator()
  private readonly logger: LoggerService;

  private readonly routeMap = {
    '/api/user': 3001,
    '/api/food': 3002,
    '/api/system': 3033,
    '/api/ledger': 3003
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly gatewayService: GatewayService
  ) {}

  @All('*')
  async proxyRequest(@Req() req: RawBodyRequest<Request>) {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const url = this.getTargetUrl(req.originalUrl);

    this.logger.log(`「gateway」: 网关正在将请求从 ${fullUrl} 代理到 ${url}`);

    // 检查接口是否可用
    // const isAvailable = await this.gatewayService.checkApiAvailability(url);
    // if (!isAvailable) {
    //   throw new HttpException(`Not Found HOST: ${url}`, HttpStatus.SERVICE_UNAVAILABLE);
    // }

    try {
      let requestOptions: AxiosRequestConfig = {};

      if (req.is('multipart/form-data')) {
        // 特殊处理文件上传
        requestOptions = this.handleFileUpload(req, url);
      } else {
        requestOptions = this.getRequestOptions(req, url);
      }

      this.logger.log(
        `「gateway」: 代理请求: ${JSON.stringify({
          ...requestOptions,
          data: requestOptions?.data instanceof FormData ? '[FormData]' : requestOptions.data
        })}`
      );
      const response = await firstValueFrom(this.httpService.request(requestOptions));

      this.logger.log(`「gateway」: 代理响应: ${JSON.stringify(response.data)}`);
      this.gatewayService.saveApiAccessRecord(req, response.data);

      return response.data;
    } catch (error) {
      this.logger.error(`「gateway」: 网关请求错误: ${JSON.stringify(error)}`);
      throw new HttpException(
        {
          message: error.message,
          error: error.response?.data || '未知错误'
        },
        error.response?.status || 500
      );
    }
  }

  private getTargetUrl(originalUrl: string): string {
    for (const [prefix, port] of Object.entries(this.routeMap)) {
      if (originalUrl.startsWith(prefix)) {
        const host = this.configService.get('SERVICE_HOST');
        const urlObj = new URL(`${host}${originalUrl}`); // 利用 URL 解析 query
        const path = urlObj.pathname.replace(prefix, '');
        return `${host}:${port}${path}`;
      }
    }
    throw new NotFoundException(`Not Found API: ${originalUrl}`);
  }

  private cleanHeaders(headers: any) {
    const result = { ...headers };
    // 移除可能引起问题的头
    delete result['content-length'];
    delete result['host'];
    return result;
  }

  private getRequestOptions(req: Request, url: string) {
    const { method, body, query, headers } = req;
    delete headers['content-length'];
    delete headers['host'];
    return {
      method,
      url,
      data: body,
      params: query,
      headers: this.cleanHeaders(headers)
    };
  }

  private handleFileUpload(req: Request, targetUrl: string) {
    const formData = new FormData();

    // 加入普通字段
    for (const [key, value] of Object.entries(req.body)) {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    }

    // 加入上传的文件
    if (Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        formData.append(file.fieldname, file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype
        });
      }
    }

    // 获取正确的headers
    const headers = {
      ...this.cleanHeaders(req.headers),
      ...formData.getHeaders(),
      'Content-Length': formData.getLengthSync().toString()
    };

    return {
      method: req.method,
      url: targetUrl,
      data: formData,
      headers,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    };
  }
}
