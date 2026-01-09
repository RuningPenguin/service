import { Injectable } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { createConnections, DataSource, getConnection } from 'typeorm';
import { Workbook } from 'exceljs';
import { DataPullDto } from './dataPull.dto';

@Injectable()
export class DataPullService {
  public firstDate: string;
  public lastDate: string;
  public connection: DataSource[];
  public connectionAU: DataSource;
  public connectionBASIC: DataSource;
  public connectionBACKEND: DataSource;
  public connectionEV: DataSource;
  public connectionCOT: DataSource;

  // data转excl数据格式
  private data2Excel(data: any[]) {
    const res = [];
    const columns = Object.keys(data[0]);
    res.push(columns);
    data.forEach((item: object) => {
      const row = [];
      columns.forEach((key) => {
        row.push(item[key]);
      });
      res.push(row);
    });
    return res;
  }

  // 初始化数据库连接
  async initConnections(dataPullDto: DataPullDto) {
    this.firstDate = dataPullDto.startTime;
    this.lastDate = dataPullDto.endTime;
    if (!this.connection) {
      const databaseConfig: DataSourceOptions = {
        type: 'postgres',
        host: dataPullDto.env === 'dev' ? '10.109.164.27' : '10.124.140.89',
        port: dataPullDto.env === 'dev' ? 54321 : 5432,
        username: 'postgres',
        password: 'password#123',
        synchronize: false,
        logging: true
      };
      this.connection = await createConnections([
        {
          name: 'au',
          database: 'au',
          ...databaseConfig
        },
        {
          name: 'basic',
          database: 'basic',
          ...databaseConfig
        },
        {
          name: 'ev',
          database: 'ev',
          ...databaseConfig
        },
        {
          name: 'backend',
          database: 'backend',
          ...databaseConfig
        },
        {
          name: 'cot',
          database: 'cot',
          ...databaseConfig
        }
      ]);
      this.connectionAU = getConnection('au');
      this.connectionBASIC = getConnection('basic');
      this.connectionBACKEND = getConnection('backend');
      this.connectionEV = getConnection('ev');
      this.connectionCOT = getConnection('cot');
    }
  }

  // 查询活跃用户
  async getActiveUser() {
    console.log('查询活跃用户');
    const activeUserQuery = `
      SELECT DISTINCT ON
        ("AU_AccessRecord".user_id) "AU_AccessRecord".user_id AS ID, "AU_GenesisAccount"."id" AS account_id 
      FROM "AU_AccessRecord" INNER JOIN "AU_GenesisAccount" ON "AU_GenesisAccount"."user_id" = "AU_AccessRecord"."user_id" 
      WHERE 
        "AU_AccessRecord".created_at > '${this.firstDate}' 
        AND "AU_AccessRecord".created_at < '${this.lastDate}'
        AND "AU_GenesisAccount".is_deleted = FALSE`;
    const activeUsers = await this.connectionAU.query(activeUserQuery);
    const accountIds = activeUsers.map((user: { account_id: any }) => user.account_id);
    const activeUsersLength = accountIds.length;
    console.log(`活跃用户数：${activeUsersLength}`);
    return { accountIds, activeUsersLength };
  }

  // 查询活跃车主用户
  async getActiveOwner(accountIds: string[]) {
    console.log('查询活跃车主用户');
    if (!accountIds.length) return { activeOwnerLength: 0 };
    const activeOwnerQuery = `
      SELECT DISTINCT ON ("BASIC_VehiclePeople"."account_id") "BASIC_VehiclePeople"."id" AS "VehiclePeopleId",
        "BASIC_GenesisAccount"."id" AS "AccountId", "BASIC_VehiclePeople"."relationto_vehicle" AS "RelationtoVehicle" 
      FROM "BASIC_GenesisAccount" INNER JOIN "BASIC_VehiclePeople" ON "BASIC_GenesisAccount"."id" = "BASIC_VehiclePeople".account_id 
      WHERE
        "BASIC_GenesisAccount".is_deleted = FALSE 
        AND "BASIC_VehiclePeople"."relationto_vehicle" = 'Owner'
        AND "BASIC_VehiclePeople"."account_id" IN (${accountIds.map((item) => `'${item}'`).join(',')})`;
    const activeOwner = await this.connectionBASIC.query(activeOwnerQuery);
    const activeOwnerLength = activeOwner.length;
    console.log(`活跃车主用户数：${activeOwnerLength}`);
    return { activeOwnerLength };
  }

  // 查询私桩充电订单
  async getChargeOrder() {
    console.log('查询私桩充电订单');
    // const cotOrderQuery = `
    //   SELECT*FROM "EV_ChargeOrder" WHERE
    //   is_deleted=FALSE AND
    //   people_pile_id LIKE '%a%' AND
    //   created_at> '${this.firstDate}' AND
    //   created_at< '${this.lastDate}'
    // `;
    const cotOrderQuery = `
      SELECT*FROM "EV_ChargeOrder" WHERE 
      is_deleted=FALSE AND 
      people_pile_id LIKE '%a%' AND 
      created_at< '${this.lastDate}'
    `;
    const cotOrder = await this.connectionEV.query(cotOrderQuery);
    const cotOrderAccountIdList = cotOrder.map((item: { account_id: any }) => item.account_id);
    const cotOrderPeopleLength = Array.from(new Set(cotOrderAccountIdList)).length;
    const cotOrderLength = cotOrderAccountIdList.length;
    console.log(`私桩充电订单数：${cotOrderLength}, 私桩充电人数: ${cotOrderPeopleLength}`);
    return { cotOrderLength, cotOrderPeopleLength, cotOrder };
  }

  // 查询手动充电订单
  async getHandChargeOrder() {
    console.log('查询手动充电订单');
    // const handCotOrderQuery = `
    //   SELECT * FROM "AU_AccessRecord" WHERE uri = '/ev/api/charge/startCharge'
    //   AND "data" like '%"code":0%"errorMessage":""%'
    //   AND created_at > '${this.firstDate}' AND created_at < '${this.lastDate}'`;
    const handCotOrderQuery = `
      SELECT * FROM "AU_AccessRecord" WHERE uri = '/ev/api/charge/startCharge'
      AND "data" like '%"code":0%"errorMessage":""%' AND created_at < '${this.lastDate}'`;
    const handCotOrder = await this.connectionAU.query(handCotOrderQuery);
    const handCotOrderList = handCotOrder
      .map((item: { data: string }) => {
        const data = item.data ? JSON.parse(item.data) : {};
        return data.code === 0 && data.data.ChargeOrderId;
      })
      .filter((v: any) => v);
    const handCotOrderSuccessLength = handCotOrderList.length;
    console.log(`手动充电订单数：${handCotOrderSuccessLength}`);
    return { handCotOrderSuccessLength, handCotOrderList };
  }

  // 私桩充电统计
  async getPrivateCharge() {
    console.log('查询私桩充电统计');
    const privateChargeQuery = `
      select * from (select COUNT (*) 
      预约充电总数,COUNT (case when "EV_ChargeReserve".active = 1 then '1' end) 
      开启预约数, COUNT (case when "EV_ChargeReserve".active = 0 then '1' end) 
      关闭预约数 from "EV_ChargeReserve" where "EV_ChargeReserve".is_deleted = false and "EV_ChargeReserve".created_at < '${this.lastDate}') as A
      cross join (select COUNT (case when "EV_ChargeOrder".people_pile_id like '' then '1' end) 
      公桩充电订单数量, COUNT (case when "EV_ChargeOrder".people_pile_id like '%a%' then '1' end) 
      私桩充电订单数量 from "EV_ChargeOrder" where "EV_ChargeOrder".is_deleted = false
      and "EV_ChargeOrder".created_at > '2023-01-01'
      and "EV_ChargeOrder".created_at < '${this.lastDate}') as B
      cross join ( select COUNT (*) 
      人桩绑定数量 from "EV_PeoplePile" where "EV_PeoplePile".is_deleted = false and "EV_PeoplePile".created_at < '${this.lastDate}' ) as C cross join (select COUNT (*) 
      私桩总数 from "EV_Equipment" where "EV_Equipment".is_deleted = false and "EV_Equipment".station_id = '386760'
      and "EV_Equipment".created_at < '${this.lastDate}' ) as D`;
    const privateCharge = await this.connectionEV.query(privateChargeQuery);
    console.log('查询私桩充电统计数据:', privateCharge[0]);
    return privateCharge[0];
  }

  // 维修保养订单统计
  async getRepairOrder() {
    console.log('查询维修保养订单统计');
    const repairOrderQuery = `
      select * from (select COUNT (1) 
      总订单数, COUNT (case when "StatusCxp" = 'Closed' and "CloseReason" = 'Delivered' then '1' end) 
      完成总数, COUNT (case when "StatusCxp" = 'Closed' and "CloseReason" not like 'Delivered' then '1' end) 
      取消总数, COUNT (case when "StatusCxp" not like 'Closed' then '1' end) 
      进行中总数 from "TB_WSP_Appointment" where "TB_WSP_Appointment"."CreatedDate" < '${this.lastDate}') as A
      cross join (select COUNT (case when T.M > 0 then '1'end) 
      伙伴预约总数, COUNT (case when T.M = 0 then '1' end) 
      用户预约总数 from (select date_part( 'minute', "TB_WSP_Appointment"."CreationTime" :: TIMESTAMP - "TB_WSP_Appointment"."CreatedDate" :: TIMESTAMP ) as M
      from "TB_WSP_Appointment" where "TB_WSP_Appointment"."CreatedDate" < '${this.lastDate}') as T ) as B
    `;
    const repairOrder = await this.connectionBACKEND.query(repairOrderQuery);
    console.log('查询维修保养订单统计数据:', repairOrder[0]);
    return repairOrder[0];
  }

  // 获取异地保养订单并导出为excl
  async getRemoteRepairOrder() {
    console.log('查询异地维修保养订单');
    const remoteRepairOrderQuery = `
      select to_char("COT_ServiceOrder".created_at, 'YYYY-MM-DD HH24:MI:SS'::text) as created_time,
      "COT_ServiceOrder".id, "COT_ServiceOrder"."VIN", "COT_ServiceOrder".address, 
      "COT_ServiceOrder".contact_name, "COT_ServiceOrder".contact_phone, 
      "COT_ServiceOrder".city_name, "COT_ServiceOrder".province_name, "COT_ServiceOrder".service_type,
      (("COT_ServiceOrder".store_info ->> 0)::json) ->> 'Name'::text as name from "COT_Trade"
      join "COT_ServiceOrder" on "COT_Trade".service_order_id::text = "COT_ServiceOrder".id::text
      where "COT_Trade".trade_type = 2 and "COT_Trade"."created_at" < '${this.lastDate}'
    `;
    const remoteRepairOrder = await this.connectionCOT.query(remoteRepairOrderQuery);
    console.log('异地维修保养订单: end');
    return remoteRepairOrder;

    // const workbook = new Workbook();
    // const worksheet = workbook.addWorksheet('Sheet1');
    // const rows = this.data2Excel(remoteRepairOrder);
    // worksheet.addRows(rows);
    // await workbook.xlsx.writeFile(`logs/异地保养订单 ${this.lastDate}.xlsx`);
    //
    //
    // return '异地维修保养订单 导出成功!!';
  }

  // 获取异地保养订单并导出为excl
  async getRemoteRepairOrder2() {
    console.log('查询异地维修保养订单');
    const remoteRepairOrderQuery = `
      select to_char("COT_ServiceOrder".created_at, 'YYYY-MM-DD HH24:MI:SS'::text) as created_time,
      "COT_ServiceOrder".id, "COT_ServiceOrder"."VIN", "COT_ServiceOrder".address, 
      "COT_ServiceOrder".contact_name, "COT_ServiceOrder".contact_phone, 
      "COT_ServiceOrder".city_name, "COT_ServiceOrder".province_name, "COT_ServiceOrder".service_type,
      (("COT_ServiceOrder".store_info ->> 0)::json) ->> 'Name'::text as name from "COT_Trade"
      join "COT_ServiceOrder" on "COT_Trade".service_order_id::text = "COT_ServiceOrder".id::text
      where "COT_Trade".trade_type = 2 and "COT_Trade"."created_at" > '${this.firstDate}' and "COT_Trade"."created_at" < '${this.lastDate}'
    `;
    const remoteRepairOrder = await this.connectionCOT.query(remoteRepairOrderQuery);
    console.log('异地维修保养订单: end');
    return remoteRepairOrder;

    // const workbook = new Workbook();
    // const worksheet = workbook.addWorksheet('Sheet1');
    // const rows = this.data2Excel(remoteRepairOrder);
    // worksheet.addRows(rows);
    // await workbook.xlsx.writeFile(`logs/异地保养订单 ${this.lastDate}.xlsx`);
    //
    //
    // return '异地维修保养订单 导出成功!!';
  }

  // 获取用户数据
  private async getUserData() {
    console.log('查询用户数据');
    const userDataQuery = `
      select "AU_User".phone_number, "AU_User".email, "AU_User".nickname, "AU_User".type, "AU_User".created_at,
      "AU_WeChat".id as unionid, "AU_GenesisAccount".id as account_id, "AU_GenesisAccount".account_number
      from "AU_User" left join "AU_WeChat" on "AU_User".id = "AU_WeChat".user_id left join "AU_GenesisAccount" on
      "AU_User".id = "AU_GenesisAccount".user_id where "AU_User".is_deleted = false and "AU_User".type = 'wechat'
      and "AU_WeChat".is_deleted = false and "AU_GenesisAccount".is_deleted = false and "AU_User".created_at < '${this.lastDate}'
    `;
    const userData = await this.connectionAU.query(userDataQuery);
    console.log('用户数据: end');
    return userData;
  }

  // 获取人车关系
  private async getUserCar() {
    console.log('查询人车关系');
    const userCarQuery = `
      select distinct on ("BASIC_VehiclePeople"."account_id" ) "BASIC_VehiclePeople"."id" as "VehiclePeopleId",
      "BASIC_GenesisAccount"."id" as "AccountId", "BASIC_VehiclePeople"."relationto_vehicle" as "RelationtoVehicle"
      from "BASIC_GenesisAccount" inner join "BASIC_VehiclePeople" on "BASIC_GenesisAccount"."id" = "BASIC_VehiclePeople".account_id
      where "BASIC_GenesisAccount".is_deleted = false and "BASIC_VehiclePeople".is_deleted = false and "BASIC_GenesisAccount".created_at < '${this.lastDate}'
      order by "BASIC_VehiclePeople"."account_id", case "BASIC_VehiclePeople"."relationto_vehicle" when 'Owner' then 1 when 'Purchaser' then 2 when 'VehicleUser' then 3 else 4 end`;
    const userCar = await this.connectionBASIC.query(userCarQuery);
    console.log('人车关系: end');
    return userCar;
  }

  // 导出用户数据及人车关系出为excl
  async getUserDataExcel() {
    console.log('查询用户数据及人车关系');
    const userData = await this.getUserData();
    const carData = await this.getUserCar();
    userData.forEach((user) => {
      user['RelationtoVehicle'] = 'null';
      carData.forEach((car) => {
        if (car.AccountId === user.account_id) {
          user['RelationtoVehicle'] = car.RelationtoVehicle;
        }
      });
    });
    console.log('用户数据及人车关系: end');
    return userData;
    // const workbook = new Workbook();
    // const worksheet = workbook.addWorksheet('Sheet1');
    // const rows = this.data2Excel(userData);
    // worksheet.addRows(rows);
    // await workbook.xlsx.writeFile(`logs/用户数据 ${this.lastDate}.xlsx`);
    //
    // console.log('用户数据及人车关系 导出成功!!');
    //
    // return '用户数据及人车关系 导出成功!!';
  }

  // 导出私桩充电订单及手动自动为excl
  async getChargeOrderExcel() {
    console.log('导出私桩充电订单及手动自动为excl');
    const { cotOrder } = await this.getChargeOrder();
    const { handCotOrderList } = await this.getHandChargeOrder();

    cotOrder.forEach((order) => {
      order['操作方式'] = 'null';
      if (handCotOrderList.includes(order.id)) {
        order['操作方式'] = '手动';
      } else {
        order['操作方式'] = '预约';
      }
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    const rows = this.data2Excel(cotOrder);
    worksheet.addRows(rows);
    await workbook.xlsx.writeFile(`logs/私桩充电订单 ${this.lastDate}.xlsx`);

    console.log('私桩充电订单及手动自动 导出成功!!');

    return '私桩充电订单及手动自动 导出成功!!';
  }

  // 用户预约明细
  async getUserReservation() {
    console.log('查询用户预约明细');
    const query = `
     SELECT "VehicleUserId" 用户,"CreatedDate" 创建时间,"VIN","ContactName" 联系人,"ContactPhone" 联系电话,"CustomerRequest" 用户需求,"ServiceType" 服务类型,
 ( 
    case
   when "StatusCxp" = 'Closed'
   and "CloseReason" = 'Delivered' and "Scoring" is null then '完成'
   when "StatusCxp" = 'Closed'
   and "CloseReason" not like 'Delivered' then '取消'
   when "StatusCxp" not like 'Closed' then '进行中'
   when "StatusCxp" = 'Closed'
   and "CloseReason" = 'Delivered' and "Scoring" is not null then '已评价'
  end 
 ) 状态 from
  "TB_WSP_Appointment"
 where
  "TB_WSP_Appointment"."CreatedDate" > '${this.firstDate}'
 and
 "TB_WSP_Appointment"."CreatedDate" < '${this.lastDate}'
 and 
 date_part('minute', "TB_WSP_Appointment"."CreationTime" :: TIMESTAMP - "TB_WSP_Appointment"."CreatedDate" :: TIMESTAMP ) = 0
 order by "TB_WSP_Appointment"."CreatedDate" DESC
    `;
    const data = await this.connectionBACKEND.query(query);
    console.log('用户预约明细: end');
    return data;
  }

  // 用户预约明细
  async getUserReservation2() {
    console.log('查询用户预约明细');
    const query = `
     SELECT "VehicleUserId" 用户,"CreatedDate" 创建时间,"VIN","ContactName" 联系人,"ContactPhone" 联系电话,"CustomerRequest" 用户需求,"ServiceType" 服务类型,
 ( 
    case
   when "StatusCxp" = 'Closed'
   and "CloseReason" = 'Delivered' and "Scoring" is null then '完成'
   when "StatusCxp" = 'Closed'
   and "CloseReason" not like 'Delivered' then '取消'
   when "StatusCxp" not like 'Closed' then '进行中'
   when "StatusCxp" = 'Closed'
   and "CloseReason" = 'Delivered' and "Scoring" is not null then '已评价'
  end 
 ) 状态 from
  "TB_WSP_Appointment"
 where
 "TB_WSP_Appointment"."CreatedDate" < '${this.lastDate}'
 and 
 date_part('minute', "TB_WSP_Appointment"."CreationTime" :: TIMESTAMP - "TB_WSP_Appointment"."CreatedDate" :: TIMESTAMP ) = 0
 order by "TB_WSP_Appointment"."CreatedDate" DESC
    
    `;
    const data = await this.connectionBACKEND.query(query);
    console.log('用户预约明细: end');
    return data;
  }

  // 伙伴预约明细
  async getPartnerAppointment() {
    console.log('查询伙伴预约明细');
    const query = `SELECT "VehicleUserId" 用户,"CreatedDate" 创建时间,"VIN","ContactName" 联系人,"ContactPhone" 联系电话,"CustomerRequest" 用户需求,"ServiceType" 服务类型,
 ( 
    case
   when "StatusCxp" = 'Closed'
   and "CloseReason" = 'Delivered' and "Scoring" is null then '完成'
   when "StatusCxp" = 'Closed'
   and "CloseReason" not like 'Delivered' then '取消'
   when "StatusCxp" not like 'Closed' then '进行中'
   when "StatusCxp" = 'Closed'
   and "CloseReason" = 'Delivered' and "Scoring" is not null then '已评价'
  end 
 ) 状态 from
  "TB_WSP_Appointment"
 where
  "TB_WSP_Appointment"."CreatedDate" > '${this.firstDate}'
 and "TB_WSP_Appointment"."CreatedDate" < '${this.lastDate}'
 and date_part('minute', "TB_WSP_Appointment"."CreationTime" :: TIMESTAMP - "TB_WSP_Appointment"."CreatedDate" :: TIMESTAMP ) >0
 order by "TB_WSP_Appointment"."CreatedDate" DESC
    `;
    const data = await this.connectionBACKEND.query(query);
    console.log('伙伴预约明细: end');
    return data;
  }

  // 伙伴预约明细
  async getPartnerAppointment2() {
    console.log('查询伙伴预约明细');
    const query = `SELECT "VehicleUserId" 用户,"CreatedDate" 创建时间,"VIN","ContactName" 联系人,"ContactPhone" 联系电话,"CustomerRequest" 用户需求,"ServiceType" 服务类型,(CASE WHEN "StatusCxp"='Closed' AND "CloseReason"='Delivered' AND "Scoring" IS NULL THEN '完成' WHEN "StatusCxp"='Closed' AND "CloseReason" NOT LIKE 'Delivered' THEN '取消' WHEN "StatusCxp" NOT LIKE 'Closed' THEN '进行中' WHEN "StatusCxp"='Closed' AND "CloseReason"='Delivered' AND "Scoring" IS NOT NULL THEN '已评价' END) 状态 FROM "TB_WSP_Appointment" WHERE "TB_WSP_Appointment"."CreatedDate"< '${this.lastDate}' AND date_part('minute',"TB_WSP_Appointment"."CreationTime" :: TIMESTAMP-"TB_WSP_Appointment"."CreatedDate" :: TIMESTAMP)> 0 ORDER BY "TB_WSP_Appointment"."CreatedDate" DESC`;
    const data = await this.connectionBACKEND.query(query);
    console.log('伙伴预约明细: end');
    return data;
  }

  // 预约充电明细
  async getAppointmentCharge() {
    console.log('查询预约充电明细');
    const query = `SELECT A.start_time 开始时间,A.end_time 结束时间,A.active 是否有效,b.account_id 用户ID,A.created_at 创建时间 FROM "EV_ChargeReserve" A LEFT JOIN "EV_PeoplePile" b ON A.equipment_id=b.equipment_id WHERE A.is_deleted=FALSE AND A.created_at>='${this.firstDate}' AND A.created_at<='${this.lastDate}'`;
    const data = await this.connectionEV.query(query);
    console.log('预约充电明细: end');
    return data;
  }

  // 绑桩数据
  async getEquipment() {
    console.log('查询绑桩数据');
    const query = `SELECT account_id 用户ID,equipment_id 设备ID,created_at 创建时间 FROM "EV_PeoplePile" A WHERE A.is_deleted='f' AND created_at< '${this.lastDate}'`;
    const data = await this.connectionEV.query(query);
    console.log('绑桩数据: end');
    return data;
  }

  // 绑桩数据
  async getEquipment2() {
    console.log('查询绑桩数据');
    const query = `SELECT account_id 用户ID,equipment_id 设备ID,created_at 创建时间 FROM "EV_PeoplePile" A WHERE A.is_deleted='f' AND created_at > '${this.firstDate}' AND created_at < '${this.lastDate}'`;
    const data = await this.connectionEV.query(query);
    console.log('绑桩数据: end');
    return data;
  }

  // 导出
  async getDataExcel() {
    const time = `${this.firstDate} ~ ${this.lastDate}`;
    const allTime = `截止到${this.lastDate}`;
    const statusList = [];
    const UserReservation = await this.getUserReservation();
    // const UserReservation2 = await this.getUserReservation2();
    const PartnerAppointment = await this.getPartnerAppointment();
    // const PartnerAppointment2 = await this.getPartnerAppointment2();
    const AppointmentCharge = await this.getAppointmentCharge();
    const Equipment = await this.getEquipment();
    const Equipment2 = await this.getEquipment2();
    // const RemoteRepairOrder = await this.getRemoteRepairOrder();
    const RemoteRepairOrder2 = await this.getRemoteRepairOrder2();
    const UserData = await this.getUserDataExcel();
    statusList.push(await this.excel(`异地保养订单 ${time}`, RemoteRepairOrder2));
    statusList.push(await this.excel(`伙伴预约 ${time}`, PartnerAppointment));
    statusList.push(await this.excel(`用户预约 ${time}`, UserReservation));
    statusList.push(await this.excel(`预约充电 ${time}`, AppointmentCharge));
    statusList.push(await this.excel(`人桩绑定 ${time}`, Equipment2));

    // statusList.push(await this.excel(`异地保养订单 ${allTime}`, RemoteRepairOrder));

    // statusList.push(await this.excel(`用户预约明细 ${allTime}`, UserReservation2));
    // statusList.push(await this.excel(`伙伴预约明细 ${allTime}`, PartnerAppointment2));
    statusList.push(await this.excel(`用户数据 ${allTime}`, UserData));
    statusList.push(await this.excel(`人桩绑定 ${allTime}`, Equipment));
    console.log('😊😊导出成功!!😊😊', statusList);
    return statusList;
  }

  async excel(name, data) {
    if (data.length === 0 || !data) {
      const failText = `${data} ${typeof data}, ${data.toString()}`;
      return `❌ ${name} 导出失败!!  0 条数据, 「${failText}」`;
    }
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    const rows = this.data2Excel(data);
    worksheet.addRows(rows);
    await workbook.xlsx.writeFile(`logs/${name}.xlsx`);
    return `✅ ${name} 导出成功!! 共  ${data.length}  条数据`;
  }
}
