import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { OssModule } from '@app/common/oss';

@Module({
  imports: [
    OssModule,
    MulterModule.register({
      storage: memoryStorage() // 使用内存存储，不保存到本地
    })
  ],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule {}

function memoryStorage(): any {
  return {
    _handleFile: (req, file, cb) => {
      const buffer = [];
      file.stream.on('data', (chunk) => {
        buffer.push(chunk);
      });
      file.stream.on('end', () => {
        const fileBuffer = Buffer.concat(buffer);
        cb(null, {
          buffer: fileBuffer,
          size: fileBuffer.length,
          originalname: file.originalname,
          mimetype: file.mimetype
        });
      });
      file.stream.on('error', cb);
    },
    _removeFile: (req, file, cb) => {
      cb(null);
    }
  };
}
