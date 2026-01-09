import { LedgerModule } from './ledger.module';
import { registerProject } from '@app/common/utils';

async function bootstrap() {
  await registerProject(LedgerModule);
}
bootstrap();
