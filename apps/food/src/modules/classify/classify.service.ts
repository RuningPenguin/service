import { Injectable } from '@nestjs/common';
import { AddClassifyDto } from './dto/req-classify.dto';
import { UpdateClassifyDto } from './dto/update-classify.dto';
import { ClassifyRepository } from '@food/entities';
import { CusHttpException, CustomErrorCode, CustomErrorMsgMap } from '@app/common/public/custom/HttpException.custom';

@Injectable()
export class ClassifyService {
  constructor(private readonly classifyRepository: ClassifyRepository) {}

  // 添加分类
  async create(classifyDto: AddClassifyDto) {
    const classify = await this.classifyRepository.findOneBy({ name: classifyDto.name });
    if (classify) {
      throw CusHttpException.error(CustomErrorCode['62001'], CustomErrorMsgMap['62001']);
    }
    return await this.classifyRepository.save(classifyDto);
  }

  // 查询所有分类
  async findAll() {
    return this.classifyRepository.find();
  }

  // 查询分类下的所有菜品
  async findDishList() {
    return this.classifyRepository.find({
      where: { id: 1 },
      relations: ['dishes']
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} classify`;
  }

  update(id: number, updateClassifyDto: UpdateClassifyDto) {
    return `This action updates a #${id} classify`;
  }

  remove(id: number) {
    return `This action removes a #${id} classify`;
  }
}
