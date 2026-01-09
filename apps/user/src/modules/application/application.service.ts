import { Injectable } from '@nestjs/common';
import { ApplicationEntity, ApplicationRepository } from '@user/entities';
import { BaseService } from '@app/common/utils/crud/crud.service';

@Injectable()
export class ApplicationService extends BaseService<ApplicationEntity> {
  constructor(private readonly applicationRepository: ApplicationRepository) {
    super(applicationRepository);
  }

  // async add(addApplicationDto: AddApplicationDto) {
  //   // 验证角色名称或者code是否已存在
  //   const ApplicationData: ApplicationEntity = await this.applicationRepository.findOne({
  //     where: [{ name: addApplicationDto.name }, { code: addApplicationDto.code }]
  //   });
  //
  //   if (ApplicationData) {
  //     throw CusHttpException.error(CustomErrorCode['61202'], CustomErrorMsgMap['61202']);
  //   }
  //
  //   return this.applicationRepository.save(addApplicationDto);
  // }
  //
  // async update(updateApplicationDto: UpdateApplicationDto) {
  //   // 验证id是否存在
  //   const ApplicationData: ApplicationEntity = await this.applicationRepository.findOne({
  //     where: { id: updateApplicationDto.id }
  //   });
  //
  //   if (!ApplicationData) {
  //     throw CusHttpException.error(CustomErrorCode['61201'], CustomErrorMsgMap['61201']);
  //   }
  //
  //   return this.applicationRepository.update(updateApplicationDto.id, updateApplicationDto);
  // }
  //
  // async delete(deleteApplicationDto: DeleteApplicationDto) {
  //   // 校验应用是否存在
  //   const ApplicationData: ApplicationEntity = await this.applicationRepository.findOneBy({
  //     id: deleteApplicationDto.id
  //   });
  //
  //   if (!ApplicationData) {
  //     throw CusHttpException.error(CustomErrorCode['61201'], CustomErrorMsgMap['61201']);
  //   }
  //
  //   return this.applicationRepository.softDeleteWithRelations(Number(deleteApplicationDto.id), [
  //     { entity: UserApplicationEntity, field: 'application_id' }
  //   ]);
  // }
  //
  // async findList(applicationListPageDto: ApplicationListPageDto) {
  //   const { page, size } = applicationListPageDto;
  //   const [list, total] = await this.applicationRepository.findAndCount({
  //     skip: (page - 1) * size,
  //     take: size
  //   });
  //
  //   return {
  //     list,
  //     total,
  //     page,
  //     size
  //   };
  // }
}
