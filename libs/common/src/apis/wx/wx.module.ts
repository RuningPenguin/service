import { Module } from '@nestjs/common';
import { WxService } from './wx.service';
import { ConfigModule } from '@app/common';
import { RequestModule } from '@app/common/apis/wx/modules/request/request.module';

@Module({
  imports: [ConfigModule, RequestModule],
  providers: [WxService],
  exports: [WxService]
})
export class WxModule {}
