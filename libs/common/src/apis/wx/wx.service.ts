import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Code2SessionDto } from './dto/res-wx.dto';
import { RequestService } from './modules/request/request.service';

@Injectable()
export class WxService {
  constructor(
    private readonly requestService: RequestService,
    private readonly configService: ConfigService
  ) {}

  // 小程序登录
  async code2Session(code: string): Promise<Code2SessionDto> {
    const requestParams = {
      appid: this.configService.get<string>('WECHAT_APPID'),
      secret: this.configService.get<string>('WECHAT_SECRET'),
      js_code: code,
      grant_type: 'authorization_code'
    };
    return this.requestService.request<Code2SessionDto>({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      method: 'GET',
      params: requestParams
    });
  }
}
