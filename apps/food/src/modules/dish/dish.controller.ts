import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { DishService } from './dish.service';
import { AddDishDto, DetailDishDto, DishListDto } from './dto/req-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { ApiOperation } from '@nestjs/swagger';
import { CusIsAuth } from '@app/common';

@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @ApiOperation({ summary: '添加菜品' })
  @CusIsAuth()
  @Post('add')
  create(@Body() dishDto: AddDishDto) {
    return this.dishService.create(dishDto);
  }

  @ApiOperation({ summary: '获取菜品列表' })
  @Post('list')
  findAll(@Body() dishListDto: DishListDto) {
    return this.dishService.findAllByClassifyId(dishListDto);
  }

  @ApiOperation({ summary: '获取菜品详情' })
  @Get('detail')
  findOne(@Query() detailDishDto: DetailDishDto) {
    return this.dishService.findOne(detailDishDto.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新菜品' })
  @CusIsAuth()
  update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
    return this.dishService.update(+id, updateDishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dishService.remove(+id);
  }
}
