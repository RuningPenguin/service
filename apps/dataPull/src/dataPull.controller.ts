import { Controller, Post, Body } from '@nestjs/common';
import { DataPullService } from './dataPull.service';
import { DataPullDto } from './dataPull.dto';

@Controller()
export class DataPullController {
  constructor(private readonly dataPullService: DataPullService) {}
  @Post()
  async getData(@Body() dataPullDto: DataPullDto) {
    await this.dataPullService.initConnections(dataPullDto);

    // const { accountIds, activeUsersLength } = await this.dataPullService.getActiveUser();
    // const { activeOwnerLength } = await this.dataPullService.getActiveOwner(accountIds);
    // const { handCotOrderSuccessLength } = await this.dataPullService.getHandChargeOrder();
    // const { cotOrderLength, cotOrderPeopleLength } = await this.dataPullService.getChargeOrder();
    // const privateCharge = await this.dataPullService.getPrivateCharge();
    // const repairOrder = await this.dataPullService.getRepairOrder();
    // const remoteRepairMsg = await this.dataPullService.getRemoteRepairOrder();
    // const getUserDataMsg = await this.dataPullService.getUserDataExcel();

    // const result = `
    //   ${dataPullDto.env}: ${this.dataPullService.firstDate} ~ ${this.dataPullService.lastDate}
    //
    //   mark: ${this.dataPullService.lastDate} 数据统计
    //   上周活跃用户数 ${activeUsersLength} 其中活跃车主人数 ${activeOwnerLength}
    //   私桩 上周 ${cotOrderPeopleLength} 个用户产生了 ${handCotOrderSuccessLength} 条手动充电 ${cotOrderLength - handCotOrderSuccessLength} 条预约充电
    //
    //   ${JSON.stringify(privateCharge)}
    //   ${JSON.stringify(repairOrder)}
    // `;

    // console.log(result);
    // console.log(remoteRepairMsg);
    // console.log(JSON.stringify(repairOrder));

    // return result;

    const getUserDataMsg = await this.dataPullService.getDataExcel();
    const repairOrder = await this.dataPullService.getRepairOrder();
    const res = `
    ${dataPullDto.env}: ${this.dataPullService.firstDate} ~ ${this.dataPullService.lastDate}
    ${JSON.stringify(repairOrder)}`;

    console.log(res);
    console.log(getUserDataMsg);

    return res;
  }
}
