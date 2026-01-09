import { Injectable } from '@nestjs/common';
import { AddDishDto, DishListDto } from './dto/req-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { ClassifyRepository, DishRepository } from '@food/entities';
import { In, Raw } from 'typeorm';
import { CusHttpException, CustomErrorCode, CustomErrorMsgMap } from '@app/common/public/custom/HttpException.custom';

@Injectable()
export class DishService {
  constructor(
    private readonly dishRepository: DishRepository,
    private readonly classifyRepository: ClassifyRepository
  ) {}

  // 添加菜品
  async create(dishDto: AddDishDto) {
    const { classifyIds } = dishDto;
    let classIds = null;
    if (classifyIds) {
      const classIdList = await this.classifyRepository.find({ where: { id: In(dishDto.classifyIds) } });
      classIds = [...new Set(classIdList.map((item) => item.id))];
      // 未知的id
      const unNoId = dishDto.classifyIds.filter((id) => !classIds.includes(id));
      if (unNoId.length > 0) {
        throw CusHttpException.error(CustomErrorCode['62002'], CustomErrorMsgMap['62002']);
      }
    } else {
      const firstClassify = await this.classifyRepository.findOne({
        where: {},
        order: {
          id: 'ASC' // 按主键升序，取第一条
        }
      });

      if (!firstClassify) {
        throw CusHttpException.error(CustomErrorCode['62003'], CustomErrorMsgMap['62003']);
      }

      classIds = [firstClassify.id];
    }

    return this.dishRepository.save({ ...dishDto, classifyIds: classIds.join(',') });
  }

  async findAllByClassifyId(dishListDto: DishListDto) {
    const page = dishListDto.page;
    const size = dishListDto.size;

    let where = {};
    if (dishListDto.classifyIds) {
      where = dishListDto.classifyIds.map((id) => ({
        classifyIds: Raw((alias) => `FIND_IN_SET('${id}', ${alias}) > 0`)
      }));
    }
    // 查询列表
    const [list, total] = await this.dishRepository.findAndCount({
      where,
      skip: (page - 1) * size, // 跳过前面的分页数据
      take: size // 获取指定数量的数据
    });

    // const [list, total] = await this.dishRepository
    //   .createQueryBuilder('dish')
    //   .where('JSON_CONTAINS(dish.classifyIds, :classifyId)', { classifyId: JSON.stringify(dishListDto.classifyIds) })
    //   .skip((page - 1) * size) // 跳过前面的分页数据
    //   .take(size) // 获取指定数量的数据
    //   .getManyAndCount(); // 获取数据列表

    return { list, total, page, size };
  }

  async findOne(id: number | string) {
    return this.dishRepository.findOne({ where: { id: Number(id) } });
  }

  async update(id: number, updateDishDto: UpdateDishDto) {
    const dish = await this.dishRepository.findOne({ where: { id } });
    if (!dish) {
      throw CusHttpException.error(CustomErrorCode['62002'], CustomErrorMsgMap['62002']);
    }

    let classIds = null;

    if (updateDishDto.classifyIds && updateDishDto.classifyIds.length > 0) {
      const classIdList = await this.classifyRepository.find({ where: { id: In(updateDishDto.classifyIds) } });
      classIds = [...new Set(classIdList.map((item) => item.id))];
      const unNoId = updateDishDto.classifyIds.filter((id) => !classIds.includes(id));
      if (unNoId.length > 0) {
        throw CusHttpException.error(CustomErrorCode['62002'], CustomErrorMsgMap['62002']);
      }
    } else {
      // 不传 classifyIds 就保留原值
      classIds = dish.classifyIds?.split(',') || [];
    }

    // 更新字段
    await this.dishRepository.update(id, {
      ...updateDishDto,
      classifyIds: classIds.join(',')
    });

    return { message: '更新成功' };
  }

  remove(id: number) {
    return `This action removes a #${id} dish`;
  }
}
