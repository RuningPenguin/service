import { Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryUploadResponse, CloudinaryConfig } from './types/oss.types';
// import { Readable } from 'stream';

import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class OssService {
  constructor(@Inject('CLOUDINARY') private readonly cloudinaryConfig: any) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'your-folder-name', // 可选：指定Cloudinary中的文件夹
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  async uploadFile(file: any) {
    const uploadResult = await cloudinary.uploader
      .upload(
        'https://bkimg.cdn.bcebos.com/pic/d788d43f8794a4c236bdaed804f41bd5ac6e39a2?x-bce-process=image/format,f_auto/resize,m_lfit,limit_1,h_440',
        {
          public_id: 'shoes'
        }
      )
      .catch((error) => {
        console.log(error);
      });

    console.log(uploadResult);

    // console.log(uploadStream);
    // return new Promise((resolve, reject) => {
    //   const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
    //     if (error) return reject(error);
    //     resolve(result as any);
    //   });
    //
    //   Readable.from(file.buffer).pipe(uploadStream);
    // });
  }
  //
  // async uploadFromUrl(url: string): Promise<any> {
  //   return cloudinary.uploader.upload(url);
  // }
  //
  // async deleteFile(publicId: string): Promise<any> {
  //   return cloudinary.uploader.destroy(publicId);
  // }
}
