import { Controller, Get } from '@nestjs/common';
import type { IHealthCheckResponse } from './interfaces';

@Controller({
  path: 'healthcheck',
})
export class HealthcheckController {
  @Get()
  public getStatus(): IHealthCheckResponse {
    return {
      uptime: process.uptime(),
      message: 'Ok',
      date: new Date(),
    };
  }
}
