import { DatabaseModule } from './database';
import { HealthcheckController } from './healthcheck/healthcheck.controller';


@Module({
  imports: [
    DatabaseModule,
  ],
  controller: [HealthcheckController]
})
export class AppModule {}
