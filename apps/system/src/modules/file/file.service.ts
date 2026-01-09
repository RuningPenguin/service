import { Injectable } from '@nestjs/common';
import { OssService } from '@app/common/oss';

@Injectable()
export class FileService {
  constructor(private readonly ossService: OssService) {}
  async uploadImg(file: Express.Multer.File) {
    try {
      const result = await this.ossService.uploadImage(file);
      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        resourceType: result.resource_type
      };
    } catch (error) {
      throw new Error(`上传到Cloudinary失败: ${error.message}`);
    }
  }
}
