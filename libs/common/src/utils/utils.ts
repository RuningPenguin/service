import { join } from 'path';
import { readdirSync, statSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@app/common/auth';
import { ResponseInterceptor } from '@app/common/public/interceptor/response.interceptor';
import { UniqueConstraintFilter } from '@app/common/public/filters/uniqueConstraint.filter';
import { HttpExceptionFilter } from '@app/common/public/filters/httpException.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { setupSwagger } from '@app/common/utils/swagger.utils';
import { CusHeaderGuard } from '@app/common/public/guards/cusHeader.guard';

/**
 * 获取指定目录下的指定后缀文件
 * @param path {string} 目录路径
 * @param fileEnds {string | string[]} 文件后缀
 */
export const getModules = (path: string, fileEnds: string | string[]) => {
  if (!Array.isArray(fileEnds)) {
    fileEnds = [fileEnds];
  }
  const modules: any[] = [];
  const fileEndPattern = new RegExp(`(${fileEnds.map((ext) => `\\${ext}`).join('|')})$`);

  function isModuleFile(fileName: string): boolean {
    return fileEndPattern.test(fileName);
  }

  function readDirRecursively(directory: string) {
    const files = readdirSync(directory);

    files.forEach((file) => {
      const filePath = join(directory, file);

      if (statSync(filePath).isDirectory()) {
        // 如果是目录，递归读取子目录
        readDirRecursively(filePath);
      } else if (isModuleFile(file)) {
        // 如果是模块文件，动态导入
        const modulePath = filePath.replace(/\.ts$/, '').replace(/\.js$/, ''); // 去掉文件后缀
        const module = require(modulePath); // 导入模块
        const moduleName = Object.keys(module)[0]; // 获取模块名称
        modules.push(module[moduleName]); // 将模块添加到数组
      }
    });
  }

  readDirRecursively(path);
  return modules;
};

/**
 * 注册项目
 * @param Module
 */
export const registerProject = async (Module: any) => {
  const app = await NestFactory.create(Module);

  const configService = app.get(ConfigService);

  // app.use(poHttp());

  // 启用全局验证管道
  app.useGlobalPipes(
    // 参数验证
    new ValidationPipe({
      transform: true, // 自动将请求中的数据转换为指定的类实例
      whitelist: true // 去除 DTO 中没有定义的属性
    })
  );

  // 启用全局守卫
  app.useGlobalGuards(new JwtAuthGuard());

  // ✅ 使用 app.get 获取容器中的 CusHeaderGuard
  const reflector = app.get(Reflector);
  const cusHeaderGuard = new CusHeaderGuard(reflector);
  app.useGlobalGuards(cusHeaderGuard);

  // 启用全局拦截器
  // app.useGlobalInterceptors(app.get(ResponseInterceptor));
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 启用全局过滤器 数据库错误捕获 全局错误捕获
  app.useGlobalFilters(new UniqueConstraintFilter(), new HttpExceptionFilter());

  // 配置 swagger
  setupSwagger(app, configService.get('PROJECT_NAME'));

  // 启用全局日志
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(configService.get('PORT'));
};
