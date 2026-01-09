import { LedgerService } from './ledger.service';
import { LedgerEntity } from '../../entities/ledger';
import { createCrudController } from '@app/common/utils/crud/crud.controller';
import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import {
  CreateLedgerDto,
  CreateLedgerRes,
  DetailLedgerAndUsersRes,
  DetailLedgerRes,
  ListLedgerDto,
  ListLedgerRes,
  UpdateLedgerDto
} from './dto';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CusReturnType } from '@app/common/public/decorator/interceptor.decorator';
import { CusIsAuth, JwtPayload } from '@app/common';
import { IdPipe } from '@app/common/public/pipe/id.pipe';
import { ClassifyEntity } from '../../entities/classify';
import { BillEntity } from '../../entities/bill';
import { LedgerUserEntity } from '../../entities/ledger_user';
import { DtoPipe } from '@app/common/public/pipe/dto.pipe';

const BaseController = createCrudController({
  tag: '账本-账本',
  entity: LedgerEntity,
  service: LedgerService,
  config: {},
  req: {
    createDto: CreateLedgerDto,
    updateDto: UpdateLedgerDto,
    listDto: ListLedgerDto
  },
  res: {
    createRes: CreateLedgerRes,
    listRes: ListLedgerRes,
    detailRes: DetailLedgerRes
  }
});

@Controller('ledger')
export class LedgerController extends BaseController {
  constructor(private readonly ledgerService: LedgerService) {
    super(ledgerService);
  }

  @ApiOperation({ summary: '加入账本' })
  @ApiParam({ name: 'id', type: Number, description: '账本id' })
  @CusReturnType(Boolean, { isBoolean: true })
  @CusIsAuth()
  @Post('join/:id')
  joinLedger(@Req() req: { user: JwtPayload }, @Param('id', new IdPipe()) ledgerId: number) {
    const userId = req.user.id;
    return this.ledgerService.joinLedger(userId, ledgerId);
  }

  @ApiOperation({ summary: '邀请用户加入账本' })
  @ApiParam({ name: 'id', type: Number, description: '被邀请人id' })
  @CusReturnType(Boolean, { isBoolean: true })
  @CusIsAuth()
  @Post('invite/:id')
  inviteLedger(@Req() req: { user: JwtPayload }, @Param('id', new IdPipe()) friendId: number) {
    const userId = req.user.id;
    return this.ledgerService.inviteLedger(userId, friendId);
  }

  @ApiOperation({ summary: '退出账本' })
  @CusReturnType(Boolean, { isBoolean: true })
  @CusIsAuth()
  @Post('quit/:id')
  quitLedger(@Req() req: { user: JwtPayload }, @Param('id', new IdPipe()) ledgerId: number) {
    const userId = req.user.id;
    return this.ledgerService.quitLedger(userId, ledgerId);
  }

  @ApiOperation({ summary: '新增' })
  @ApiBody({ type: CreateLedgerDto })
  @CusReturnType(CreateLedgerRes)
  @CusIsAuth()
  @Post()
  async add(@Req() req: { user: JwtPayload }, @Body(new DtoPipe(CreateLedgerDto)) dto: CreateLedgerDto) {
    const userId = req.user.id;
    const ledgerData = await this.ledgerService.add({ ...dto, userId });
    await this.ledgerService.createLedgerUserRelations({ userId, ledgerId: ledgerData.id, role: 'owner' });
    return ledgerData;
  }

  @ApiOperation({ summary: '删除' })
  @ApiParam({ name: 'id', type: Number, description: '数据id' })
  @CusReturnType(Boolean, { isBoolean: true })
  @CusIsAuth()
  @Delete(':id')
  remove(@Param('id', new IdPipe()) id: number) {
    return this.ledgerService.removeWithRelations(id, [
      { field: 'id', entity: LedgerEntity },
      { field: 'ledgerId', entity: LedgerUserEntity },
      { field: 'ledgerId', entity: ClassifyEntity },
      { field: 'ledgerId', entity: BillEntity }
    ]);
  }

  @ApiOperation({ summary: '获取用户账本' })
  @CusReturnType(DetailLedgerAndUsersRes)
  @CusIsAuth()
  @Get('userLedger')
  getUserLedger(@Req() req: { user: JwtPayload }) {
    console.log(req.user.id);
    return this.ledgerService.getUserLedger(req.user.id);
  }
}
