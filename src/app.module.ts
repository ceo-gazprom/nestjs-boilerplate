import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/databse.module';
import { HealthcheckController } from './healthcheck/healthcheck.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [HealthcheckController],
})
export class AppModule {}
