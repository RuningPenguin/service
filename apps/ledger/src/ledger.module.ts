import { Module } from '@nestjs/common';
import { ConfigModule, DatabaseModule, LoggerModule } from '@app/common';
import { join } from 'node:path';
import { getModules } from '@app/common/utils';

@Module({
  imports: [
    ConfigModule.forRoot('ledger'),
    LoggerModule.forRoot('ledger'),
    DatabaseModule.forRoot(join(__dirname, 'entities/**/*.entity{.ts,.js}')),
    ...getModules(join(__dirname, 'modules'), ['.module.ts', '.module.js'])
  ]
})
export class LedgerModule {}
