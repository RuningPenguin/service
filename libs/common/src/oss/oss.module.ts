import { Module } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { OssService } from './oss.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    OssService,
    {
      provide: 'CLOUDINARY',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return cloudinary.config({
          cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get('CLOUDINARY_API_KEY'),
          api_secret: configService.get('CLOUDINARY_API_SECRET')
        });
      }
    }
  ],
  exports: [OssService]
})
export class OssModule {}
