import { UserModule } from './user.module';
import { registerProject } from '@app/common/utils';

async function bootstrap() {
  await registerProject(UserModule);
}
bootstrap();
