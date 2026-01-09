import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { SysService } from './sys.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CusIsAuth, JwtPayload } from '@app/common';
import { CusHeader, CusReturnType } from '@app/common/public/decorator/interceptor.decorator';
import { CreateUserRes, DetailUserRes, ListUserRes, LoginRes } from './dto/res-userinfo.dto';
import {
  CreateUserDto,
  DeleteUserDto,
  ListUserDto,
  LoginDto,
  RegisterDto,
  UpdateUserDto,
  WechatLoginDto
} from './dto/req-userinfo.dto';
import { createCrudController } from '@app/common/utils/crud/crud.controller';
import { UserApplicationEntity, UserEntity } from '@user/entities';
import { DtoPipe } from '@app/common/public/pipe/dto.pipe';
import { IdPipe } from '@app/common/public/pipe/id.pipe';
import { FindManyOptions, ILike } from 'typeorm';

const BaseController = createCrudController({
  tag: '用户-系统',
  entity: UserEntity,
  service: SysService,
  config: {},
  req: {
    createDto: CreateUserDto,
    updateDto: UpdateUserDto,
    listDto: ListUserDto
  },
  res: {
    createRes: CreateUserRes,
    listRes: ListUserDto,
    detailRes: DetailUserRes
  }
});

@Controller('sys')
export class SysController extends BaseController {
  constructor(private readonly sysService: SysService) {
    super(sysService);
  }

  @ApiOperation({ summary: '登录' })
  @CusHeader()
  @CusReturnType(LoginRes)
  @Post('login')
  async login(@Req() req: any, @Body() loginDto: LoginDto) {
    return await this.sysService.login(req.appCode, loginDto);
  }

  @ApiOperation({ summary: '注册' })
  @CusHeader()
  @CusReturnType(LoginRes)
  @Post('register')
  async register(@Req() req: any, @Body() registerDto: RegisterDto) {
    return await this.sysService.register(registerDto, req.appCode);
  }

  @ApiOperation({ summary: '微信登录/注册' })
  @CusHeader()
  @CusReturnType(LoginRes)
  @Post('wechatLogin')
  async wechatLogin(@Req() req: any, @Body() wechatLoginDto: WechatLoginDto) {
    return await this.sysService.wechatLogin(req.appCode, wechatLoginDto);
  }

  @ApiOperation({ summary: '用户信息' })
  @CusReturnType(DetailUserRes)
  @CusIsAuth()
  @Get('userinfo')
  async userinfo(@Req() req: { user: JwtPayload }) {
    return await this.sysService.detail(req.user.id);
  }

  /////// CRUD
  @ApiOperation({ summary: '新增' })
  @ApiBody({ type: CreateUserDto })
  @CusReturnType(CreateUserRes)
  @CusIsAuth()
  @Post()
  async add(@Req() req: { user: JwtPayload }, @Body(new DtoPipe(CreateUserDto)) dto: CreateUserDto) {
    return this.sysService.add(dto);
  }

  @ApiOperation({ summary: '更新' })
  @ApiParam({ name: 'id', type: Number, description: '数据id' })
  @ApiBody({ type: UpdateUserDto })
  @CusReturnType(Boolean, { isBoolean: true })
  @CusIsAuth()
  @Put(':id')
  async update(
    @Req() req: { user: JwtPayload },
    @Param('id', new IdPipe()) id: number,
    @Body(new DtoPipe(UpdateUserDto)) dto: UpdateUserDto
  ) {
    return this.sysService.update(id, dto);
  }

  @ApiOperation({ summary: '删除' })
  @ApiParam({ name: 'id', type: Number, description: '数据id' })
  @CusReturnType(Boolean, { isBoolean: true })
  @CusIsAuth()
  @Delete(':id')
  async deleteUser(@Query() deleteUserDto: DeleteUserDto) {
    return this.sysService.removeWithRelations(deleteUserDto.id, [{ field: 'user_id', entity: UserApplicationEntity }]);
  }

  @ApiOperation({ summary: '分页列表' })
  @ApiQuery({ type: ListUserDto })
  @CusIsAuth()
  @CusReturnType(ListUserRes)
  @Get()
  async list(@Query(new DtoPipe(ListUserDto)) query: ListUserDto) {
    const pageDto = { page: query.page || 1, size: query.size || 10 };
    const optionsDto = { ...query };
    delete optionsDto.page;
    delete optionsDto.size;

    console.log(query, 9);

    const where: FindManyOptions<UserEntity>['where'] = {};

    Object.keys(optionsDto).forEach((key) => {
      if (optionsDto[key] !== undefined && optionsDto[key] !== null && optionsDto[key] !== '') {
        where[key] = optionsDto[key];
      }
    });

    // 模糊搜索
    if (optionsDto.username) {
      where.username = ILike(`%${optionsDto.username}%`);
    }

    const options = { where, relations: ['userApplications', 'userApplications.application'] };

    return this.sysService.list(pageDto, options);
  }
}
