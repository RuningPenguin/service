import { Module } from '@nestjs/common';
import { AdminBaseClassifyService } from './admin-base-classify.service';
import { AdminBaseClassifyController } from './admin-base-classify.controller';
import { AuthModule } from '@app/common';
import { AdminBaseClassifyRepository } from '../../entities/admin-base-classify';

@Module({
  imports: [AuthModule],
  controllers: [AdminBaseClassifyController],
  providers: [AdminBaseClassifyService, AdminBaseClassifyRepository]
})
export class AdminBaseClassifyModule {}
