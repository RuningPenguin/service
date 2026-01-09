import { Module } from '@nestjs/common';
import { SysService } from './sys.service';
import { SysController } from './sys.controller';
import { ApplicationRepository, UserApplicationRepository, UserRepository } from '@user/entities';
import { AuthModule } from '@app/common';
import { WxModule } from '@app/common/apis/wx';

@Module({
  imports: [AuthModule, WxModule],
  controllers: [SysController],
  providers: [SysService, UserRepository, ApplicationRepository, UserApplicationRepository]
})
export class SysModule {}
