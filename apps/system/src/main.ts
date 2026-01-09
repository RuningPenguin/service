import { SystemModule } from './system.module';
import { registerProject } from '@app/common/utils';

async function bootstrap() {
  await registerProject(SystemModule);
}
bootstrap();
