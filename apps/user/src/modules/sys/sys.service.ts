import { Injectable } from '@nestjs/common';
import { ApplicationRepository, UserApplicationRepository, UserEntity, UserRepository } from '@user/entities';
import { CreateUserDto, LoginDto, UpdateUserDto, UserAddApplicationDto, WechatLoginDto } from './dto/req-userinfo.dto';
import { AuthService, JwtPayload } from '@app/common';
import { WxService } from '@app/common/apis/wx';
import { CusHttpException, CustomErrorCode, CustomErrorMsgMap } from '@app/common/public/custom/HttpException.custom';
import { FindManyOptions, In } from 'typeorm';
import { BaseService } from '@app/common/utils/crud/crud.service';
import { LoginRes } from './dto/res-userinfo.dto';
import { BasePageDto } from '@app/common/public/dto/baseParams.dto';

@Injectable()
export class SysService extends BaseService<UserEntity> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userApplicationRepository: UserApplicationRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly authService: AuthService,
    private readonly wxService: WxService
  ) {
    super(userRepository);
  }

  // 生成 token
  public sign(user: UserEntity): string[] {
    const jwtPayload: JwtPayload = { id: user.id, username: user.username };
    return [this.authService.sign(jwtPayload)];
  }

  // 校验用户时候指定应用用户
  public async isUserApplication(userId: number, appCode: string): Promise<boolean> {
    // 校验用户是否绑定了该应用
    const userApp = await this.userApplicationRepository.findOne({
      where: {
        user: { id: userId },
        application: { code: appCode }
      },
      relations: ['application']
    });

    if (!userApp) {
      throw CusHttpException.error(CustomErrorCode['61004'], CustomErrorMsgMap['61004']);
    }

    return true;
  }

  // 应用id处理
  public async applicationHandle(userAddApplicationDto: UserAddApplicationDto): Promise<number[]> {
    const { applicationIds, applicationCodes } = userAddApplicationDto;

    // 1️⃣ 统一解析 applicationId 列表
    let finalApplicationIds: number[] = [];

    if (applicationIds?.length) {
      finalApplicationIds = applicationIds;
    }

    if (applicationCodes?.length) {
      const applications = await this.applicationRepository.find({
        where: { code: In(applicationCodes) },
        select: ['id']
      });

      if (applications.length !== applicationCodes.length) {
        throw CusHttpException.error(CustomErrorCode['61203'], CustomErrorMsgMap['61203']);
      }

      finalApplicationIds.push(...applications.map((app) => app.id));
    }

    // 去重
    return [...new Set(finalApplicationIds)];
  }

  // 给用户绑定应用
  public async userBindApplication(userAddApplicationDto: UserAddApplicationDto) {
    const finalApplicationIds = await this.applicationHandle(userAddApplicationDto);

    // 2️⃣ 构建中间表数据
    const relations = finalApplicationIds.map((appId) => ({
      user: { id: userAddApplicationDto.userId },
      application: { id: appId }
    }));

    // 3️⃣ 保存（可根据需要先 delete 再 save）
    // delete user_id = userAddApplicationDto.userId 的所有关联数据
    await this.userApplicationRepository.deleteByUserId(userAddApplicationDto.userId);
    return this.userApplicationRepository.save(relations);
  }

  // 登录
  async login(appCode: string, loginDto: LoginDto) {
    const userData: UserEntity = await this.userRepository.findOneBy({
      username: loginDto.username,
      password: loginDto.password
    });

    if (!userData) {
      throw CusHttpException.error(CustomErrorCode['61003'], CustomErrorMsgMap['61003']);
    }

    // 校验用户是否绑定了该应用
    await this.isUserApplication(userData.id, appCode);

    const user = await this.detail(userData.id);

    const access_token = this.sign(userData);

    return { user, access_token };
  }

  // 注册
  async register(loginDto: LoginDto, appCode: string) {
    const userData: UserEntity = await this.userRepository.add(loginDto);

    await this.userBindApplication({ userId: userData.id, applicationCodes: [appCode] });

    const user = await this.detail(userData.id);

    const access_token = this.sign(userData);

    return { user, access_token };
  }

  // 微信登录
  async wechatLogin(appCode: string, wechatLoginDto: WechatLoginDto): Promise<LoginRes | any> {
    const wxCode2SessionData = await this.wxService.code2Session(wechatLoginDto.code);

    let userData: UserEntity = await this.userRepository.findOneBy({ openid: wxCode2SessionData.openid });
    if (!userData) {
      userData = await this.userRepository.add(wxCode2SessionData);
      // 绑定应用
      await this.userBindApplication({ userId: userData.id, applicationCodes: [appCode] });
    }

    // 校验用户是否绑定了该应用
    await this.isUserApplication(userData.id, appCode);

    const access_token = this.sign(userData);

    return { user: { ...userData }, access_token };
  }

  // 添加用户
  async add(dto: CreateUserDto) {
    const applicationIds = dto.applications;
    const userData = {
      ...dto
    };
    delete userData.applications;

    const user = await this.userRepository.add(userData);

    if (applicationIds) {
      // 绑定应用
      await this.userBindApplication({ userId: user.id, applicationIds });
    }

    return user;
  }

  // 修改用户
  async update(id: number, dto: UpdateUserDto) {
    const applicationIds = dto.applications;
    const userData = { ...dto };
    delete userData.applications;
    await this.userRepository.update(id, userData);
    if (applicationIds) {
      // 绑定应用
      await this.userBindApplication({ userId: id, applicationIds });
    }
    return true;
  }

  // 获取用户列表
  async list(pageDto: BasePageDto, options: FindManyOptions<UserEntity>) {
    const { page = 1, size = 10 } = pageDto;

    const filter = {
      skip: (page - 1) * size,
      take: size,
      ...options
    };

    // 查询用户关联的应用
    const users = await this.userRepository.find(filter);

    // 获取用户关联的应用
    const list = users.map((user) => ({
      ...user,
      applications: user.userApplications.map((ua) => ua.application)
    }));

    // 再单独查询总数
    const total = await this.repo.count({
      where: options.where
    });

    return {
      list: list as UserEntity[],
      total,
      page,
      size
    };
  }
}
