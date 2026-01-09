import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassifyService } from './classify.service';
import { AddClassifyDto } from './dto/req-classify.dto';
import { UpdateClassifyDto } from './dto/update-classify.dto';
import { ApiOperation } from '@nestjs/swagger';
import { CusReturnType } from '@app/common/public/decorator/interceptor.decorator';
import { ResClassifyDto } from './dto/res-classify.dto';

@Controller('classify')
export class ClassifyController {
  constructor(private readonly classifyService: ClassifyService) {}

  @ApiOperation({ summary: '添加分类' })
  @CusReturnType(ResClassifyDto)
  @Post('add')
  create(@Body() classifyDto: AddClassifyDto) {
    return this.classifyService.create(classifyDto);
  }

  @ApiOperation({ summary: '获取所有分类' })
  @Get('all')
  findAll() {
    return this.classifyService.findAll();
  }

  @ApiOperation({ summary: '获取分类下的所有菜品' })
  @Get('dish/list')
  findDishList() {
    return this.classifyService.findDishList();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classifyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassifyDto: UpdateClassifyDto) {
    return this.classifyService.update(+id, updateClassifyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classifyService.remove(+id);
  }
}
