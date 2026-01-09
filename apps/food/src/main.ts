import { FoodModule } from './food.module';
import { registerProject } from '@app/common/utils';

async function bootstrap() {
  await registerProject(FoodModule);
}
bootstrap();
